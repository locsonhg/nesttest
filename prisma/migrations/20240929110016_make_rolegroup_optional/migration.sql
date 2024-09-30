-- AlterTable
ALTER TABLE `user` ADD COLUMN `roleGroupId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Role` (
    `roleId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleGroup` (
    `roleGroupId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RoleGroup_name_key`(`name`),
    PRIMARY KEY (`roleGroupId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleGroup_Roles` (
    `roleGroup_RoleId` INTEGER NOT NULL AUTO_INCREMENT,
    `roleGroupId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RoleGroup_Roles_roleGroupId_roleId_key`(`roleGroupId`, `roleId`),
    PRIMARY KEY (`roleGroup_RoleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleGroupId_fkey` FOREIGN KEY (`roleGroupId`) REFERENCES `RoleGroup`(`roleGroupId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleGroup_Roles` ADD CONSTRAINT `RoleGroup_Roles_roleGroupId_fkey` FOREIGN KEY (`roleGroupId`) REFERENCES `RoleGroup`(`roleGroupId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleGroup_Roles` ADD CONSTRAINT `RoleGroup_Roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;
