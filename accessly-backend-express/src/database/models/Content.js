import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Content extends Model {
    static associate(models) {
      Content.belongsToMany(models.Membership, {
        through: "content_memberships",
        as: "memberships",
        foreignKey: "content_id",
      });
    }
  }

  Content.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('article', 'video'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Content',
      tableName: 'contents',
      timestamps: true,
    }
  );

  return Content;
};
