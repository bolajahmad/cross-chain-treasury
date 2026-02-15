module.exports = class Data1771131977187 {
    name = 'Data1771131977187'

    async up(db) {
        await db.query(`CREATE TABLE "action" ("id" character varying NOT NULL, "block" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "action_id" text NOT NULL, "action_type" integer NOT NULL, "params" text NOT NULL, "value" numeric NOT NULL, "status" text NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_2043200f6a1fe390a69573246a" ON "action" ("block") `)
        await db.query(`CREATE INDEX "IDX_12a0c4a344dbaebcd68c8f3d1e" ON "action" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_5faf700dad0c8b77097ebefa53" ON "action" ("action_id") `)
        await db.query(`CREATE INDEX "IDX_4554954b02dbcea2ed136fcd48" ON "action" ("tx_hash") `)
        await db.query(`CREATE TABLE "role" ("id" character varying NOT NULL, "block" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "role" text NOT NULL, "account" text NOT NULL, "sender" text NOT NULL, "tx_hash" text NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f8ee82516941855a987e23bab8" ON "role" ("block") `)
        await db.query(`CREATE INDEX "IDX_c49180c48f8ed8eb5a40fbafd6" ON "role" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_ae3e5609248825d069dfec4d55" ON "role" ("tx_hash") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "action"`)
        await db.query(`DROP INDEX "public"."IDX_2043200f6a1fe390a69573246a"`)
        await db.query(`DROP INDEX "public"."IDX_12a0c4a344dbaebcd68c8f3d1e"`)
        await db.query(`DROP INDEX "public"."IDX_5faf700dad0c8b77097ebefa53"`)
        await db.query(`DROP INDEX "public"."IDX_4554954b02dbcea2ed136fcd48"`)
        await db.query(`DROP TABLE "role"`)
        await db.query(`DROP INDEX "public"."IDX_f8ee82516941855a987e23bab8"`)
        await db.query(`DROP INDEX "public"."IDX_c49180c48f8ed8eb5a40fbafd6"`)
        await db.query(`DROP INDEX "public"."IDX_ae3e5609248825d069dfec4d55"`)
    }
}
