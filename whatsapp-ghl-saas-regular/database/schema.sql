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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

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
