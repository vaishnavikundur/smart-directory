const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pramodh5555_db_user:pramod123123@phonebook.sndjzhl.mongodb.net/mobile?appName=phonebook').then(async () => {
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();
  console.log('Users in remote DB:', users.map(u => u.email));
  process.exit(0);
}).catch(console.error);
