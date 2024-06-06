const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para registrar un artículo
app.post('/articles', (req, res) => {
  const { code, description, stock, price } = req.body;
  db.run('INSERT INTO articles (code, description, stock, price) VALUES (?, ?, ?, ?)', [code, description, stock, price], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Ruta para obtener todos los artículos
app.get('/articles', (req, res) => {
  db.all('SELECT * FROM articles', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(rows);
  });
});

// Ruta para eliminar un artículo si el stock es 0
app.delete('/articles/:code', (req, res) => {
  const { code } = req.params;
  db.run('DELETE FROM articles WHERE code = ? AND stock = 0', [code], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// Ruta para actualizar los datos de un artículo excepto el código
app.put('/articles/:code', (req, res) => {
  const { code } = req.params;
  const { description, stock, price } = req.body;
  db.run('UPDATE articles SET description = ?, stock = ?, price = ? WHERE code = ?', [description, stock, price, code], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ updated: this.changes });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
