import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';
import Contact from './models/Contact.js';
import RecentSearch from './models/RecentSearch.js';
import { connectDB } from './config/database.js';

dotenv.config();

const TAGS_POOL = ['Work', 'Family', 'Friends', 'Clients', 'Tech', 'Marketing', 'Design', 'Important', 'VIP', 'Sales'];
const COMPANIES = ['Google', 'Meta', 'Apple', 'Netflix', 'Amazon', 'Microsoft', 'Stripe', 'Vercel', 'Linear', 'OpenAI', 'Anthropic'];

const FIRST_NAMES = [
  'Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore',
  'Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Mia', 'Isabella', 'Ava', 'Evelyn', 'Luna'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function getRandomTags(): string[] {
  const count = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
  const tags = new Set<string>();
  while (tags.size < count) {
    tags.add(getRandomItem(TAGS_POOL));
  }
  return Array.from(tags);
}

async function seed() {
  try {
    console.log('🌱 Starting seed database script...');
    await connectDB();

    // 1. Clear database
    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Contact.deleteMany({});
    await RecentSearch.deleteMany({});
    console.log('✅ Collections cleared.');

    // 2. Create users
    console.log('👥 Creating seed users...');
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user1 = await User.create({
      name: 'John Doe',
      email: 'test@example.com',
      passwordHash: hashedPassword,
      preferences: { theme: 'dark' }
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'demo@example.com',
      passwordHash: hashedPassword,
      preferences: { theme: 'dark' }
    });

    console.log(`✅ Seed users created:\n - test@example.com (John Doe)\n - demo@example.com (Jane Smith)`);

    // 3. Create contacts for user1 and user2
    const users = [user1, user2];
    let totalContacts = 0;

    for (const user of users) {
      console.log(`📇 Generating contacts for user ${user.email}...`);
      const contactsToInsert = [];

      // Generate 55 realistic contacts per user
      for (let i = 0; i < 55; i++) {
        const firstName = getRandomItem(FIRST_NAMES);
        const lastName = getRandomItem(LAST_NAMES);
        const name = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
        
        // Random 10-digit phone number
        const phone = `+1 (${Math.floor(Math.random() * 900) + 100}) 555-${Math.floor(Math.random() * 9000) + 1000}`;
        const company = Math.random() > 0.3 ? getRandomItem(COMPANIES) : undefined;
        const address = Math.random() > 0.4 ? `${Math.floor(Math.random() * 900) + 100} ${getRandomItem(LAST_NAMES)} St, ${getRandomItem(FIRST_NAMES)}ville, CA` : undefined;
        const tags = getRandomTags();
        const isFavorite = Math.random() > 0.8; // 20% favorites

        contactsToInsert.push({
          userId: user._id,
          name,
          phone,
          email,
          company,
          address,
          tags,
          isFavorite,
        });
      }

      const inserted = await Contact.insertMany(contactsToInsert);
      totalContacts += inserted.length;
      console.log(`✅ Inserted ${inserted.length} contacts for ${user.email}`);
    }

    console.log(`✨ Seeding completed successfully. Generated ${totalContacts} total contacts.`);
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
