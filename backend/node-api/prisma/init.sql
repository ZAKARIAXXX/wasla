-- Create tables
CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Contact (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    avatar TEXT,
    lastMessage TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    unread INTEGER DEFAULT 0,
    status TEXT NOT NULL,
    totalSpent REAL DEFAULT 0,
    notes TEXT,
    orderStatus TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Message (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    sent INTEGER DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    contactId TEXT NOT NULL,
    FOREIGN KEY (contactId) REFERENCES Contact(id)
);

-- Seed data
INSERT OR IGNORE INTO User (email, password, name) VALUES ('test@example.com', 'password', 'Test User');

INSERT OR IGNORE INTO Contact (id, name, phone, avatar, lastMessage, status, totalSpent, notes, orderStatus)
VALUES
    ('1', 'Youssef Amrani', '+212 6 12 34 56 78', 'YA', 'Can I get 2 chicken shawarma?', 'new-order', 450, 'Regular customer. Prefers extra sauce.', 'New'),
    ('2', 'Fatima Zahra', '+212 6 98 76 54 32', 'FZ', 'When will my order arrive?', 'preparing', 1230, 'VIP customer. Always tips well.', 'Preparing'),
    ('3', 'Omar Benjelloun', '+212 6 55 44 33 22', 'OB', 'Thanks! Everything was great 👍', 'delivered', 780, '', 'Delivered'),
    ('4', 'Salma Idrissi', '+212 6 11 22 33 44', 'SI', 'Do you have any vegetarian options?', 'pending', 320, 'Vegetarian. Allergic to nuts.', 'Pending'),
    ('5', 'Karim El Fassi', '+212 6 77 88 99 00', 'KF', 'Payment sent via CashPlus', 'paid', 2150, 'Bulk orders for office. Invoice needed.', 'Paid'),
    ('6', 'Amina Tazi', '+212 6 44 55 66 77', 'AT', 'Can I order for tomorrow?', 'new-order', 560, 'Schedule orders in advance.', 'New');
