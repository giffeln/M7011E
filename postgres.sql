CREATE TABLE IF NOT EXISTS "Users" (
    "id" INTEGER NOT NULL UNIQUE,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "admin" BOOL NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY ("id")
);