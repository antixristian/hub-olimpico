-- CreateTable
CREATE TABLE `atleta` (
    `id` INTEGER NOT NULL,
    `nome` VARCHAR(255) NULL,
    `sexo` CHAR(1) NULL,
    `fk_Pais_NOC` CHAR(3) NULL,

    INDEX `fk_Atleta_Pais`(`fk_Pais_NOC`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `edicao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ano` INTEGER NOT NULL,
    `temporada` VARCHAR(255) NOT NULL,
    `cidade` VARCHAR(255) NULL,

    UNIQUE INDEX `ano`(`ano`, `temporada`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `esporte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NULL,

    UNIQUE INDEX `nome`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pais` (
    `NOC` CHAR(3) NOT NULL,
    `nome` VARCHAR(255) NULL,

    PRIMARY KEY (`NOC`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `participa_atleta_edicao_prova` (
    `fk_Atleta_id` INTEGER NOT NULL,
    `fk_Edicao_id` INTEGER NOT NULL,
    `fk_Prova_id` INTEGER NOT NULL,
    `idade_atleta` INTEGER NULL,
    `peso_atleta` DECIMAL(5, 1) NULL,
    `altura_atleta` DECIMAL(5, 1) NULL,
    `medalha` VARCHAR(50) NULL,

    INDEX `fk_Participa_Edicao`(`fk_Edicao_id`),
    INDEX `fk_Participa_Prova`(`fk_Prova_id`),
    PRIMARY KEY (`fk_Atleta_id`, `fk_Edicao_id`, `fk_Prova_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prova` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `fk_Esporte_id` INTEGER NULL,

    UNIQUE INDEX `nome`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `atleta` ADD CONSTRAINT `fk_Atleta_Pais` FOREIGN KEY (`fk_Pais_NOC`) REFERENCES `pais`(`NOC`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `participa_atleta_edicao_prova` ADD CONSTRAINT `fk_Participa_Atleta` FOREIGN KEY (`fk_Atleta_id`) REFERENCES `atleta`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `participa_atleta_edicao_prova` ADD CONSTRAINT `fk_Participa_Edicao` FOREIGN KEY (`fk_Edicao_id`) REFERENCES `edicao`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `participa_atleta_edicao_prova` ADD CONSTRAINT `fk_Participa_Prova` FOREIGN KEY (`fk_Prova_id`) REFERENCES `prova`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
