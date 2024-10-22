-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Comment`(`commentId`) ON DELETE SET NULL ON UPDATE CASCADE;
