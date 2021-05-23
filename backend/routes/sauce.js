const express = require('express'); // Importer le paquet Express
const router = express.Router();    // La création du router

const saucesCtrl = require('../controllers/sauce');     // Création de 'Controller sauce' utilisant le fichier indiqué
const auth = require('../middleware/auth');             // Définition de middleware d'authentification, utilisant le fichier indiqué
const multer = require('../middleware/multer-config');  // Définition de 'multer', utilisant le fichier indiqué

// Les routes de sauces disponibles dans l'application
router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.likesDislikes);

module.exports = router; // Exportation du router