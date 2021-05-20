const express = require('express');
const bodyParser = require('body-parser'); // Pour gérer la demande POST
const mongoose = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connexion à cluster de la base de données Mongoose
mongoose.connect('mongodb+srv://developineta:111sparnis@cluster0.bdaw5.mongodb.net/Cluster0?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !', e));

const app = express();

// Pour accéder à l'API depuis n'importe quelle origine, les headers mentionnés aux requêtes envoyées vers l'API et envoyer des requêtes avec les méthodes mentionnées
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json()); // Accès au corps de la requête

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;