const { sequelize } = require('./config/db');
const User = require('./models/User');
const Session = require('./models/Session');
const Matching = require('./models/Matching');
const Progress = require('./models/Progress');
const { users, sessions, matchings, progress } = require('./data');

const syncDatabase = async () => {
  try {
    // sync({ force: true }) will drop tables if they exist and recreate them. 
    // sync({ alter: true }) will update tables to match the models.
    await sequelize.sync({ force: false }); 
    console.log('Database tables synchronized.');

    // Incremental seeding: check for missing users from data.js
    console.log('Checking for new users to seed...');
    for (const user of users) {
      const existingUser = await User.findOne({ where: { email: user.email } });
      if (!existingUser) {
        console.log(`Adding new user/mentor: ${user.name}`);
        await User.create(user);
      }
    }
    console.log('Seeding check complete.');

  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = syncDatabase;
