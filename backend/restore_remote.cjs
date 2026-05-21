const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb+srv://pramodh5555_db_user:pramod123123@phonebook.sndjzhl.mongodb.net/mobile?appName=phonebook').then(async () => {
  const db = mongoose.connection.db;
  const hash = await bcrypt.hash('123123', 12);
  await db.collection('users').updateOne(
    { email: 'pramodh5555@gmail.com' },
    { $set: { email: 'pramodh5555@gmail.com', passwordHash: hash, name: 'Pramodh', preferences: { theme: 'light' } } },
    { upsert: true }
  );
  console.log('Remote account restored!');
  process.exit(0);
}).catch(console.error);
