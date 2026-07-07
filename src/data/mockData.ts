export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: "lead" | "engaged" | "qualified" | "won" | "lost";
  totalSpent: number;
  notes: string;
  orderStatus: string;
}

export interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
}

export const contacts: Contact[] = [
  {
    id: "1",
    name: "Youssef Amrani",
    phone: "+212 6 12 34 56 78",
    avatar: "YA",
    lastMessage: "Can I get 2 chicken shawarma?",
    timestamp: "2m ago",
    unread: 3,
    status: "lead",
    totalSpent: 450,
    notes: "Regular customer. Prefers extra sauce.",
    orderStatus: "New",
  },
  {
    id: "2",
    name: "Fatima Zahra",
    phone: "+212 6 98 76 54 32",
    avatar: "FZ",
    lastMessage: "When will my order arrive?",
    timestamp: "15m ago",
    unread: 1,
    status: "engaged",
    totalSpent: 1230,
    notes: "VIP customer. Always tips well.",
    orderStatus: "Preparing",
  },
  {
    id: "3",
    name: "Omar Benjelloun",
    phone: "+212 6 55 44 33 22",
    avatar: "OB",
    lastMessage: "Thanks! Everything was great 👍",
    timestamp: "1h ago",
    unread: 0,
    status: "won",
    totalSpent: 780,
    notes: "",
    orderStatus: "Delivered",
  },
  {
    id: "4",
    name: "Salma Idrissi",
    phone: "+212 6 11 22 33 44",
    avatar: "SI",
    lastMessage: "Do you have any vegetarian options?",
    timestamp: "2h ago",
    unread: 0,
    status: "engaged",
    totalSpent: 320,
    notes: "Vegetarian. Allergic to nuts.",
    orderStatus: "Pending",
  },
  {
    id: "5",
    name: "Karim El Fassi",
    phone: "+212 6 77 88 99 00",
    avatar: "KF",
    lastMessage: "Payment sent via CashPlus",
    timestamp: "3h ago",
    unread: 0,
    status: "won",
    totalSpent: 2150,
    notes: "Bulk orders for office. Invoice needed.",
    orderStatus: "Paid",
  },
  {
    id: "6",
    name: "Amina Tazi",
    phone: "+212 6 44 55 66 77",
    avatar: "AT",
    lastMessage: "Can I order for tomorrow?",
    timestamp: "5h ago",
    unread: 2,
    status: "lead",
    totalSpent: 560,
    notes: "Schedule orders in advance.",
    orderStatus: "New",
  },
];

export const messages: Message[] = [
  { id: "1", text: "Hi! I'd like to place an order", sent: false, timestamp: "10:30 AM" },
  { id: "2", text: "Of course! Here's our menu 📋", sent: true, timestamp: "10:31 AM" },
  { id: "3", text: "Can I get 2 chicken shawarma?", sent: false, timestamp: "10:33 AM" },
  { id: "4", text: "Sure! That will be 80 MAD. Delivery in 30 min. Want to confirm?", sent: true, timestamp: "10:34 AM" },
  { id: "5", text: "Yes please! Same address as last time", sent: false, timestamp: "10:35 AM" },
  { id: "6", text: "Order confirmed ✅ You'll receive a notification when it's out for delivery.", sent: true, timestamp: "10:36 AM" },
];

export const quickReplies = [
  "Send Menu",
  "Send Location",
  "Order Confirmed ✅",
  "Out for Delivery 🚗",
  "Payment Received 💰",
];
