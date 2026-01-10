module.exports = class Data1767957741005 {
    name = 'Data1767957741005'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "network" text NOT NULL, "block" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "value" numeric NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_024eb30e5fd99a5bea7befe60e" ON "transfer" ("network") `)
        await db.query(`CREATE INDEX "IDX_c116ab40c3b32ca2d9c1d17d8b" ON "transfer" ("block") `)
        await db.query(`CREATE INDEX "IDX_70ff8b624c3118ac3a4862d22c" ON "transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_be54ea276e0f665ffc38630fc0" ON "transfer" ("from") `)
        await db.query(`CREATE INDEX "IDX_4cbc37e8c3b47ded161f44c24f" ON "transfer" ("to") `)
        await db.query(`CREATE INDEX "IDX_f605a03972b4f28db27a0ee70d" ON "transfer" ("tx_hash") `)
        await db.query(`CREATE TABLE "action" ("id" character varying NOT NULL, "network" text NOT NULL, "block" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "action_id" text NOT NULL, "action_type" integer NOT NULL, "params" text NOT NULL, "value" numeric NOT NULL, "status" text NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ab399125e7654e4ce831bc7299" ON "action" ("network") `)
        await db.query(`CREATE INDEX "IDX_2043200f6a1fe390a69573246a" ON "action" ("block") `)
        await db.query(`CREATE INDEX "IDX_12a0c4a344dbaebcd68c8f3d1e" ON "action" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_5faf700dad0c8b77097ebefa53" ON "action" ("action_id") `)
        await db.query(`CREATE INDEX "IDX_4554954b02dbcea2ed136fcd48" ON "action" ("tx_hash") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_024eb30e5fd99a5bea7befe60e"`)
        await db.query(`DROP INDEX "public"."IDX_c116ab40c3b32ca2d9c1d17d8b"`)
        await db.query(`DROP INDEX "public"."IDX_70ff8b624c3118ac3a4862d22c"`)
        await db.query(`DROP INDEX "public"."IDX_be54ea276e0f665ffc38630fc0"`)
        await db.query(`DROP INDEX "public"."IDX_4cbc37e8c3b47ded161f44c24f"`)
        await db.query(`DROP INDEX "public"."IDX_f605a03972b4f28db27a0ee70d"`)
        await db.query(`DROP TABLE "action"`)
        await db.query(`DROP INDEX "public"."IDX_ab399125e7654e4ce831bc7299"`)
        await db.query(`DROP INDEX "public"."IDX_2043200f6a1fe390a69573246a"`)
        await db.query(`DROP INDEX "public"."IDX_12a0c4a344dbaebcd68c8f3d1e"`)
        await db.query(`DROP INDEX "public"."IDX_5faf700dad0c8b77097ebefa53"`)
        await db.query(`DROP INDEX "public"."IDX_4554954b02dbcea2ed136fcd48"`)
    }
}
