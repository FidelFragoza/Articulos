const sqlite3 = require('sqlite3').verbose();

// Abre la conexión con la base de datos en el archivo articles.db
const db = new sqlite3.Database('articles.db');

// Crea la tabla 'articles' si no existe
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS articles (code INTEGER PRIMARY KEY, description TEXT NOT NULL, stock INTEGER NOT NULL, price REAL NOT NULL)");
});

module.exports = db;
