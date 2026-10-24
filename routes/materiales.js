const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const RUTA_ARCHIVO = path.join(__dirname, '..', 'historia', 'materiales.json');

// GET /api/materiales
router.get('/', (req, res) => {
  const datos = JSON.parse(fs.readFileSync(RUTA_ARCHIVO, 'utf-8'));
  res.json(datos);
});

module.exports = router;