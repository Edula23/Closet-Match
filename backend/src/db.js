import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(':memory:');

// Execute SQL statements from strings

export default db;