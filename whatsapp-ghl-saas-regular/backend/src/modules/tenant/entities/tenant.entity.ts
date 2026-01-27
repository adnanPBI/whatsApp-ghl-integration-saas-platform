import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GhlSubaccount } from '../../ghl/entities/ghl-subaccount.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'trial' })
  status: string;

  @Column({ default: 'starter' })
  subscription_tier: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthly_price: number;

  @Column({ type: 'timestamp', nullable: true })
  trial_ends_at: Date;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => GhlSubaccount, (subaccount) => subaccount.tenant)
  ghl_subaccounts: GhlSubaccount[];
}
