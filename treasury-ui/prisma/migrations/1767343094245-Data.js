module.exports = class Data1767343094245 {
    name = 'Data1767343094245'

    async up(db) {
        await db.query(`CREATE TABLE "action_created" ("id" character varying NOT NULL, "action_type" integer NOT NULL, "index" integer NOT NULL, "params" bytea NOT NULL, "block" integer NOT NULL, "txn_hash" text NOT NULL, CONSTRAINT "PK_3f8c5021651dc2824fb235a347b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_84fb728236d56cc080f3773c3e" ON "action_created" ("txn_hash") `)
        await db.query(`CREATE TABLE "treasury_execution" ("id" character varying NOT NULL, "action_type" integer NOT NULL, "amount" numeric NOT NULL, "params" bytea NOT NULL, "block" integer NOT NULL, "txn_hash" text NOT NULL, CONSTRAINT "PK_c29a880175b021ae0b2105d380b" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_1b88ef3ee89f123aee879bcaed" ON "treasury_execution" ("txn_hash") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "action_created"`)
        await db.query(`DROP INDEX "public"."IDX_84fb728236d56cc080f3773c3e"`)
        await db.query(`DROP TABLE "treasury_execution"`)
        await db.query(`DROP INDEX "public"."IDX_1b88ef3ee89f123aee879bcaed"`)
    }
}
