import db from "./connection.js";

export function createUser(user) {
  const statement = db.prepare(`
    INSERT INTO users (id, username, password_hash)
    VALUES (?, ?, ?)
  `);

  statement.run(user.id, user.username, user.passwordHash);
}

export function findUserByUsername(username) {
  return db.prepare(`
    SELECT id, username, password_hash
    FROM users
    WHERE username = ?
  `).get(username);
}