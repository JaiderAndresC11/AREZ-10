const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const RUTA_ARCHIVO = path.join(__dirname, '..', 'data', 'contenido.json');

router.get('/', (req, res) => {
  const contenido = JSON.parse(fs.readFileSync(RUTA_ARCHIVO, 'utf-8'));
  res.json(contenido);
});

module.exports = router;