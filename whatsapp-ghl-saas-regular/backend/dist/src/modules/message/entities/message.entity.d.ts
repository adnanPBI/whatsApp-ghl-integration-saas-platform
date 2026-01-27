import { GhlSubaccount } from '../../ghl/entities/ghl-subaccount.entity';
import { WhatsappAccount } from '../../whatsapp/entities/whatsapp-account.entity';
import { Contact } from '../../contact/entities/contact.entity';
export declare class Message {
    id: string;
    ghl_subaccount_id: string;
    whatsapp_account_id: string;
    contact_id: string;
    ghl_message_id: string;
    whatsapp_message_id: string;
    direction: string;
    status: string;
    message_type: string;
    content: string;
    media_url: string;
    error_message: string;
    from_number: string;
    to_number: string;
    delivered_at: Date;
    read_at: Date;
    metadata: Record<string, any>;
    created_at: Date;
    ghl_subaccount: GhlSubaccount;
    whatsapp_account: WhatsappAccount;
    contact: Contact;
}
