import { GhlSubaccount } from '../../ghl/entities/ghl-subaccount.entity';
export declare class Tenant {
    id: string;
    name: string;
    email: string;
    status: string;
    subscription_tier: string;
    monthly_price: number;
    trial_ends_at: Date;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    ghl_subaccounts: GhlSubaccount[];
}
