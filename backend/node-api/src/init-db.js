const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../prisma/dev.db');

// Create database
const db = new Database(dbPath);

// Read and execute SQL
const sqlPath = path.join(__dirname, '../prisma/init.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

// Execute all statements
const statements = sql.split(';').filter(s => s.trim());
statements.forEach(statement => {
    if (statement.trim()) {
        db.exec(statement);
    }
});

console.log('✅ Database created and seeded successfully at:', dbPath);
db.close();
