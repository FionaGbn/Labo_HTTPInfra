var Chance = require('chance');
var chance = new Chance();

const express = require('express')
const app = express()

//quand app reçoit une requête get et que la ressource visée est / -> exécution de la fonction de callback
app.get('/', function(req, res) {
    res.send(generateAnimals());
});

// app écoute sur le port 3000
app.listen(3000, function() {
    console.log('Acception HTTP requests on port 3000');
});

// génère une liste d'animaux
function generateAnimals() {
    var nAnimals = chance.integer({
        min: 1,
        max: 4
    });
    var animals = [];
    for (var i = 0; i < nAnimals; i++) {
        animals.push({
            species: chance.animal(),
            firstName: chance.first(),
            lastName: chance.last(),
            favoriteWord: chance.word()
        });
     };
     console.log(animals);
     return animals;
}
    
    
