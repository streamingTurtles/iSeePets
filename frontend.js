defultIsDog()
function defultIsDog(){
  document.getElementById("dogs").style.display = "block";
}
function changetabs(evt, tabname) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabname).style.display = "block";
  evt.currentTarget.className += " active";
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

