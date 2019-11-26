CREATE TABLE `sim_db`.`Estates` (
  `idEstates` INT NOT NULL AUTO_INCREMENT,
  `size` INT NOT NULL DEFAULT 0,
  `people` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`idEstates`));

CREATE TABLE `sim_db`.`Consumption` (
  `idConsumption` INT NOT NULL AUTO_INCREMENT,
  `estate` INT NULL,
  `value` FLOAT NULL,
  `time` VARCHAR(45) NULL,
  PRIMARY KEY (`idConsumption`),
  INDEX `fk_Consumtion_1_idx` (`estate` ASC),
  CONSTRAINT `fk_Consumtion_1`
    FOREIGN KEY (`estate`)
    REFERENCES `sim_db`.`Estates` (`idEstates`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `sim_db`.`Production` (
  `idProduction` INT NOT NULL AUTO_INCREMENT,
  `value` FLOAT NOT NULL,
  `estate` INT NULL,
  `time` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idProduction`),
  INDEX `fk_Production_1_idx` (`estate` ASC),
  CONSTRAINT `fk_Production_1`
    FOREIGN KEY (`estate`)
    REFERENCES `sim_db`.`Estates` (`idEstates`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `sim_db`.`Wind` (
  `idWind` INT NOT NULL AUTO_INCREMENT,
  `value` FLOAT NOT NULL,
  `time` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idWind`));