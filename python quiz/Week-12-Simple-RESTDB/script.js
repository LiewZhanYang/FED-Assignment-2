function fetchScoreboardData() {
  fetch("https://fedassignment2ccgame-ef3b.restdb.io/rest/scorepythonquiz", {
    method: "GET",
    headers: {
      Authorization: "Bearer 65b1d9dda2399ae3ac4d588e",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tbody = document
        .getElementById("leaderboard")
        .querySelector("tbody");
      tbody.innerHTML = ""; // Clear existing rows
      data.forEach((record) => {
        const row = `<tr>
                        <td>${record.Name}</td>
                        <td>${record.Email}</td>
                        <td>${record.Score}</td>
                     </tr>`;
        tbody.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

fetchScoreboardData();

document
  .getElementById("recordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    fetch("https://fedassignment2ccgame-ef3b.restdb.io/rest/scorepythonquiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 65b1d9dda2399ae3ac4d588e",
      },
      body: JSON.stringify({ Name: name, Email: email, Score: 0 }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetchScoreboardData(); // Refresh the leaderboard to include the new record
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  });
