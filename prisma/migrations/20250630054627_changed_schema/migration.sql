-- AlterTable
CREATE SEQUENCE content_id_seq;
ALTER TABLE "Content" ALTER COLUMN "id" SET DEFAULT nextval('content_id_seq');
ALTER SEQUENCE content_id_seq OWNED BY "Content"."id";

-- AlterTable
CREATE SEQUENCE link_id_seq;
ALTER TABLE "Link" ALTER COLUMN "id" SET DEFAULT nextval('link_id_seq');
ALTER SEQUENCE link_id_seq OWNED BY "Link"."id";

-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";
