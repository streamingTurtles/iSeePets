
      //.post to get generated api token
      function getapiKey() {
        $.post(
          "https://api.petfinder.com/v2/oauth2/token",
          "grant_type=client_credentials&client_id=i4WSkGk27C4yI7wCconCIHNXNrZh2dLsepStJSgNB7p9137P05&client_secret=Dav2xXd8H9Y7PTvQvBymZPdYAP3KYXYTLWMu5Eca",
          function (response) {
            // console.log(response);
            // console.log(response.access_token);
            return response.access_token;
          }
        );
      }

      var apiKey = getapiKey();
      var url = "https://api.petfinder.com/v2/animals";

      $.get({
        url:
          "https://cors-anywhere.herokuapp.com/https://api.petfinder.com/v2/animals",
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJpNFdTa0drMjdDNHlJN3dDY29uQ0lITlhOclpoMmRMc2VwU3RKU2dOQjdwOTEzN1AwNSIsImp0aSI6IjIyZDViMTQ3M2JjYTdkNzk0NDQwNGE2ODVlMDY1MGEwMTdhMzk2YjRiNGZlNDRhNWExNTM5ODE4ODEwNmJjOTEwYWM5YmNlOTdhYmJkZjFmIiwiaWF0IjoxNjA4NDAyMzgyLCJuYmYiOjE2MDg0MDIzODIsImV4cCI6MTYwODQwNTk4Miwic3ViIjoiIiwic2NvcGVzIjpbXX0.idXHWoYk_-Bqi1f7TyTfQtIYFurFzxqn_On_UY9bA28oSQ9vyeY-9CayTddGIfMATxLHDoC4lZGlFCN5Rqhcz0ADQWPW3XuVi7aBRXQ1zoR78tbp9hWPIrfSseqf02LLiZW9Y5pk1R-0Kz6YXPe36T6vFbf6KKPw6Thamb9exYb9P8VUy3JaFgqJhlhKmDRAz6VOo8ilXmMVb7ymh1DcuSpWA_nvlMaDSi_s_jYS-Lw9PhUDP2_I05u8H411Axai6iNAxhshCxJcNoM1j8VBLEDe5C7cCeCzfADGk5-AIsmMfsAIboMNoDFZItkUotnTITh6d35YgAqdk30jtjYwpg",
        },
      }).then((res) => {
        console.log(res);
        $(".breed").text(" Breed:" + res.animals[0].breeds.primary);
      });


