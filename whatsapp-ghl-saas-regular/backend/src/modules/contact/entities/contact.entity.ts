import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { GhlSubaccount } from '../../ghl/entities/ghl-subaccount.entity';

@Entity('contacts')
@Index(['ghl_subaccount_id', 'ghl_contact_id'], { unique: true })
@Index(['ghl_subaccount_id', 'whatsapp_number'], { unique: true })
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ghl_subaccount_id: string;

  @Column()
  ghl_contact_id: string;

  @Column()
  whatsapp_number: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_message_at: Date;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => GhlSubaccount, (subaccount) => subaccount.contacts)
  @JoinColumn({ name: 'ghl_subaccount_id' })
  ghl_subaccount: GhlSubaccount;
}
