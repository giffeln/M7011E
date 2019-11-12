CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "admin" BOOL NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY ("id")
);
BEGIN
   IF NOT EXISTS (SELECT * FROM Users 
                   WHERE username = "admin")
   BEGIN
       INSERT INTO Users ("username", "password", "admin")
       VALUES ("admin", "admin", true)
   END
END