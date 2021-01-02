tablinks = document.getElementsByClassName("tablinks")
tabcontent = document.getElementsByClassName("tabcontent");
var type
defaultIsDog()

function defaultIsDog(){

  document.getElementById("dogs").style.display = "block";
  tablinks[0].className = tablinks[0].className += " active"
  
}

function changetabs(evt, tabname) {
  var i
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabname).style.display = "block";
  evt.currentTarget.className += " active";
  type= evt.currentTarget.value
  console.log(type)
}



var apiKey= "i4WSkGk27C4yI7wCconCIHNXNrZh2dLsepStJSgNB7p9137P05";
var url = "https://api.petfinder.com/v2/animals";

$.get({
//   url: "https://api.petfinder.com/v2/animals",
  url: "https://cors-anywhere.herokuapp.com/",
  method: "Get",
  headers: {
      Authorization:" ",
  }
}).then((res) => {
  console.log(res);
});


