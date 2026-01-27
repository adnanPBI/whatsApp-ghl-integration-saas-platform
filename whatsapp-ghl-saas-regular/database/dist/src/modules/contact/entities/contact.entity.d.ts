import { GhlSubaccount } from '../../ghl/entities/ghl-subaccount.entity';
export declare class Contact {
    id: string;
    ghl_subaccount_id: string;
    ghl_contact_id: string;
    whatsapp_number: string;
    name: string;
    email: string;
    is_active: boolean;
    last_message_at: Date;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    ghl_subaccount: GhlSubaccount;
}
