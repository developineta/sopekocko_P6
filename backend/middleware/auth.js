const jwt = require('jsonwebtoken'); // Importer le paquet de création de 'Token'

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];          // Pour récuperer le token du 'header' de la requête
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // La fonction qui vérifie le 'Token'
        const userId = decodedToken.userId;                            // Récuperation de l'Id d'utilisateur de 'Token'
        if (req.body.userId && req.body.userId !== userId) {           // Vérification de la correspondance de l'Id d'utilisateur
            throw 'Invalid user ID';
        } else {
        next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};

/*const passwordSchema = require('../models/Password');

// Validation de mot de passe
module.exports = (req, res, next) => {
    let userPassword = req.body.password;
    let validPassword = passwordSchema;
    if (validPassword !== userPassword) {
        throw 'Invalid password';
    } else {
        next();
    }
};*/