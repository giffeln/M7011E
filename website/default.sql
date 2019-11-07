CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "admin" BOOL NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY ("id")
);
