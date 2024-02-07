document.addEventListener("DOMContentLoaded", function () {
  const cardContainer = document.querySelector(".card-container");
  const modalTitle = document.querySelector("#modal-title");
  const modal = document.querySelector("#modal");
  let currentCards = [];
  let isPaused = false;
  let counter = 24; // Set this to the number of moves allowed
  let isLose = false;

  // Function to shuffle cards
  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // Function to handle card click events
  function handleClick(e) {
    // Your existing click logic here
  }

  // Function to draw cards
  function drawCards(cardsData) {
    cardContainer.innerHTML = ""; // Clear the container before adding new cards

    cardsData.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card";
      cardElement.setAttribute("data-id", card.id);
      cardElement.innerHTML = `
        <div class="card__front">
          <img class="front__img" src="${card.img}" alt="${card.name}" />
          <h6 class="card__name">${card.name}</h6>
        </div>
        <div class="card__back"></div>
      `;
      cardElement.addEventListener("click", handleClick);
      cardContainer.appendChild(cardElement);
    });
  }

  // Function to fetch cards data from the API and display them
  function fetchAndDisplayCards() {
    const API_URL = "https://fedbackup-7b14.restdb.io/rest/memorygame";
    const API_KEY = "65c396ee9612a48827d496ad";

    fetch(API_URL, {
      method: "GET",
      headers: {
        "x-apikey": API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Process the data and convert it into the format needed for your game
        currentCards = data.map((item) => {
          return {
            id: item.id,
            name: item.name,
            img: item.image[0], // Assuming the first image is the one you want
          };
        });
        // Duplicate the card set for matching pairs
        currentCards = [...currentCards, ...currentCards];

        // Shuffle the cards data
        const shuffledCards = shuffle(currentCards);
        // Draw cards on the page
        drawCards(shuffledCards);
      })
      .catch((error) => {
        console.error("Could not load cards from the API:", error);
      });
  }

  // Call the function to fetch and display cards
  fetchAndDisplayCards();
});
