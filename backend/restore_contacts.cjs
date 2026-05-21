const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://pramodh5555_db_user:pramod123123@phonebook.sndjzhl.mongodb.net/mobile?appName=phonebook').then(async () => {
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email: 'pramodh5555@gmail.com' });
  if (!user) {
    console.error('User not found!');
    process.exit(1);
  }
  
  const contacts = [
    {
      userId: user._id,
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "+1 555-0100",
      company: "Tech Corp",
      title: "Software Engineer",
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    },
    {
      userId: user._id,
      name: "Bob Jones",
      email: "bob@example.com",
      phone: "+1 555-0101",
      company: "Design LLC",
      title: "UX Designer",
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    },
    {
      userId: user._id,
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "+1 555-0102",
      company: "Sales Inc",
      title: "Account Manager",
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0
    }
  ];

  await db.collection('contacts').deleteMany({ userId: user._id });
  await db.collection('contacts').insertMany(contacts);
  
  console.log('Contacts restored successfully!');
  process.exit(0);
}).catch(console.error);
