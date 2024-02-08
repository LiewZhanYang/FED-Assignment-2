//[STEP 0]: Make sure our document is A-OK
document.addEventListener("DOMContentLoaded", function () {
  // Set your API key and base URL for the API
  const APIKEY = "65b1d9dda2399ae3ac4d588e";
  const BASE_URL =
    "https://fedassignment2ccgame-ef3b.restdb.io/rest/scorepythonquiz";
  const successAnimation = document.getElementById("success");

  // Initially hide the success message and Lottie animation
  
  getHallOfFame();

  //[STEP 1]: Create our submit form listener
  document
    .getElementById("recordForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent default form submission
      const scoreKey = "quizScore";
      localStorage.setItem(scoreKey, scoreCount);

      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;
      let score = parseInt(localStorage.getItem("quizScore"), 10);

      if (isNaN(score)) {
        console.error("Score is not a number", score);
        // Handle error: inform the user, abort the submission, etc.
        return;
      }
      // Prepare the data to be sent in the POST request
      let jsondata = {
        Name: name,
        Email: email,
        Score: score, // Assuming you want to set a default score or get it from another input field
      };

      // Prepare the POST request settings
      let settings = {
        async: true,
        crossDomain: true,
        url: BASE_URL,
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(jsondata),
        beforeSend: function () {
          // Optional: Modify the UI to indicate loading (e.g., disable submit button)
        },
      };

      // Make the POST request to add a new record
      fetch(settings.url, {
        method: settings.method,
        headers: settings.headers,
        body: settings.data,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Optional: Update the UI to indicate success
          getHallOfFame(); // Refresh the Hall of Fame list
          successAnimation.style.display = "block"; // Show the Lottie animation
          
        })
        .catch((error) => {
          console.error("Error posting data:", error);

          if (error.name === "ValidationError") {
            console.error("Validation errors:", error.list);
          }
        });
    });

  // Function to get the Hall of Fame records
  function getHallOfFame() {
    fetch(BASE_URL, {
      method: "GET",
      headers: {
        "x-apikey": APIKEY,
        "cache-control": "no-cache",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Empty string to hold our HTML content
        let content = "";
        // Process the data and update the table
        data.forEach((record) => {
          content += `<tr>
                    <td>${record.Name}</td>
                    <td>${record.Email}</td>
                    <td>${record.Score}</td>
                  </tr>`;
        });
        // Update the table body with our new HTML content
        document
          .getElementById("leaderboard")
          .querySelector("tbody").innerHTML = content;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
});
