import { Migration } from '@mikro-orm/migrations';

export class MigrationYYYYMMDDHHMMSS extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE \`tbl_user\` (
        \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
        \`email\` VARCHAR(255) UNIQUE,
        \`name\` VARCHAR(255),
        \`username\` VARCHAR(255) UNIQUE,
        \`provider\` VARCHAR(50) NOT NULL,
        \`providerId\` VARCHAR(255) NOT NULL UNIQUE,
        \`avatarUrl\` TEXT,
        \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS `tbl_user`;');
  }
}
