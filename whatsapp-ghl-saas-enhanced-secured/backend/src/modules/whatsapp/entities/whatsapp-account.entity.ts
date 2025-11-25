import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { GhlSubaccount } from '../../ghl/entities/ghl-subaccount.entity';

@Entity('whatsapp_accounts')
export class WhatsappAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  ghl_subaccount_id: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ unique: true })
  phone_number_id: string;

  @Column()
  waba_id: string;

  @Column({ nullable: true })
  business_name: string;

  @Column({ type: 'text' })
  access_token: string;

  @Column()
  webhook_verify_token: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  quality_rating: string;

  @Column({ nullable: true })
  messaging_limit: string;

  @Column({ type: 'timestamp', nullable: true })
  last_synced_at: Date;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => GhlSubaccount, (subaccount) => subaccount.whatsapp_accounts)
  @JoinColumn({ name: 'ghl_subaccount_id' })
  ghl_subaccount: GhlSubaccount;
}
