const express = require('express');
const router = express.Router();
const siteController = require('../controllers/SiteController');

// Define las rutas y los controladores correspondientes
router.get('/sites', siteController.obtenerSites);
router.post('/sites', siteController.crearSite);
router.put('/sites/:id', siteController.actualizarSite);
router.delete('/sites/:id', siteController.eliminarSite);

module.exports = router;