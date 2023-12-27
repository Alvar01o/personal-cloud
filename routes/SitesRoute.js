const express = require('express');
const router = express.Router();
const siteController = require('./controllers/SiteController');

// Define las rutas y los controladores correspondientes
router.get('/ruta', siteController.obtenerSites);
router.post('/ruta', siteController.crearSite);
router.put('/ruta/:id', siteController.actualizarSite);
router.delete('/ruta/:id', siteController.eliminarSite);

module.exports = router;