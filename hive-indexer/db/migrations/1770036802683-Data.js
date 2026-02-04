module.exports = class Data1770036802683 {
    name = 'Data1770036802683'

    async up(db) {
        await db.query(`CREATE TABLE "bounty" ("id" character varying NOT NULL, "client" text NOT NULL, "amount" numeric NOT NULL, "code_uri" text NOT NULL, "is_open" boolean NOT NULL, "report_uri" text, "created_at" numeric NOT NULL, "closed_at" numeric, "tx_hash" text NOT NULL, "assigned_agent_id" character varying, "completed_by_id" character varying, CONSTRAINT "PK_afc9754b790b0effd1d59257f4d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_26f908fb69dc8ac19634a08ba3" ON "bounty" ("assigned_agent_id") `)
        await db.query(`CREATE INDEX "IDX_14167d88817aee1145fc16369a" ON "bounty" ("completed_by_id") `)
        await db.query(`CREATE TABLE "agent" ("id" character varying NOT NULL, "name" text NOT NULL, "bio" text, "registered_at" numeric NOT NULL, "reputation" numeric NOT NULL, "is_active" boolean NOT NULL, CONSTRAINT "PK_1000e989398c5d4ed585cf9a46f" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "bounty" ADD CONSTRAINT "FK_26f908fb69dc8ac19634a08ba39" FOREIGN KEY ("assigned_agent_id") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "bounty" ADD CONSTRAINT "FK_14167d88817aee1145fc16369a4" FOREIGN KEY ("completed_by_id") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "bounty"`)
        await db.query(`DROP INDEX "public"."IDX_26f908fb69dc8ac19634a08ba3"`)
        await db.query(`DROP INDEX "public"."IDX_14167d88817aee1145fc16369a"`)
        await db.query(`DROP TABLE "agent"`)
        await db.query(`ALTER TABLE "bounty" DROP CONSTRAINT "FK_26f908fb69dc8ac19634a08ba39"`)
        await db.query(`ALTER TABLE "bounty" DROP CONSTRAINT "FK_14167d88817aee1145fc16369a4"`)
    }
}
