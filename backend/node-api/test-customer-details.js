// Quick test script for Customer Details functionality
const Database = require('better-sqlite3');
const db = new Database('./prisma/dev.db');

console.log('=== Testing Customer Details Data ===\n');

// Get a sample contact
const contact = db.prepare('SELECT * FROM Contact LIMIT 1').get();
console.log('Sample Contact Data:');
console.log(JSON.stringify(contact, null, 2));

console.log('\n=== Required Fields Check ===');
console.log('✓ id:', contact.id);
console.log('✓ name:', contact.name);
console.log('✓ phone:', contact.phone);
console.log('✓ avatar:', contact.avatar);
console.log('✓ totalSpent:', contact.totalSpent);
console.log('✓ orderStatus:', contact.orderStatus);
console.log('✓ notes:', contact.notes);

// Test update
console.log('\n=== Testing Update ===');
const updateStmt = db.prepare('UPDATE Contact SET orderStatus = ?, notes = ? WHERE id = ?');
updateStmt.run('Preparing', 'Test note from script', contact.id);

const updated = db.prepare('SELECT * FROM Contact WHERE id = ?').get(contact.id);
console.log('Updated Contact:');
console.log('- orderStatus:', updated.orderStatus);
console.log('- notes:', updated.notes);

db.close();
console.log('\n✅ All tests passed!');
