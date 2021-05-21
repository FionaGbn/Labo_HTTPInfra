var Chance = require('chance');
var chance = new Chance();

const express = require('express')
const app = express()

//quand app reçoit get requête et ressource visée est / alors on exécute fonction de callback
app.get('/', function(req, res) {
    res.send(generateAnimals());
});

app.listen(3000, function() {
    console.log('Acception HTTP requests on port 3000');
});

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
    
    
