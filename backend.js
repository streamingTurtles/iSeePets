
// ****************************************************************************** //
// from petfinder.com/user/developer-settings  -  API key & Secrete
var key="i4WSkGk27C4yI7wCconCIHNXNrZh2dLsepStJSgNB7p9137P05";
var secret="Dav2xXd8H9Y7PTvQvBymZPdYAP3KYXYTLWMu5Eca";


// from https://www.petfinder.com/developers/v2/docs/ 
// from documentation : use deconstructed curl to browser fetch to get a new token for each API request 
// curl -d "grant_type=client_credentials&client_id={CLIENT-ID}&client_secret={CLIENT-SECRET}" https://api.petfinder.com/v2/oauth2/token  


var token=""

function getNewToken() {
    console.log("getting a NEW TOKEN, they expire every 3600 seconds: ", token);
    fetch('https://api.petfinder.com/v2/oauth2/token', {
        method: "POST",
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
        body: "grant_type=client_credentials&client_id=" + key + "&client_secret=" + secret,
         headers: {
           "Content-Type": "application/x-www-form-urlencoded"
          //  https://dev.to/sidthesloth92/understanding-html-form-encoding-url-encoded-and-multipart-forms-3lpa
        }
    }).then(function(resp) {
    return resp.json();
    }).then(function(data) {
    token= data
    console.log('new token updated: ', data)})
}
getNewToken();
// ****************************************************************************** //









// ****************************************************************************** //
// retrieves access token & makes API call to get animals
function apiCallForAnimals(animalType, zip, breed) {
  console.log("GET ME SOME ANIMALS - API CALL MADE");
  fetch(
    `https://api.petfinder.com/v2/animals?type=${animalType}&breed=${breed}&location=${zip}&status=adoptable&distance=25&limit=100`,
    {
      headers: {
        // FROM THE DOCUMENTATION
        // https://www.petfinder.com/developers/v2/docs/#get-animal-types
        // token comes back in object form as: 
        // {
        //   "token_type": "Bearer",
        //   "expires_in": 3600,
        //   "access_token": "..."
        // }
        Authorization: `Bearer ${token.access_token}`
      }
    }
  )
  // .then(function(response) {
  //   var json = response.json();
  //   console.log("here is an ANIMAL OBJECT: ", json);
  // }); 
  .then(response => response.json())
  .then(responseJson => getMeSomeAnimals(responseJson))

}    



function getMeSomeAnimals(responseJson) {
  console.log(responseJson);
  // show the searched animals - to populate in selection.html page
  $("#results ul").html("");
  for (let i = 0; i < responseJson.animals.length; i++) {
    $("#results ul").append(`<li>
     <h3>${responseJson.animals[i].name}</h3>
     <img src="${responseJson.animals[i].photos[0].medium}" alt="animals" class="petImg">
     <p>${responseJson.animals[i].breeds.primary}<p>
     <p>${responseJson.animals[i].age} ${responseJson.animals[i].gender}<p>
     <a href="${responseJson.animals[i].url}" class="animalLink" target="_blank">See me on Petfinder!</a>
     
     </li>`);
  }  
}
// ****************************************************************************** //
















function searchPets() {
  console.log("API search Request Made - NOW go get me some ANIMALS !!!");
  $("form").submit(event => {
    alert("Submitted"); // testing
    event.preventDefault();  // do not submit to server, input used for building API call
    console.log("******** FORM SUBMITTED - HERE ARE YOUR SELETIONS TO BUILD API QUERY *********")
    // var animalType = $(".tablinks").val(); 
    var animalType = $("#petType").val(); 
    var zip = $("#zip").val();
    var breed = $("#dogbreed").val();
    console.log("you are looking for a: ", animalType);
    console.log("the breed you selected is: ", breed);
    console.log("your zip code is: ", zip);
    apiCallForAnimals(animalType, zip, breed);
  });  
}

