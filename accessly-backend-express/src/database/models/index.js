import { Sequelize } from 'sequelize';
import dbConfig from '../../config/db.js';

import UserModel from './User.js';
import MembershipModel from './Membership.js';
import ContentModel from './Content.js';
import RefreshTokenModel from './RefreshToken.js';

// Ambil config sesuai environment
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Buat instance Sequelize langsung dari config
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Definisikan model dengan sequelize instance
const models = {
  User: UserModel(sequelize),
  Membership: MembershipModel(sequelize),
  Content: ContentModel(sequelize),
  RefreshToken: RefreshTokenModel(sequelize),
};

// Setup associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// Export
export const { User, Membership, Content, RefreshToken } = models;
export { sequelize };
export default models;
