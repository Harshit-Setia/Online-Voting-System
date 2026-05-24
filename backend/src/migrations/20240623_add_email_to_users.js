/* eslint-disable no-console */
'use strict';

/**
 * Migration to add an email column to the users table.
 * Steps:
 *   1. Add the column as nullable (so existing rows won't break).
 *   2. Back‑fill any NULL emails with a placeholder (user{id}@example.com).
 *   3. Alter the column to NOT NULL.
 *   4. Add a UNIQUE constraint.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1️⃣ Add column (nullable for now)
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // 2️⃣ Backfill missing emails with a deterministic placeholder
    await queryInterface.sequelize.query(`
      UPDATE "users"
      SET "email" = CONCAT('user', "id", '@example.com')
      WHERE "email" IS NULL;
    `);

    // 3️⃣ Make the column NOT NULL
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // 4️⃣ Add a UNIQUE constraint
    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'users_email_unique_constraint',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the UNIQUE constraint then drop the column
    await queryInterface.removeConstraint('users', 'users_email_unique_constraint');
    await queryInterface.removeColumn('users', 'email');
  },
};
