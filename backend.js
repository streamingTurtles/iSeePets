// ****************************************************************************** //
// from petfinder.com/user/developer-settings  -  API key & Secrete
var key = "i4WSkGk27C4yI7wCconCIHNXNrZh2dLsepStJSgNB7p9137P05";
var secret = "Dav2xXd8H9Y7PTvQvBymZPdYAP3KYXYTLWMu5Eca";

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
// ****************************************************************************** //

// ****************************************************************************** //
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

    // =======
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
  for (let i = 0; i < responseJson.animals.length; i++) {
    $("#results").append(`<div class='icard'> 
    <img class='resultImg' src="${responseJson.animals[i].photos[0].medium}" alt="animals" class="petImg">
     <h3>${responseJson.animals[i].name}</h3>
     <p>${responseJson.animals[i].breeds.primary}<p>
     <p>${responseJson.animals[i].age} ${responseJson.animals[i].gender}<p>
     <a href="${responseJson.animals[i].url}" class="animalLink" target="_blank">See me on Petfinder!</a>
     </div>`);
  }
}

// PAC added 01/03/2020, Sunday
function throwError(errorMsg) {
  $("#results").html("");
  $("#results").append(`${errorMsg}`);
  console.log("ERROR WITH YOUR SEARCH: ", errorMsg);
}

// ****************************************************************************** //

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
