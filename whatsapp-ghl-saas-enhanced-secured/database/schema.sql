-- WhatsApp-GHL Integration SaaS Platform Database Schema
-- PostgreSQL 15+

-- Core tenant/account management
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'trial', -- trial, active, suspended, cancelled
    subscription_tier VARCHAR(50) DEFAULT 'starter', -- starter, growth, enterprise
    monthly_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trial_ends_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_email ON tenants(email);

-- GHL Sub-accounts (each tenant can have multiple)
CREATE TABLE ghl_subaccounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    ghl_location_id VARCHAR(255) UNIQUE NOT NULL,
    ghl_company_id VARCHAR(255),
    name VARCHAR(255),
    access_token TEXT, -- Encrypted
    refresh_token TEXT, -- Encrypted
    token_expires_at TIMESTAMP,
    webhook_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_ghl_subaccounts_tenant ON ghl_subaccounts(tenant_id);
CREATE INDEX idx_ghl_subaccounts_location ON ghl_subaccounts(ghl_location_id);

-- WhatsApp Business Accounts
CREATE TABLE whatsapp_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    ghl_subaccount_id UUID REFERENCES ghl_subaccounts(id) ON DELETE CASCADE,
    phone_number VARCHAR(50) UNIQUE NOT NULL,
    phone_number_id VARCHAR(255) UNIQUE NOT NULL,
    waba_id VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    access_token TEXT, -- Encrypted
    webhook_verify_token VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, verified, active, suspended
    quality_rating VARCHAR(50), -- HIGH, MEDIUM, LOW
    messaging_limit VARCHAR(50), -- TIER_1K, TIER_10K, TIER_100K, TIER_UNLIMITED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_whatsapp_accounts_tenant ON whatsapp_accounts(tenant_id);
CREATE INDEX idx_whatsapp_accounts_subaccount ON whatsapp_accounts(ghl_subaccount_id);
CREATE INDEX idx_whatsapp_accounts_phone_number_id ON whatsapp_accounts(phone_number_id);

-- Contact mapping (GHL Contact <-> WhatsApp Number)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ghl_subaccount_id UUID REFERENCES ghl_subaccounts(id) ON DELETE CASCADE,
    ghl_contact_id VARCHAR(255) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    UNIQUE(ghl_subaccount_id, ghl_contact_id),
    UNIQUE(ghl_subaccount_id, whatsapp_number)
);

CREATE INDEX idx_contacts_subaccount ON contacts(ghl_subaccount_id);
CREATE INDEX idx_contacts_ghl_contact ON contacts(ghl_contact_id);
CREATE INDEX idx_contacts_whatsapp_number ON contacts(whatsapp_number);

-- Message logs
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ghl_subaccount_id UUID REFERENCES ghl_subaccounts(id) ON DELETE CASCADE,
    whatsapp_account_id UUID REFERENCES whatsapp_accounts(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    ghl_message_id VARCHAR(255),
    whatsapp_message_id VARCHAR(255),
    direction VARCHAR(20) NOT NULL, -- inbound, outbound
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, read, failed
    message_type VARCHAR(50), -- text, image, video, document, audio, location
    content TEXT,
    media_url TEXT,
    error_message TEXT,
    from_number VARCHAR(50),
    to_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_messages_ghl_subaccount ON messages(ghl_subaccount_id);
CREATE INDEX idx_messages_whatsapp_account ON messages(whatsapp_account_id);
CREATE INDEX idx_messages_contact ON messages(contact_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_direction ON messages(direction);

-- Webhook events log
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(50) NOT NULL, -- whatsapp, ghl
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhook_events_processed ON webhook_events(processed, created_at);
CREATE INDEX idx_webhook_events_source ON webhook_events(source);

-- API Keys for customer authentication
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    name VARCHAR(255),
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- Billing/Usage tracking
CREATE TABLE usage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    ghl_subaccount_id UUID REFERENCES ghl_subaccounts(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- messages_sent, messages_received
    count INTEGER DEFAULT 0,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, ghl_subaccount_id, metric_type, period_start)
);

CREATE INDEX idx_usage_metrics_tenant ON usage_metrics(tenant_id);
CREATE INDEX idx_usage_metrics_period ON usage_metrics(period_start, period_end);

-- System configuration
CREATE TABLE system_config (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    prev_hash VARCHAR(255), -- hash of previous audit entry for immutability chain
    entry_hash VARCHAR(255), -- hash of this entry for tamper detection
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_hash ON audit_logs(entry_hash);

-- RBAC users & roles
CREATE TABLE tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'agent', -- admin, agent, auditor
    display_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, disabled, locked
    last_login_at TIMESTAMP,
    device_trust_score NUMERIC(5,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_tenant_users_role ON tenant_users(role);
CREATE INDEX idx_tenant_users_status ON tenant_users(status);

CREATE TABLE rbac_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, permission)
);

CREATE TABLE rbac_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- admin, agent, auditor or custom
    permission_id UUID REFERENCES rbac_permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, role, permission_id)
);

-- Just-in-time secrets & rotation
CREATE TABLE tenant_secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    key_id VARCHAR(100) NOT NULL,
    encrypted_secret TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, rotated, revoked, expired
    issued_for VARCHAR(100), -- whatsapp_account_id or integration target
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    rotated_at TIMESTAMP,
    rotated_by VARCHAR(255),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    UNIQUE(tenant_id, key_id)
);

CREATE INDEX idx_tenant_secrets_tenant_status ON tenant_secrets(tenant_id, status);
CREATE INDEX idx_tenant_secrets_expires_at ON tenant_secrets(expires_at);

CREATE TABLE secret_rotation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    key_id VARCHAR(100) NOT NULL,
    rotation_type VARCHAR(50) NOT NULL, -- scheduled, manual, anomaly
    rotated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rotated_by VARCHAR(255),
    previous_secret_id UUID REFERENCES tenant_secrets(id),
    new_secret_id UUID REFERENCES tenant_secrets(id),
    metadata JSONB DEFAULT '{}'
);

-- IP and country allowlists
CREATE TABLE ip_allowlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    label VARCHAR(255),
    ip_cidr VARCHAR(100),
    country_code CHAR(2),
    applies_to VARCHAR(50) DEFAULT 'portal', -- portal, admin, api
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, ip_cidr, country_code, applies_to)
);

-- Device posture tracking
CREATE TABLE device_trust_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES tenant_users(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(255) NOT NULL,
    trust_score NUMERIC(5,2) DEFAULT 0,
    posture JSONB DEFAULT '{}',
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_trusted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, user_id, device_fingerprint)
);

-- Webhook security policies & replay protection
CREATE TABLE webhook_security_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    require_mtls BOOLEAN DEFAULT true,
    allowed_common_names TEXT[],
    min_tls_version VARCHAR(10) DEFAULT '1.2',
    certificate_fingerprint VARCHAR(255),
    nonce_ttl_seconds INTEGER DEFAULT 300,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, endpoint)
);

CREATE TABLE webhook_nonces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    nonce VARCHAR(255) UNIQUE NOT NULL,
    endpoint VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anomaly detection and lockouts
CREATE TABLE anomaly_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    whatsapp_account_id UUID REFERENCES whatsapp_accounts(id) ON DELETE SET NULL,
    metric VARCHAR(100) NOT NULL, -- rate_spike, delivery_drop, failure_spike
    severity VARCHAR(50) DEFAULT 'medium',
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB,
    locked_out BOOLEAN DEFAULT false,
    lockout_expires_at TIMESTAMP,
    alert_channel VARCHAR(50), -- email, slack, pager
    UNIQUE(tenant_id, metric, detected_at)
);

CREATE INDEX idx_anomaly_events_tenant ON anomaly_events(tenant_id, detected_at DESC);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ghl_subaccounts_updated_at BEFORE UPDATE ON ghl_subaccounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_accounts_updated_at BEFORE UPDATE ON whatsapp_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
