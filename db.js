const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize - SQLite database
const sequelize = new Sequelize('sqlite::memory:');

// Define User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

async function setupDatabase() {
  // Sync all models
  await sequelize.sync({ force: true });
  console.log('Database & tables created!');

  // Create admin user
  await User.create({
    username: 'mixaura@gmail.com',
    password: 'mix.aura.712',
  });
  console.log('Admin user created!');
}

setupDatabase();
