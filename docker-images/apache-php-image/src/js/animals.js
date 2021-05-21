$(function() {
  console.log("loading animals");
  
  function loadAnimals() {
    $.getJSON("/api/animals/", function (animals) {
      console.log(animals);
      if (animals.length > 0) {
        message = "Greetings from " +  animals[0].firstName + " the cute  " + animals[0].species;
      }
      $("#animals").text(message); 
    });
  };

  loadAnimals();
  setInterval(loadAnimals, 4000);
});
