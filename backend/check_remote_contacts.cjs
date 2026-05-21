const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pramodh5555_db_user:pramod123123@phonebook.sndjzhl.mongodb.net/mobile?appName=phonebook').then(async () => {
  const db = mongoose.connection.db;
  const contacts = await db.collection('contacts').find({}).toArray();
  console.log('Total contacts in remote DB:', contacts.length);
  process.exit(0);
}).catch(console.error);
