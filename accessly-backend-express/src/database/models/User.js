// models/User.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Membership, {
        foreignKey: 'membership_id',
        as: 'memberships',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      User.hasMany(models.RefreshToken, {
        foreignKey: 'user_id',
        as: 'refresh_tokens',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }));
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider: {
        type: DataTypes.ENUM('local', 'google', 'facebook'),
        defaultValue: 'local',
      },
      provider_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      membership_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        references: {
          model: 'memberships', // table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      validate: {
        localProviderRequiresFields() {
          if (this.provider === 'local') {
            if (!this.password) {
              throw new Error('Password is required for local provider');
            }
          } else {
            if (!this.name) {
              throw new Error('Name is required for local provider');
            }
            if (!this.provider_id) {
              throw new Error('provider_id is required for local provider');
            }
          }
        },
      },
    }
  );

  return User;
};
