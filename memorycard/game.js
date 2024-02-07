const cardContainer = document.querySelector(".card-container");
const available = document.querySelector("#available");
const modalTitle = document.querySelector("#modal-title");
const modal = document.querySelector("#modal");
let currentCards = [];
let isPaused = false;
let counter = 15;
let isLose = false;

function shuffle(array) {
  let counter = array.length,
    temp,
    index;
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function win() {
  isPaused = true;
  modalTitle.innerHTML = "You win! 🙌🥳";
  modal.classList.add("modal--open");
}

function lose() {
  isLose = true;
  modalTitle.innerHTML = "Thanks for playing 🙌";
  modal.classList.add("modal--open");
}

function handleClick(e) {
  const { target } = e;
  if (
    !isPaused &&
    !isLose &&
    !target.classList.contains("card--guessed") &&
    !target.classList.contains("card--picked")
  ) {
    isPaused = true;
    const picked = cardContainer.querySelector(".card--picked");
    if (picked) {
      if (picked.dataset.id === target.dataset.id) {
        target.classList.remove("card--picked");
        picked.classList.remove("card--picked");
        target.classList.add("card--guessed");
        picked.classList.add("card--guessed");
        isPaused = false;
      } else {
        target.classList.add("card--picked");
        setTimeout(() => {
          target.classList.remove("card--picked");
          picked.classList.remove("card--picked");
          isPaused = false;
        }, 1500);
      }
      counter -= 1;
      available.innerHTML = counter;
      if (counter === 0) {
        lose();
      }
    } else {
      target.classList.add("card--picked");
      isPaused = false;
    }

    const isWin =
      cardContainer.querySelectorAll(".card--guessed").length ===
      currentCards.length;
    if (isWin) {
      win();
    }
  }
}

function drawCards(cards) {
  cardContainer.innerHTML = "";
  available.innerHTML = counter;

  shuffle(cards).forEach((el) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-id", el.id);
    card.innerHTML = `
            <div class="card__front">
              <img
                class="front__img"
                src="${el.image}"
                alt="${el.name}"
              />
              <h6 class="card__name">${el.name}</h6>
            </div>
            <div class="card__back">
              <img
                class="back__img"
                style="background-image: url(image\memory-image.webp);
                alt="blank"
              />
            </div>
          `;
    card.addEventListener("click", handleClick);
    cardContainer.appendChild(card);
  });
}

// API request to fetch card data
fetch("https://fedbackup-7b14.restdb.io/rest/memorygame", {
  headers: {
    "Content-Type": "application/json",
    "x-apikey": "65c396ee9612a48827d496ad",
  },
})
  .then((response) => response.json())
  .then((data) => {
    currentCards = data.map((card) => ({
      id: card.id,
      name: card.name.replace(/"/g, ""),
      image: `https://fedbackup-7b14.restdb.io/media/${card.image[0]}`,
    }));
    // Fetch image URLs for each card
    return Promise.all(currentCards.map((card) => fetch(card.image)));
  })
  .then((responses) =>
    Promise.all(responses.map((response) => response.blob()))
  )
  .then((blobs) => Promise.all(blobs.map((blob) => URL.createObjectURL(blob))))
  .then((urls) => {
    // Replace image URLs with the fetched URLs
    currentCards.forEach((card, index) => {
      card.image = urls[index];
    });
    drawCards(currentCards);
  })
  .catch((error) => console.error("Error fetching data:", error))
  .finally(() => {
    // Additional code to run after the fetch operation, such as hiding a loading spinner or showing the game board
    console.log("Fetch operation completed");
    // For example, you can show the game board by setting its display property to "block"
    document.querySelector(".content").style.display = "block";
  });
