## Piquante

La réalisation du backend d'application des avis gastronomiques - So Pekocko.
Pour la réalisation du projet le frontend a été cloné depuis : https://github.com/OpenClassrooms-Student-Center/dwj-projet6

## Frontend
Les actions faites pour le lancement du frontend:
- installation npm
- installation angular/cli@7.0.2
- installation node-sass@4.14.1
- lancement du serveur sur `http://localhost:4200/` avec la commande `ng serve`


## Backend
Le backend du projet a été généré avec Node serveur, framework Express, et la base de données Mongoose.
Le demarrage du serveur `http://localhost:3000/` avec la commande `nodemon server`


## Securité
Pour respecter les standards d'OWASP, les mésures de sécurité ont été introduites :
- Le mot de passe d'utilisateur est chiffré avec package 'bcrypt'
- L'email d'utilisateur est masqué avec 'maskdata'
- Les adresses email des utilisateurs sont uniques grâce à package 'mongoose-unique-validator'
- Deux types d'administrateurs sont définies dans la base de données MongoDB
- Pour la connexion d'utilisateur le 'token' secret est utilisé qui expire dans 24h. 'jsonwebtoken et 'dotenv' sont installés