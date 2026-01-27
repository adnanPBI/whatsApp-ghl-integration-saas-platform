import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1769507201203 implements MigrationInterface {
    name = 'InitSchema1769507201203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "whatsapp_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "ghl_subaccount_id" uuid NOT NULL, "phone_number" character varying NOT NULL, "phone_number_id" character varying NOT NULL, "waba_id" character varying NOT NULL, "business_name" character varying, "access_token" text NOT NULL, "webhook_verify_token" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "quality_rating" character varying, "messaging_limit" character varying, "last_synced_at" TIMESTAMP, "metadata" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1b6189d62015a45fb00ec00c6d0" UNIQUE ("phone_number"), CONSTRAINT "UQ_b261070c7cc1e0149a0000f4f41" UNIQUE ("phone_number_id"), CONSTRAINT "PK_7b68a09f30ca28e87f73c9e844b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ghl_subaccount_id" uuid NOT NULL, "ghl_contact_id" character varying NOT NULL, "whatsapp_number" character varying NOT NULL, "name" character varying, "email" character varying, "is_active" boolean NOT NULL DEFAULT true, "last_message_at" TIMESTAMP, "metadata" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6fbfc7fb1b1b88a3caf1261bd3" ON "contacts" ("ghl_subaccount_id", "whatsapp_number") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_12c91106d1a310f5bd94141c09" ON "contacts" ("ghl_subaccount_id", "ghl_contact_id") `);
        await queryRunner.query(`CREATE TABLE "ghl_subaccounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "ghl_location_id" character varying NOT NULL, "ghl_company_id" character varying, "name" character varying, "access_token" text, "refresh_token" text, "token_expires_at" TIMESTAMP, "webhook_url" text, "is_active" boolean NOT NULL DEFAULT true, "metadata" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d58826a6a550879cd05bae4cb36" UNIQUE ("ghl_location_id"), CONSTRAINT "PK_d690b9570f5f05b7f7a7481d1b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'trial', "subscription_tier" character varying NOT NULL DEFAULT 'starter', "monthly_price" numeric(10,2), "trial_ends_at" TIMESTAMP, "metadata" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_155c343439adc83ada6ee3f48be" UNIQUE ("email"), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ghl_subaccount_id" uuid NOT NULL, "whatsapp_account_id" uuid NOT NULL, "contact_id" uuid, "ghl_message_id" character varying, "whatsapp_message_id" character varying, "direction" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "message_type" character varying NOT NULL, "content" text, "media_url" text, "error_message" text, "from_number" character varying NOT NULL, "to_number" character varying NOT NULL, "delivered_at" TIMESTAMP, "read_at" TIMESTAMP, "metadata" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_befd307485dbf0559d17e4a4d2" ON "messages" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_0777b63da90c27d6ed993dc60b" ON "messages" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_d109211ed510ef10617c5e7592" ON "messages" ("contact_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6c1a68ecc8ee81172af0141e87" ON "messages" ("ghl_subaccount_id") `);
        await queryRunner.query(`ALTER TABLE "whatsapp_accounts" ADD CONSTRAINT "FK_02f21802c06f6139e91f5408074" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "whatsapp_accounts" ADD CONSTRAINT "FK_022a285141b98263156f38b1bbb" FOREIGN KEY ("ghl_subaccount_id") REFERENCES "ghl_subaccounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "FK_48cd0daaf6553ace81c74b4cfab" FOREIGN KEY ("ghl_subaccount_id") REFERENCES "ghl_subaccounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ghl_subaccounts" ADD CONSTRAINT "FK_0d793dcc64ee58e2a73959bf24a" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_6c1a68ecc8ee81172af0141e879" FOREIGN KEY ("ghl_subaccount_id") REFERENCES "ghl_subaccounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_539a851ecb547adc82d168a7c6a" FOREIGN KEY ("whatsapp_account_id") REFERENCES "whatsapp_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_d109211ed510ef10617c5e75927" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_d109211ed510ef10617c5e75927"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_539a851ecb547adc82d168a7c6a"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_6c1a68ecc8ee81172af0141e879"`);
        await queryRunner.query(`ALTER TABLE "ghl_subaccounts" DROP CONSTRAINT "FK_0d793dcc64ee58e2a73959bf24a"`);
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "FK_48cd0daaf6553ace81c74b4cfab"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_accounts" DROP CONSTRAINT "FK_022a285141b98263156f38b1bbb"`);
        await queryRunner.query(`ALTER TABLE "whatsapp_accounts" DROP CONSTRAINT "FK_02f21802c06f6139e91f5408074"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6c1a68ecc8ee81172af0141e87"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d109211ed510ef10617c5e7592"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0777b63da90c27d6ed993dc60b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_befd307485dbf0559d17e4a4d2"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP TABLE "ghl_subaccounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12c91106d1a310f5bd94141c09"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6fbfc7fb1b1b88a3caf1261bd3"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "whatsapp_accounts"`);
    }

}
