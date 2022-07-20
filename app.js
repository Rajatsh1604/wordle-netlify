const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const displayMessage = document.querySelector(".message-container");

// Modal function start
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
  modal.classList.toggle("show-modal");
}

closeButton.addEventListener("click", toggleModal);
window.onload = toggleModal;

const playerDetail = document.getElementById("start-game");
playerDetail.addEventListener("click", () => startGame());

let expectedGuess = "";

const startGame = () => {
  loadData();
  console.log(" Start Game : Expected Guess", expectedGuess);
  const playerName = document.getElementById("player-name").value;
  const playerEmail = document.getElementById("player-email").value;

  console.log("localstorage", playerName, playerEmail);

  localStorage.setItem("name", playerName);
  localStorage.setItem("email", playerEmail);
  if (playerName != null && playerEmail != null) {
    console.log("inside condition", playerEmail, playerName);
    modal.classList.toggle("show-modal");
  }
  let count = 0;
  setInterval(function () {
    count++;
    date = new Date();

    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    document.getElementById("game-timer").innerHTML = count;
    //   hour + ":" + minutes + ":" + seconds;
  }, 1000);
};
//modal function end

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "<<",
];

const guessRowArray = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

guessRowArray.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", `guessrow-${guessRowIndex}`);
  //tileDisplay.append(rowElement);
  //console.log(guessrow);
  guessRow.forEach((guessChar, guessCharIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      `guessrow-${guessRowIndex}-tile-${guessCharIndex}`
    );

    //tileElement.setAttribute(" contenteditable", "true");
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

const handleClick = (tileLetter) => {
  console.log("key Pressed", tileLetter);

  if (tileLetter === "<<") {
    deleteLetter();
    return;
  }
  if (tileLetter === "ENTER") {
    checkFullWord();
    return;
  }

  addLetter(tileLetter);
};

let presentRow = 0;
let presentTile = 0;
let isGameOver = false;

/**Function will add letter to tile*/
const addLetter = (tileLetter) => {
  if (presentTile < 5 && presentRow < 6) {
    const tile = document.getElementById(
      `guessrow-${presentRow}-tile-${presentTile}`
    );

    tile.textContent = tileLetter;

    guessRowArray[presentRow][presentTile] = tileLetter; //updating value in array
    tile.setAttribute("data", tileLetter);
    presentTile++;
    tile.setAttribute("style", "border-color: chartreuse");
  }
  console.log("Inside AddLetter()", guessRowArray);
};

/**Function will delete letter from tile*/
const deleteLetter = () => {
  console.log("inside detele function", presentTile);
  if (presentTile > 0) {
    presentTile--;
    const tile = document.getElementById(
      `guessrow-${presentRow}-tile-${presentTile}`
    );
    guessRowArray[presentRow][presentTile] = "";
    tile.textContent = "";
    tile.setAttribute("style", "border-color: none");
    tile.setAttribute("data", "");
  }
};

/**Function to check if word is correct! */
const checkFullWord = () => {
  console.log("check tile value inside check fnc", presentTile);
  const yourGuess = guessRowArray[presentRow].join("");
  if (presentTile > 4) {
    turnTiles();
    if (expectedGuess === yourGuess) {
      showMessage("Great Work");
      isGameOver = true;
      return;
    } else {
      if (presentRow >= 5) {
        isGameOver = false;
        showMessage("You Lost");
        return;
      }
      if (presentRow < 5) {
        // console.log("Inside presentRow < 5");
        presentRow++;
        presentTile = 0;
      }
    }
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  displayMessage.append(messageElement);

  setTimeout(() => displayMessage.removeChild(messageElement), 5000);
};

const colorKeyboard = (keyPressed, color) => {
  const key = document.getElementById(keyPressed);
  key.classList.add(color);
};

const turnTiles = () => {
  const rowTiles = document.getElementById(`guessrow-${presentRow}`).childNodes;
  let checkWordWordle = expectedGuess;
  const userGuess = [];

  rowTiles.forEach((tile) => {
    userGuess.push({ letter: tile.getAttribute("data"), color: "grey-tile" });
  });

  console.log("new arrayObject ", userGuess);

  userGuess.forEach((userGuess, index) => {
    if (userGuess.letter == expectedGuess[index]) {
      userGuess.color = "green-tiles";
      checkWordWordle = checkWordWordle.replace(userGuess.letter, "");
    }
  });

  userGuess.forEach((userGuess) => {
    if (checkWordWordle.includes(userGuess.letter)) {
      userGuess.color = "yellow-tiles";
      checkWordWordle = checkWordWordle.replace(userGuess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(userGuess[index].color);
      colorKeyboard(userGuess[index].letter, userGuess[index].color);
      tile.setAttribute("style", "border-color: none");
    }, 500 * index);
  });
};

//API function start
const getData = async (url) => {
  const result = await axios.get(url);
  console.log("ln4", result);
  return result;
};

const loadData = async () => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "45512ab8b2msh7a051b3309e6edcp1965edjsnf9c7235019db",
      "X-RapidAPI-Host": "wordle-answers-solutions.p.rapidapi.com",
    },
  };

  fetch("https://wordle-answers-solutions.p.rapidapi.com/today", options)
    .then((response) => response.json())
    .then((response) => (expectedGuess = response.today))
    .catch((err) => console.error(err));
};
//API function end
