-- CreateTable
CREATE TABLE `post` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `mediaUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `originalPostId` VARCHAR(191) NULL,

    INDEX `post_userId_idx`(`userId`),
    INDEX `post_originalPostId_idx`(`originalPostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_originalPostId_fkey` FOREIGN KEY (`originalPostId`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
