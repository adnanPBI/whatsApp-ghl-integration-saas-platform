#!/usr/bin/env python3
"""
Generate TypeORM entities for WhatsApp-GHL Integration
"""

import os

ENTITIES = {
    "tenant": """import {
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
""",
    "ghl-subaccount": """import {
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
""",
    "whatsapp-account": """import {
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
""",
    "contact": """import {
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
""",
    "message": """import {
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
""",
}

def write_entity(name, content):
    """Write entity file to appropriate module directory"""
    path_map = {
        "tenant": "backend/src/modules/tenant/entities/tenant.entity.ts",
        "ghl-subaccount": "backend/src/modules/ghl/entities/ghl-subaccount.entity.ts",
        "whatsapp-account": "backend/src/modules/whatsapp/entities/whatsapp-account.entity.ts",
        "contact": "backend/src/modules/contact/entities/contact.entity.ts",
        "message": "backend/src/modules/message/entities/message.entity.ts",
    }

    filepath = path_map[name]
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, 'w') as f:
        f.write(content)

    print(f"✅ Created {filepath}")

if __name__ == "__main__":
    print("🚀 Generating TypeORM entities...")
    for name, content in ENTITIES.items():
        write_entity(name, content)
    print("✅ All entities generated successfully!")
