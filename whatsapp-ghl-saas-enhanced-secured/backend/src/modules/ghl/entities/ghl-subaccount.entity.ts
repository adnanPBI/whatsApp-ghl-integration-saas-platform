import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { WhatsappAccount } from '../../whatsapp/entities/whatsapp-account.entity';
import { Contact } from '../../contact/entities/contact.entity';

@Entity('ghl_subaccounts')
export class GhlSubaccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column({ unique: true })
  ghl_location_id: string;

  @Column({ nullable: true })
  ghl_company_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  access_token: string;

  @Column({ type: 'text', nullable: true })
  refresh_token: string;

  @Column({ type: 'timestamp', nullable: true })
  token_expires_at: Date;

  @Column({ type: 'text', nullable: true })
  webhook_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.ghl_subaccounts)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => WhatsappAccount, (account) => account.ghl_subaccount)
  whatsapp_accounts: WhatsappAccount[];

  @OneToMany(() => Contact, (contact) => contact.ghl_subaccount)
  contacts: Contact[];
}
