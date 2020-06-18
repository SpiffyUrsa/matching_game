// Tracks whether the card is the first or second card being clicked. 
var clickCount = 0;
// Tracks the current score.
var totalClicks = 0; 
// Stores the ID of the first and second cards clicked.
var firstCard = "";
var secondCard = "";
// Allows for clearing of the timeout in case the new game button is pressed.
var flipTimeout;
// Tracks when the game is considered to be finished.
var matchedPairs = 0;
// Tracks the cards that have already been flipped over.
var used = [];
// Sounds used throughout the page. 
var flipSound = new Audio("cardflip.mp3");
var welcomeSound = new Audio("start.wav");
var winSound = new Audio("win.wav");
var newSound = new Audio("newrecord.wav");
// Adds the handle click function to every card via link.
var cardLinks = document.getElementsByClassName("stretched-link");
document.getElementById("newGame").addEventListener("click", handleNewGame);
Array.from(cardLinks).forEach(link => link.addEventListener("click", handleClick));
// Creates the best score display that shows the highest score off of local storage. 
let bestScore = document.createElement("h4");
bestScore.classList.add("col-6");
bestScore.classList.add("text-center");
bestScore.classList.add("text");
bestScore.classList.add("text-info");
bestScore.setAttribute("id", "best");
bestScore.innerHTML = `Best Score: ${localStorage.getItem("bestScore") || "0"}`;
document.getElementById("scores").appendChild(bestScore);

function handleClick (event) {
    let card = event.target.parentElement.parentElement;
    // Flip the card on click.
    card.style.transform = "rotateY(180deg)";
    const {id} = card;
    if (clickCount === 0 && !used.includes(id)) { 
        firstCard = id; 
        totalClicks++;
        clickCount++;
        document.getElementById("score").innerText = `Score: ${totalClicks}`;
        flipSound.play();
    };
    if (clickCount === 1 && firstCard !== id && !used.includes(id)) { 
        secondCard = id;
        totalClicks++; 
        clickCount++;
        document.getElementById("score").innerText = `Score: ${totalClicks}`;
        flipSound.play();
    };
    if (clickCount === 2) {
        handleCheck(firstCard, secondCard);
    }
}

function handleCheck (first, second) {
    let matches = {"1":"16", "2":"11", "3":"15", "4":"10", "5":"12", "6":"13", "7":"14", "8":"9", "17":"18"};
    // If a match is found do this.
    if (matches[first] === second || matches[second] === first) {
        document.getElementById(first).classList.remove("bg-primary");
        document.getElementById(first).classList.add("bg-success");
        document.getElementById(second).classList.remove("bg-primary");
        document.getElementById(second).classList.add("bg-success");
        used.push(first, second);
        clickCount = 0;
        firstCard = "";
        secondCard = "";
        matchedPairs++;
        // If all cards have been matched.
        if (matchedPairs === 9) {
            let finishedDiv = document.createElement("div");
            finishedDiv.classList.add("alert");
            finishedDiv.classList.add("alert-success");
            finishedDiv.innerHTML = "<b>Congratulations!</b> You matched them all!";
            document.querySelector("header").appendChild(finishedDiv);
            winSound.play();
            if (totalClicks < parseInt(localStorage.getItem("bestScore")) || localStorage.getItem("bestScore") === null) {
                localStorage.setItem("bestScore", totalClicks.toString());
                document.getElementById("best").innerHTML = `Best Score: ${localStorage.getItem("bestScore")}`;
                setTimeout(function () { newSound.play() }, 3000);
            }
        }
    } else {
        // Stops the ability to click other cards while two non matching cards are flipped over.
        Array.from(cardLinks).forEach(link => link.removeEventListener("click", handleClick));
        // After 1.5 seconds, renable to ability to click and flip back over the cards.
        flipTimeout = setTimeout(function () { 
            Array.from(cardLinks).forEach(link => link.addEventListener("click", handleClick));
            document.getElementById(first).style.transform = ""; 
            document.getElementById(second).style.transform = "";
            flipSound.play();
            }, 1500);
        clickCount = 0;
        firstCard = "";
        secondCard = "";
    }
}

function handleShuffle () {
    let cardRows = document.getElementsByClassName("card-deck");
    for (let i = 0; i < cardRows.length; i++) {
        let rowCards = cardRows[i].getElementsByClassName("card");
        for (let j = 0; j < rowCards.length; j++) {
            let random = Math.floor(Math.random() * 6);
            rowCards[j].style.order = random;
        }
    }
}

function handleNewGame () {
    if (matchedPairs === 9) {
        document.querySelector(".alert").remove();
    }
    let allCards = document.getElementsByClassName("card");
    Array.from(allCards).forEach(card => {
        card.style.transform = "";
        card.classList.remove("bg-success");
        card.classList.add("bg-primary"); 
    });
    Array.from(cardLinks).forEach(link => link.addEventListener("click", handleClick));
    document.getElementById("score").innerText = `Score: 0`;
    totalClicks = 0;
    matchedPairs = 0;
    clickCount = 0;
    used = [];
    handleShuffle();
    clearTimeout(flipTimeout);
    welcomeSound.play();
}

