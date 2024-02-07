// Function to fetch cards from the API and draw them
function drawCardsFromApi() {
  const API_URL = 'https://fedbackup-7b14.restdb.io/rest/memorygame';
  const API_KEY = '65c396ee9612a48827d496ad';

  fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-apikey': API_KEY
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Assuming each 'image' field in your data is an array with a single string (the image URL)
    currentCards = data.map(card => ({
      id: card.id,
      name: card.name,
      img: card.image[0] // You might need to adjust this if the structure is different
    }));
    currentCards = [...currentCards, ...currentCards]; // Duplicate the card data for matching
    shuffleAndDisplayCards(currentCards);
  })
  .catch(error => {
    console.error("Could not load cards from the API:", error);
  });
}

// Function to shuffle cards and append to DOM
function shuffleAndDisplayCards(cards) {
  const shuffledCards = shuffle(cards);
  cardContainer.innerHTML = ""; // Clear the card container
  available.innerHTML = counter;

  shuffledCards.forEach(el => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-id", el.id);
    card.innerHTML = `
      <div class="card__front">
        <img class="front__img" src="${el.img}" alt="${el.name}" />
        <h6 class="card__name">${el.name}</h6>
      </div>
      <div class="card__back">
        <img class="back__img" src="image/memory-image.webp" alt="blank" />
      </div>
    `;
    card.addEventListener("click", handleClick);
    cardContainer.appendChild(card);
  });
}

// Call drawCardsFromApi when the DOM content is loaded
document.addEventListener('DOMContentLoaded', drawCardsFromApi);
