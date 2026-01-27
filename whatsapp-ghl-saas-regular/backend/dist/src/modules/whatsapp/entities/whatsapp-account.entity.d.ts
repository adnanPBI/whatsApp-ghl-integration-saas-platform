import { Tenant } from '../../tenant/entities/tenant.entity';
import { GhlSubaccount } from '../../ghl/entities/ghl-subaccount.entity';
export declare class WhatsappAccount {
    id: string;
    tenant_id: string;
    ghl_subaccount_id: string;
    phone_number: string;
    phone_number_id: string;
    waba_id: string;
    business_name: string;
    access_token: string;
    webhook_verify_token: string;
    status: string;
    quality_rating: string;
    messaging_limit: string;
    last_synced_at: Date;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    tenant: Tenant;
    ghl_subaccount: GhlSubaccount;
}
