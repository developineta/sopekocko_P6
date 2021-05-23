/*const mongoose = require('mongoose');
const passwordValidator = require('password-validator'); // Validateur de mot de passe installé pour définir les règles de mot de passe

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(6)                                    // 6 carachtères minimum
.is().max(16)                                   // 16 carachtères maximum
.has().uppercase()                              // Au moins une majuscule
.has().lowercase()                              // Au moins une minuscule
.has().digits()                                 // Au moins 1 chiffre
.has().not().spaces();                          // Il n'a pas des espaces

module.exports = passwordSchema;*/