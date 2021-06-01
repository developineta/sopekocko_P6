const User = require('../models/User'); // Importer modèle de 'User'
const bcrypt = require('bcrypt');       // Importer le système qui crypte le mot de passe
const jwt = require('jsonwebtoken');    // Importer le paquet de création de 'Token'
const maskData = require('maskdata');   // Importer le paquet pour le masquage d'email

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)  // La fonction pour 'hasher' le mot de passe
    .then(hash => {                     // Récuperation de 'hash' de mot de passe
        const user = new User({         // Création de nouveau utilisateur
            email: maskData.maskEmail2(req.body.email), // Masquage d'email
            password: hash              // Enregistrement de mot de passe 'haché'
        });
        user.save()                     // Sauvegarde de nouveau utilisateur dans la base de données
        .then(() => res.status(201).json({ message: 'Utilisateur est crée !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: maskData.maskEmail2(req.body.email) }) // Pour trouver l'utilisateur correspondant à l'adresse email masqué saisie
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // Pour comparer le mot de passe saisie avec le 'hash' savegardé dans la base de données
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({                      // Si l'utilisateur est trouvé             
                userId: user._id,                       // Envoi l'Id d'utilisateur correspondant             
                token: jwt.sign(                        // La fonction de signature de 'token'             
                    { userId: user._id },               // Pour créer l'objet de l'Id de l'utilisateur correspondant             
                    process.env.RANDOM_TOKEN_SECRET,    // Utilisation de clé de 'token' secret, crée avec 'crypto' dans le fichier .env 
                    { expiresIn: '24h' }                // Expiration du 'token' en 24h 
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};