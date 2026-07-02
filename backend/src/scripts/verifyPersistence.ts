import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User, Ticket, Comment } from '../models';

dotenv.config();

async function verifyPersistence(): Promise<void> {
  console.log('Checking persisted data in MongoDB...\n');

  await connectDatabase();

  const [userCount, ticketCount, commentCount] = await Promise.all([
    User.countDocuments(),
    Ticket.countDocuments(),
    Comment.countDocuments(),
  ]);

  console.log(`  Users:    ${userCount}`);
  console.log(`  Tickets:  ${ticketCount}`);
  console.log(`  Comments: ${commentCount}`);

  if (userCount === 0 && ticketCount === 0 && commentCount === 0) {
    console.log('\nNo data found. Run `npm run seed` first.');
  } else {
    console.log('\nData persisted in MongoDB.');
  }

  const sampleTicket = await Ticket.findOne().populate('createdBy', 'name email');
  if (sampleTicket) {
    console.log(`\nSample ticket: "${sampleTicket.title}" (${sampleTicket.status})`);
  }

  await disconnectDatabase();
  console.log('\nPersistence check complete.');
}

verifyPersistence().catch((error) => {
  console.error('Persistence check failed:', error.message);
  process.exit(1);
});
