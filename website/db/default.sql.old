CREATE TABLE IF NOT EXISTS `web_db`.`Users` (
  `idUsers` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `admin` TINYINT NOT NULL DEFAULT 0,
  `estate` INT,
  `token` VARCHAR(255),
  `lastlogin` VARCHAR(45) NULL,
  PRIMARY KEY (`idUsers`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `idUsers_UNIQUE` (`idUsers` ASC));

INSERT INTO web_db.Users (username, password, admin) 
  VALUES ("admin", "admin", 1) 
  ON DUPLICATE KEY UPDATE idUsers=idUsers;