const Sauce = require('../models/Sauce');           // Pour importer le modèle de sauce
const fs = require('fs');                           // Système de fichiers (paquet node js)

exports.createSauce = (req, res, next) => {         // La méthode POST
    const sauceObject = JSON.parse(req.body.sauce); // On transforme le 'body' de sauce en objet JS
    delete sauceObject._id;                         // On supprime l'id retourné, qu'on n'aura pas besoin
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Création de chaine qui prend en compte le protocol, le serveur, le dossier desd images et le nom du fichier
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce est enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {                         // La méthode PUT
    let sauceObject = {};
    req.file ? (                                                    // Si un nouveau fichier est trouvé
        Sauce.findOne({ _id: req.params.id })                       // Pour trouver une sauce par Id
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];   // On trouve le nom de fichier correspondant pour la suppression
            fs.unlinkSync(`images/${filename}`)                     // On supprime le fichier d'image
        }),
        sauceObject = {
        ...JSON.parse(req.body.sauce),                              // Récuperation de la chaine de caractères et transformation en objet JS
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // On récupère le nouveau fichier
        }
    ) : (sauceObject = { ...req.body })                             // Si le fichier n'est pas trouvé, on prend en compte le 'body' uniquement
        
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // Mettre à jour la sauce
            .then(() => res.status(200).json({ message: 'La sauce est modifié !'}))
            .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {                         // La méthode Delete
    Sauce.findOne({ _id: req.params.id })                           // Pour trouver une sauce par Id
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];   // On trouve le nom de fichier correspondant pour la suppression
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })             // On supprime la sauce correspondante
                    .then(() => res.status(200).json({ message: 'La sauce est supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {                         // La méthode GET - trouver une sauce par Id
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {                        // La méthode GET - trouver le liste de toutes les sauces
    Sauce.find()
        .then(allSauces => res.status(200).json(allSauces))
        .catch(error => res.status(400).json({ error }));
};

// Likes et dislikes
exports.likesDislikes = (req, res, next) => {           // La méthode POST
    Sauce.findOne({ _id: req.params.id })               // Récupère la sauce correspondante
    .then(sauce => {
        let userId = req.body.userId;                   // Déclare l'Id d'utilisateur correspondant
        let sauceId = req.params.id;                    // Déclare l'Id de la sauce correspondante
        
        switch (req.body.like) {                        // Selon la valeur de like
            
            case 1:                                     // Si ajoute like
                Sauce.updateOne({ _id: sauceId }, {     // Mettre à jour la sauce
                    $inc: { likes:1},                   // Ajoute 1 like
                    $push: { usersLiked: userId},       // Ajoute le userId dans le liste des utilisateurs qui like cette sauce
                })
                    .then(() => res.status(201).json({ message: 'Like est ajouté !'}))
                    .catch( error => res.status(400).json({ error }));
                break;
                
            case 0:                                                     // Si l'utilisateur enlève le like ou dislike
                if (sauce.usersLiked.find(user => user === userId)) {   // Si l'Id d'utilisateur est trouvé dans le tableau de likes
                    Sauce.updateOne({ _id : sauceId }, {                // Mettre à jour la sauce
                        $inc: {likes:-1},                               // Enlève 1 like
                        $pull: {usersLiked: userId},                    // Enlève l'Id d'utilisateur de tableau de like
                    })
                        .then(() => res.status(201).json({message: 'Like est enlevé !'}))
                        .catch( error => res.status(400).json({ error }))
                }
                if (sauce.usersDisliked.find(user => user === userId)) {   // Si l'Id d'utilisateur est trouvé dans le tableau de dislikes
                    Sauce.updateOne({ _id : sauceId }, {                   // Mettre à jour
                        $inc: {dislikes:-1},                               // Enlève 1 dislike
                        $pull: {usersDisliked: userId},                    // Enlève l'Id d'utilisateur de tableau de dislike
                    })
                        .then(() => res.status(201).json({message: 'Dislike est enlevé !'}))
                        .catch( error => res.status(400).json({ error }));
                }
                break;
            case -1:                                    // Si ajoute dislike
                Sauce.updateOne({ _id: sauceId }, {     // Mettre à jour la sauce
                    $inc: {dislikes:1},                 // Ajoute 1 dislike
                    $push: {usersDisliked: userId},     // Ajoute le l'Id d'utilisateur dans le liste des utilisateurs qui dislike cette sauce
                })
                    .then(() => res.status(201).json({ message: 'Dislike est ajouté !'}))
                    .catch( error => res.status(400).json({ error }))
                break;

            default:
                return res.status(500).json({ error });
        }
    })
    .catch(error => res.status(500).json({ error }))
};