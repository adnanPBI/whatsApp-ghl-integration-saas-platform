import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GhlSubaccount } from '../../ghl/entities/ghl-subaccount.entity';
import { WhatsappAccount } from '../../whatsapp/entities/whatsapp-account.entity';
import { Contact } from '../../contact/entities/contact.entity';

@Entity('messages')
@Index(['ghl_subaccount_id'])
@Index(['contact_id'])
@Index(['created_at'])
@Index(['status'])
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ghl_subaccount_id: string;

  @Column()
  whatsapp_account_id: string;

  @Column({ nullable: true })
  contact_id: string;

  @Column({ nullable: true })
  ghl_message_id: string;

  @Column({ nullable: true })
  whatsapp_message_id: string;

  @Column()
  direction: string;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  message_type: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  media_url: string;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column()
  from_number: string;

  @Column()
  to_number: string;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  read_at: Date;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => GhlSubaccount)
  @JoinColumn({ name: 'ghl_subaccount_id' })
  ghl_subaccount: GhlSubaccount;

  @ManyToOne(() => WhatsappAccount)
  @JoinColumn({ name: 'whatsapp_account_id' })
  whatsapp_account: WhatsappAccount;

  @ManyToOne(() => Contact)
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;
}
