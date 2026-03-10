import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1715000000000 implements MigrationInterface {
    name = 'InitialSchema1715000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Enums
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('admin', 'barber', 'client')`);
        await queryRunner.query(`CREATE TYPE "bookings_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no-show')`);
        await queryRunner.query(`CREATE TYPE "queue_entries_status_enum" AS ENUM('waiting', 'in-progress', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "notifications_type_enum" AS ENUM('sms', 'email')`);
        await queryRunner.query(`CREATE TYPE "notifications_status_enum" AS ENUM('scheduled', 'sent', 'failed')`);
        await queryRunner.query(`CREATE TYPE "payments_status_enum" AS ENUM('pending', 'succeeded', 'failed', 'refunded')`);

        // Create Tables
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "users_role_enum" NOT NULL DEFAULT 'client', CONSTRAINT "UQ_97672db88f1d34d408b90307299" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "barbers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "specialties" text, "working_hours" jsonb, "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid, CONSTRAINT "REL_7493a54970f3f6c5d00159547d" UNIQUE ("user_id"), CONSTRAINT "PK_7493a54970f3f6c5d00159547d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying, "visit_count" integer NOT NULL DEFAULT 0, "notes" text, "user_id" uuid, CONSTRAINT "REL_682260647895499974447ec931" UNIQUE ("user_id"), CONSTRAINT "PK_f1ecd0e3a0ef4538d5f96d16a3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "duration" integer NOT NULL, "price" numeric(10,2) NOT NULL, "category" character varying NOT NULL, CONSTRAINT "PK_ba2d347adaf3bc7afc450037c36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "start_time" WITH TIME ZONE NOT NULL, "end_time" WITH TIME ZONE NOT NULL, "status" "bookings_status_enum" NOT NULL DEFAULT 'pending', "barber_id" uuid, "client_id" uuid, CONSTRAINT "PK_bee6805982cc2e2148466a2735d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "queue_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "position" integer NOT NULL, "status" "queue_entries_status_enum" NOT NULL DEFAULT 'waiting', "estimated_wait_minutes" integer NOT NULL, "client_id" uuid, "barber_id" uuid, CONSTRAINT "PK_64267688749554447ec93198226" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "notifications_type_enum" NOT NULL, "message" text NOT NULL, "scheduled_at" WITH TIME ZONE NOT NULL, "sent_at" WITH TIME ZONE, "status" "notifications_status_enum" NOT NULL DEFAULT 'scheduled', "client_id" uuid, CONSTRAINT "PK_6a72535982cc2e2148466a2735d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "amount" numeric(10,2) NOT NULL, "stripe_payment_intent_id" character varying, "status" "payments_status_enum" NOT NULL DEFAULT 'pending', "booking_id" uuid, CONSTRAINT "REL_7493a54970f3f6c5d00159547e" UNIQUE ("booking_id"), CONSTRAINT "PK_1493a54970f3f6c5d00159547e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "commissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "amount" numeric(10,2) NOT NULL, "rate" numeric(5,2) NOT NULL, "paid_at" WITH TIME ZONE, "barber_id" uuid, "booking_id" uuid, CONSTRAINT "REL_7493a54970f3f6c5d00159547f" UNIQUE ("booking_id"), CONSTRAINT "PK_2493a54970f3f6c5d00159547f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking_services" ("booking_id" uuid NOT NULL, "service_id" uuid NOT NULL, CONSTRAINT "PK_682260647895499974447ec931a" PRIMARY KEY ("booking_id", "service_id"))`);

        // Foreign Keys
        await queryRunner.query(`ALTER TABLE "barbers" ADD CONSTRAINT "FK_7493a54970f3f6c5d00159547d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_682260647895499974447ec931" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_barber_id" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_client_id" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "queue_entries" ADD CONSTRAINT "FK_queue_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notif_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_payment_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commissions" ADD CONSTRAINT "FK_comm_barber" FOREIGN KEY ("barber_id") REFERENCES "barbers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commissions" ADD CONSTRAINT "FK_comm_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_services" ADD CONSTRAINT "FK_bs_booking" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "booking_services" ADD CONSTRAINT "FK_bs_service" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);

        // Indexes
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
        await queryRunner.query(`CREATE INDEX "IDX_barbers_active" ON "barbers" ("is_active")`);
        await queryRunner.query(`CREATE INDEX "IDX_clients_phone" ON "clients" ("phone_number")`);
        await queryRunner.query(`CREATE INDEX "IDX_bookings_start" ON "bookings" ("start_time")`);
        await queryRunner.query(`CREATE INDEX "IDX_notif_scheduled" ON "notifications" ("scheduled_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "booking_services"`);
        await queryRunner.query(`DROP TABLE "commissions"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "queue_entries"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "barbers"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "notifications_status_enum"`);
        await queryRunner.query(`DROP TYPE "notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "queue_entries_status_enum"`);
        await queryRunner.query(`DROP TYPE "bookings_status_enum"`);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
    }
}