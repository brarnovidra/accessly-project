import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Membership extends Model {
    static associate(models) {
      Membership.hasMany(models.User, {
        foreignKey: 'membership_id',
        as: 'users',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      Membership.belongsToMany(models.Content, {
        through: "content_memberships",
        as: "contents",
        foreignKey: "membership_id",
      });
    }
  }

  Membership.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('A', 'B', 'C'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Membership',
      tableName: 'memberships',
      timestamps: false,
    }
  );

  return Membership;
};
