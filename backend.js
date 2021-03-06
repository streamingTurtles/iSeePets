// ****************************************************************************** //
// from petfinder.com/user/developer-settings  -  API key & Secrete
// var key = "i4WSkGk27C4yI7wCconCIHNXNrZh2dLsepStJSgNB7p9137P05"; // PAC api key
// var secret = "Dav2xXd8H9Y7PTvQvBymZPdYAP3KYXYTLWMu5Eca"; // PAC api secrete
// var secret = "rNmNp9X9CQ3wh3pXf7NWNYIhzac9Ox5phsc3HjTe";  // PAC reset secrete on 01/04/2020 when rate limit was exceeded

// var key = "jp5bUg2jBnsMZ3vlbulEsgxB5QTb5nffFfAVIxolBrX43YClaE"; // Natalia's key
// var secret = "PFmuqQcXF4uihggaxI4IKdsNTGUUl9386ozcfvRZ";

var key = "eUODi9ZTKGQMm97fbBV5r33j7Vavb3ICI8w9bmlnFC5LG6mSA8"; // New Key 1/5/20
var secret = "gPiPsgH2XOFYjoMiYsFdN8UbwVRwiC3l415pLJtt";  

// from https://www.petfinder.com/developers/v2/docs/
// from documentation : use deconstructed curl to browser fetch to get a new token for each API request
// curl -d "grant_type=client_credentials&client_id={CLIENT-ID}&client_secret={CLIENT-SECRET}" https://api.petfinder.com/v2/oauth2/token

//frontend
tablinks = document.getElementsByClassName("tablinks");
tabcontent = document.getElementsByClassName("tabcontent");
var petType = "dog";
defaultIsDog();

function defaultIsDog() {
  document.getElementById("dogs").style.display = "block";
  tablinks[0].className = tablinks[0].className += " active";
  console.log(petType);
}
function changetabs(evt, tabname) {
  if (document.querySelector("#results").children.length) {
    $("#results").html("");
  }
  var i;
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabname).style.display = "block";
  evt.currentTarget.className += " active";
  petType = evt.currentTarget.value;
  console.log(petType);
}

// ***************************************************************************************** //
var token = "";

function getNewToken() {
  console.log("getting a NEW TOKEN, they expire every 3600 seconds: ", token);
  fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
    body:
      "grant_type=client_credentials&client_id=" +
      key +
      "&client_secret=" +
      secret,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      //  https://dev.to/sidthesloth92/understanding-html-form-encoding-url-encoded-and-multipart-forms-3lpa
    },
  })
    .then(function (resp) {
      return resp.json();
    })
    .then(function (data) {
      token = data;
      console.log("new token updated: ", data);
    });
}
getNewToken();

// ***************************************************************************************** //
// retrieves access token & makes API call to get animals
var sNeeds;
// $(document).ready(function(){
//       $(‘input[type=“checkbox”]’).click(function(){
//           if($(this).prop(“checked”) == true){
//              sNeeds = “&special_needs=true”;
//           }
//           else if($(this).prop(“checked”) == false){
//               $(“#result”).html(“Checkbox is unchecked.“);
//             sNeeds = “”
//           }
//       });
//   });

// <<<<<<< luwenxisong
function apiCallForAnimals(type, zip, breed, sNeed, longitude, latitude) {
  console.log("GET ME SOME ANIMALS - API CALL MADE");
  fetch(
    (url = `https://api.petfinder.com/v2/animals?type=${type}${breed}&location=${zip}${sNeed}&status=adoptable&distance=25&limit=100`),
    // testing for location:
    // url=`https://api.petfinder.com/v2/animals?type=${type}${breed}&location=${zip}&location=${longitude}&location=${latitude}${sNeed}&status=adoptable&distance=25&limit=100`,
    // >>>>>>> 090134fef59b4164ae344183ad76715fcc1a572e
    // function apiCallForAnimals(type, zip, breed, sNeeds) {
    //   console.log("sNeeds variable is: ", sNeeds);
    //   console.log("GET ME SOME ANIMALS - API CALL MADE");
    //   fetch(
    //     // value=“&special_needs=true”
    //     `https://api.petfinder.com/v2/animals?type=${type}${breed}&location=${zip}&special_needs=${sNeeds}&status=adoptable&distance=25&limit=100`,
    // >>>>>>> main

    // `https://api.petfinder.com/v2/animals?type=${type}${breed}&location=${zip}&status=adoptable&distance=25&limit=100`,
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
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  )
    // .then(function(response) {
    //   var json = response.json();
    //   console.log("here is an ANIMAL OBJECT: ", json);
    // });
    .then((response) => response.json())
    .then((responseJson) => getMeSomeAnimals(responseJson))
    .catch((err) => console.log(err));
  console.log(url);
}

// ***************************************************************************************** //
function initMap() {
  var options = {
    zoom: 15,
    center: { lat: 40.650002, lng: -73.949997 }, // brooklyn coordinates @ 11229
  };
  const map = new google.maps.Map(document.getElementById("map"), options);
  const geocoder = new google.maps.Geocoder();
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("address").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
        icon: "icons/paw_icon_smaller.png",
        animation: google.maps.Animation.BOUNCE,
        draggable: true,

        // "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      });
      // var marker = new google.maps.Marker;
      var infoWindow = new google.maps.InfoWindow({
        content: "<h1>iSeePets</h1>",
      });
      marker.addListener("click", function () {
        infoWindow.open(map, marker);
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

// ***************************************************************************************** //
var testArray = [];
function getMeSomeAnimals(responseJson) {
  console.log(responseJson);

  // PAC added 01/03/2020, Sunday
  if (!responseJson.animals) {
    // if we don't get a response, there was an error with the query
    throwError(
      "THERE IS AN ERROR WITH THIS SEARCH, PLEASE SELECT ALTERNATIVE SELECTION"
    );
    return;
  }
  if (responseJson.animals.length == 0) {
    // if there are no results for our search - array returns nothing, shows a "0"
    throwError(
      "THERE ARE NO ANIMALS FOUND WITH YOUR SEARCH DETAILS,  PLEASE TRY ALTERNATIVE SELECTIONS"
    );
    return;
  }

  $("#results").html("");

  // show the searched animals - to populate in selection.html page
  // PAC added 01/04/2020, Monday to this for loop the zip code and button & click handler to automatically update on google maps
  for (let i = 0; i < responseJson.animals.length; i++) {
    testArray[i] = i;
    $("#results").append(`<div class='icard'> 
              <img class='resultImg' src="${
                responseJson.animals[i].photos[0].medium
              }" alt="animals" class="petImg">
                <h3>${responseJson.animals[i].name}</h3>
                <p>${responseJson.animals[i].breeds.primary}<p>
                <p>${responseJson.animals[i].age} ${
      responseJson.animals[i].gender
    }<p>
                <a href="${
                  responseJson.animals[i].url
                }" class="animalLink" target="_blank">See me on Petfinder!</a>
                <p>See me on the map at zip code: ${
                  responseJson.animals[i].contact.address.postcode
                }<p>
                <option id='seeMeOnMap${[i]}' value="${
      responseJson.animals[i].contact.address.postcode
    }"> "CLICK HERE" to Map Me</option>
                </div>`);
  }
  // PAC added 01/04/2020, Sunday
  // need to use the option selector to avoid conflict with the zoom +/- google map buttons
  // note: only the input, button, meter, li, option, progress & param elements support the value attribute - I used option tag
  $("option").click(function () {
    console.log("zip code of this pet is: ", this.value);
    document.getElementById("address").value = this.value; // dynamically sets the input value of the dynamically created card !!!
    // geocodeAddress(geocoder, map);

    // put zip in value
    // call geocode or something in init func??
    // geocodeAddress(geocoder, map);
    $("#submit").click();
  });
  console.log("test array", testArray);
}

// PAC added 01/03/2020, Sunday
function throwError(errorMsg) {
  $("#results").html("");
  $("#results").append(`${errorMsg}`);
  console.log("ERROR WITH YOUR SEARCH: ", errorMsg);
}

// ***************************************************************************************** //
function searchPets() {
  console.log("API search Request Made - NOW go get me some ANIMALS !!!");
  $("form").submit((event) => {
    // alert("Submitted - from searchPets() function");
    event.preventDefault(); // do not submit to server, input used for building API call
    console.log(
      "******** FORM SUBMITTED - HERE ARE YOUR SELETIONS TO BUILD API QUERY *********"
    );
    // var animalType = $(".tablinks").val();
    var longitude = 0;
    var latitude = 0;
    var type = petType;
    var zip = $("#zip").val();
    var breed;
    var sNeed = "";
    if ($(".specialNeeds").is(":checked")) {
      sNeed = "&special_needs=true";
    }
    if ($("#dogbreed").val() !== null) {
      breed = "&breed=" + $("#dogbreed").val();
    } else {
      breed = "";
    }
    console.log("you are looking for a: ", type);
    console.log("the breed you selected is: ", breed);
    console.log("your zip code is: ", zip);
    console.log("Special needs", sNeed);
    apiCallForAnimals(type, zip, breed, sNeed, longitude, latitude);
  });
}
function searchPetsCat() {
  console.log("API search Request Made - NOW go get me some ANIMALS !!!");
  $("form").submit((event) => {
    // alert("Submitted - from seachPetsCat() function");
    event.preventDefault(); // do not submit to server, input used for building API call
    console.log(
      "******** FORM SUBMITTED - HERE ARE YOUR SELETIONS TO BUILD API QUERY *********"
    );
    // var animalType = $(".tablinks").val();
    var type = petType;
    var zip = $("#catzip").val();
    var breed;
    var sNeed = "";
    if ($(".specialNeeds").is(":checked")) {
      sNeed = "&special_needs=true";
    }
    if ($("#catbreed").val() !== null) {
      breed = "&breed=" + $("#catbreed").val();
    } else {
      breed = "";
    }
    console.log("you are looking for a: ", type);
    console.log("the breed you selected is: ", breed);
    console.log("your zip code is: ", zip);
    console.log("Special needs", sNeed);
    apiCallForAnimals(type, zip, breed, sNeed);
  });
}
// DOG LOCAL STORAGE
// ***************************************************************************************** //
const dogform = document.querySelector("form#doggies");
const ul_forDog = document.querySelector("ul#doggiesUL");
const clearButton = document.getElementById("dogsClearLS");
const input_dogInfo = document.getElementById("dogFav");
let dogFavArray = localStorage.getItem("theDogs")
  ? JSON.parse(localStorage.getItem("theDogs"))
  : [];
console.log("DOG FAVORITS: ", dogFavArray);
localStorage.setItem("theDogs", JSON.stringify(dogFavArray));
const Dogdata = JSON.parse(localStorage.getItem("theDogs"));
const dogLiMaker = (text) => {
  const li_forDog = document.createElement("li");
  li_forDog.textContent = text;
  ul_forDog.appendChild(li_forDog);
};
dogform.addEventListener("submit", function (e) {
  e.preventDefault(); // don't submit to server
  dogFavArray.push(input_dogInfo.value);
  localStorage.setItem("theDogs", JSON.stringify(dogFavArray));
  dogLiMaker(input_dogInfo.value);
  input_dogInfo.value = "";
});
Dogdata.forEach((dogFav) => {
  dogLiMaker(dogFav);
});
clearButton.addEventListener("click", function () {
  localStorage.clear();
  while (ul_forDog.firstChild) {
    ul_forDog.removeChild(ul_forDog.firstChild);
  }
  dogFavArray = [];
});
// CAT LOCAL STORAGE
// ***************************************************************************************** //
const catform = document.querySelector("form#kitties");
const ul_forCat = document.querySelector("ul#kittiesUL");
const clearButtonForCat = document.getElementById("catsClearLS");
const input_catInfo = document.getElementById("catFav");
let catFavArray = localStorage.getItem("theCats")
  ? JSON.parse(localStorage.getItem("theCats"))
  : [];
console.log("CAT FAVORITS: ", catFavArray);
localStorage.setItem("theCats", JSON.stringify(catFavArray));
const Catdata = JSON.parse(localStorage.getItem("theCats"));
const CatLiMaker = (text) => {
  const li_forCat = document.createElement("li");
  li_forCat.textContent = text;
  ul_forCat.appendChild(li_forCat);
};
catform.addEventListener("submit", function (e) {
  e.preventDefault(); // don't submit to server
  catFavArray.push(input_catInfo.value);
  localStorage.setItem("theCats", JSON.stringify(catFavArray));
  CatLiMaker(input_catInfo.value);
  input_catInfo.value = "";
});
Catdata.forEach((catFav) => {
  CatLiMaker(catFav);
});
clearButtonForCat.addEventListener("click", function () {
  localStorage.clear();
  while (ul_forCat.firstChild) {
    ul_forCat.removeChild(ul_forCat.firstChild);
  }
  catFavArray = [];
});
