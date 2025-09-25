export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('memberships', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('A', 'B', 'C'),
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      provider: {
        type: Sequelize.ENUM('local', 'google', 'facebook'),
        defaultValue: 'local',
      },
      provider_id: {
        type: Sequelize.STRING,
      },
      membership_id: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        references: {
          model: 'memberships',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('contents', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('article', 'video'),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      body: {
        type: Sequelize.TEXT,
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });

    await queryInterface.createTable('content_memberships', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      content_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'contents', key: 'id' },
        onDelete: 'CASCADE',
      },
      membership_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'memberships', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("content_memberships");
    await queryInterface.dropTable('contents');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('memberships');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_provider";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_memberships_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_contents_type";');
    
  },
};
