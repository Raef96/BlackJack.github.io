//Black Jack
let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-score", div: "#yourbox", score: 0 },
  dealer: { scoreSpan: "#dealer-blackjack-score", div: "#dealerbox", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

const hitSound = new Audio("sounds/swish.m4a");
const winSound = new Audio("sounds/cash.mp3");
const lossSound = new Audio("sounds/aww.mp3");

document
  .querySelector("#blackjack-hit-btn")
  .addEventListener("click", blackjackHit);
document
  .querySelector("#blackjack-stand-btn")
  .addEventListener("click", blackjackStand);
document
  .querySelector("#blackjack-deal-btn")
  .addEventListener("click", blackjackDeal);

function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();
    console.log(card);
    showCard(YOU, card);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(activePlayer, card) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  } else {
  }
}

function blackjackDeal() {
  if (blackjackGame["turnsOver"]) {
    blackjackGame["isStand"] = false;
    let youImages = document.querySelector("#yourbox").querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealerbox")
      .querySelectorAll("img");

    for (i = 0; i < youImages.length; i++) {
      youImages[i].remove();
    }

    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;

    //refresh the scores
    document.querySelector("#your-blackjack-score").textContent = 0;
    document.querySelector(YOU["scoreSpan"]).style.color = "white";

    document.querySelector("#dealer-blackjack-score").textContent = 0;
    document.querySelector(DEALER["scoreSpan"]).style.color = "white";

    document.querySelector("#blackjack-result").textContent = "Let's Play";
    document.querySelector("#blackjack-result").style.color = "black";

    blackjackGame["turnsOver"] = true;
  }
}

function updateScore(card, activePlayer) {
  if (card === "A") {
    //check if we add A as 11 , the score still bellow 21
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += 11;
    } else {
      activePlayer["score"] += 1;
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

//sleep function which is going to be a promise object
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Here we implement the dealer Logic
async function blackjackStand() {
  blackjackGame["isStand"] = true;
  while (DEALER["score"] < 16 && blackjackGame["isStand"]) {
    let card = randomCard();
    showCard(DEALER, card);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(1000);
  }

  blackjackGame["turnsOver"] = true;
  let winner = determineWinner();
  showResult(winner);
}

//Determine the winner
//Update wins, Losses and Draws
function determineWinner() {
  let winner;
  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      blackjackGame["draws"]++;
    }
    //When you bust and dealer noy
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    blackjackGame["losses"]++;
    winner = DEALER;
    //When both bust
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["draws"]++;
  }

  return winner;
}

//Show the result of Dealing
function showResult(winner) {
  let msg, msgColor;
  if (blackjackGame["turnsOver"]) {
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      msg = "You Won !!";
      msgColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      msg = "You Lost !!";
      msgColor = "red";
      lossSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      msg = "Draw";
      msgColor = "yellow";
    }
    document.querySelector("#blackjack-result").textContent = msg;
    document.querySelector("#blackjack-result").style.color = msgColor;
  }
}
