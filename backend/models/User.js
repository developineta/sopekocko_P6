const mongoose = require('mongoose');                           // Importer le paquet de Mongoose
const uniqueValidator = require('mongoose-unique-validator');   // Importer le paquet 'mongoose-unique-validator' pour garantir que les e-mails d'utilisateurs sont uniques

const userSchema = mongoose.Schema({                            // Schema qui définie la structure de données d'utilisateur
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);                             // Appliquation de 'unique-validator' à la Schema

module.exports = mongoose.model('User', userSchema);            // Exportation du Schema
