require('dotenv').config();                 // Importation de module Dotenv qui charge fichier '.env' contenant le secret 'token'
const express = require('express');         // Importer le paquet Express
const bodyParser = require('body-parser');  // Importer le paquet Body-parser (transforme le corps de la requête en objet JS; pour gérer la demande POST
const mongoose = require('mongoose');       // Importer le paquet Mongoose (la base de données)
const path = require('path');               // Pour avoir l'accèss au système de fichiers

const saucesRoutes = require('./routes/sauce'); // L'importation du router de sauce
const userRoutes = require('./routes/user');    // L'importation du router de user

// Connexion à cluster de la base de données Mongoose
mongoose.connect('mongodb+srv://tableAdmin:zGsdoDkBXx0vxfRN@cluster0.bdaw5.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();                      // Création de l'application Express

// Pour accéder à l'API depuis n'importe quelle origine, les headers mentionnés aux requêtes envoyées vers l'API et pour envoyer des requêtes avec les méthodes mentionnées
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());                 // Accès au corps de la requête

app.use('/images', express.static(path.join(__dirname, 'images'))); // Gestionnaire de routage pour servir le dossier 'images' lors d'une requête concernée

app.use('/api/sauces', saucesRoutes);       // La route API pour laquelle on utilise routeur indiqué
app.use('/api/auth', userRoutes);

module.exports = app;                       // L'exportation de l'application