import { Tenant } from '../../tenant/entities/tenant.entity';
import { WhatsappAccount } from '../../whatsapp/entities/whatsapp-account.entity';
import { Contact } from '../../contact/entities/contact.entity';
export declare class GhlSubaccount {
    id: string;
    tenant_id: string;
    ghl_location_id: string;
    ghl_company_id: string;
    name: string;
    access_token: string;
    refresh_token: string;
    token_expires_at: Date;
    webhook_url: string;
    is_active: boolean;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    tenant: Tenant;
    whatsapp_accounts: WhatsappAccount[];
    contacts: Contact[];
}
