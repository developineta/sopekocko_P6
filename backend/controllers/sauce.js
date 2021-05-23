const Sauce = require('../models/Sauce'); // Pour importer le modèle de sauce
const fs = require('fs'); // Système de fichiers (paquet node js)

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); // On transforme le 'body' de sauce en objet JS
    delete sauceObject._id; // On supprime l'id retourné, qu'on n'aura pas besoin
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Création de chaine qui prend en compte le protocol, le serveur, le dossier desd images et le nom du fichier
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce est enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?  // Si un nouveau fichier est trouvé
      {
        ...JSON.parse(req.body.oneSauce), // Récuperation de la chaine de caractères et transformation en objet JS
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };                 // Si le fichier n'est pas trouvé, on prend en compte le 'body' uniquement
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // Mettre à jour la sauce
        .then(() => res.status(200).json({ message: 'La sauce est modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // Pour trouver une sauce par Id
        .then(oneSauce => {
            const filename = oneSauce.imageUrl.split('/images/')[1]; // On trouve le nom de fichier correspondant pour la suppression
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id }) // On supprime la sauce correspondante
                    .then(() => res.status(200).json({ message: 'La sauce est supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })  // Pour trouver une sauce par Id
        .then(oneSauce => res.status(200).json(oneSauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()                        // On trouve le liste de toutes les sauces
        .then(allSauces => res.status(200).json(allSauces))
        .catch(error => res.status(400).json({ error }));
};

// Likes et dislikes
exports.likesDislikes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // récupère la sauce correspondante
    .then(sauce => {
        let userId = req.body.userId; // Déclare l'Id d'utilisateur correspondant
        let sauceId = req.params.id; // Déclare l'Id de la sauce correspondante
        
        switch (req.body.like) { // selon la valeur de like
            
            case 1: // si ajoute like
                Sauce.updateOne({ _id: sauceId }, {  // mettre à jour la sauce
                    $inc: { likes:1},                // ajoute 1 like
                    $push: { usersLiked: userId},   // ajoute le userId dans le liste des utilisateurs qui like cette sauce
                })
                    .then(() => res.status(201).json({ message: 'Like est ajouté !'}))
                    .catch( error => res.status(400).json({ error }));
                break;
                
            case 0: // si l'utilisateur enlève le like ou dislike
                if (sauce.usersLiked.find(user => user === userId)) {   // si l'Id d'utilisateur est trouvé dans le tableau de likes
                    Sauce.updateOne({ _id : sauceId }, {                // mettre à jour la sauce
                        $inc: {likes:-1},                               // enlève 1 like
                        $pull: {usersLiked: userId},                    // enlève l'Id d'utilisateur de tableau de like
                    })
                        .then(() => res.status(201).json({message: 'Like est enlevé !'}))
                        .catch( error => res.status(400).json({ error }))
                }
                if (sauce.usersDisliked.find(user => user === userId)) {   // si l'Id d'utilisateur est trouvé dans le tableau de dislikes
                    Sauce.updateOne({ _id : sauceId }, {                   // mettre à jour
                        $inc: {dislikes:-1},                               // enlève 1 dislike
                        $pull: {usersDisliked: userId},                    // enlève l'Id d'utilisateur de tableau de dislike
                    })
                        .then(() => res.status(201).json({message: 'Dislike est enlevé !'}))
                        .catch( error => res.status(400).json({ error }));
                }
                break;
            case -1: // si ajoute dislike
                Sauce.updateOne({ _id: sauceId }, {     // mettre à jour la sauce
                    $inc: {dislikes:1},                 // ajoute 1 dislike
                    $push: {usersDisliked: userId},     // ajoute le l'Id d'utilisateur dans le liste des utilisateurs qui dislike cette sauce
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

/*exports.likesDislikes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const getLike = req.body.like;
        const getUser = req.body.userId;
        let usersLiked = sauce.usersLiked;
        let usersDisliked = sauce.usersDisliked;
        let likes = sauce.likes;
        let dislikes = sauce.likes; 

        if(getLike === 1){
            usersLiked.push(getUser); // Si like, ajoute Id d'utilisateur à la liste de likes
        }
        if(getLike === 0 && usersLiked.includes(getUser)){
            usersLiked.pull(getUser); // Si unlike et Id utilisateur est dans le liste, enlève like
        }
        if(getLike === 0 && usersDisliked.includes(getUser)){
            usersDisliked.pull(getUser); // Si unlève dislike et Id utilisateur est dans le liste, enlève dislike
        }
        if(getLike === -1){
            usersDisliked.push(getUser); // Si dislike, ajoute Id d'utilisateur à la liste de dislikes
        }

        likes = usersLiked.length;
        dislikes = usersDisliked.length;
        Sauce.updateOne({ _id: req.params.id }); // Met à jour la sauce
    })
    .then(() => res.status(200).json({ message : 'Sauce a eu like ou dislike'}))
    .catch(error => res.status(400).json({error}));
}; */
