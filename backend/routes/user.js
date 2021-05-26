const express = require('express');                 // Importer le paquet Express
const router = express.Router();                    // La création du router

const userCtrl = require('../controllers/user');    // Création de 'Controller d'utilisateur' utilisant le fichier indiqué

// Les routes de user disponibles dans l'application
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;                            // Exportation du router