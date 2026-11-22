const gameBoard = document.getElementById("game-board");

const difficultySelect = document.getElementById("difficulty");

const difficultySpeeds = {
    easy: 1300,
    normal: 1000,
    hard: 700
};

function getGameSpeed() {
    return difficultySpeeds[difficultySelect.value];
}

const holes = [];

for (let i = 0; i < 20; i++) {
    const hole = document.createElement("div");

    hole.classList.add("hole");

    gameBoard.appendChild(hole);

    holes.push(hole);
}

let score = 0;
let timeLeft = 30;
let isPlaying = false;

let currentCharacter = null;
let activeHole = null;

let spawnTimer;
let countdownTimer;

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

const characters = [
    {
        name: "macinka",
        image: "images/macinka.png",
        points: 100,
        chance: 75
    },
    {
        name: "babis",
        image: "images/babis.png",
        points: 400,
        chance: 10
    },
    {
        name: "schillerova",
        image: "images/schillerova.png",
        points: -500,
        chance: 15
    }
];

function spawnCharacter() {

    holes.forEach(function (hole) {
        hole.innerHTML = "";
    });

    const randomIndex = Math.floor(Math.random() * holes.length);
    activeHole = holes[randomIndex];

    currentCharacter = getRandomCharacter();

    const image = document.createElement("img");
    image.src = currentCharacter.image;
    image.alt = currentCharacter.name;

    activeHole.appendChild(image);
}

function getRandomCharacter() {
    const random = Math.random() * 100;

    if (random < 75) {
        return characters[0];
    } else if (random < 85) {
        return characters[1];
    } else {
        return characters[2];
    }
}

holes.forEach(function (hole) {

    hole.addEventListener("click", function () {

        if (!isPlaying || hole !== activeHole || !currentCharacter) {
            return;
        }

        score += currentCharacter.points;

        scoreDisplay.textContent = score;

        const pointsPopup = document.createElement("div");
        pointsPopup.classList.add("points");

        pointsPopup.textContent =
            currentCharacter.points > 0
                ? "+" + currentCharacter.points
                : currentCharacter.points;

        if (currentCharacter.name === "babis") {
            pointsPopup.classList.add("bonus");
        } else if (currentCharacter.name === "schillerova") {
            pointsPopup.classList.add("negative");
        } else {
            pointsPopup.classList.add("positive");
        }

        hole.innerHTML = "";
        hole.appendChild(pointsPopup);

        activeHole = null;
        currentCharacter = null;

        setTimeout(function () {
            pointsPopup.remove();
        }, 600);
    });

});

const pravidlaButton = document.getElementById("pravidla-button");
const pravidlaWindow = document.getElementById("pravidla-window");

pravidlaButton.addEventListener("click", function () {
    pravidlaWindow.classList.toggle("hidden");
});

const startButton = document.getElementById("start");

startButton.addEventListener("click", function () {
    gameBoard.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

function endGame() {
    isPlaying = false;

    clearInterval(spawnTimer);
    clearInterval(countdownTimer);

    activeHole = null;
    currentCharacter = null;

    holes.forEach(function (hole) {
        hole.innerHTML = "";
    });

    difficultySelect.disabled = false;
    startButton.disabled = false;
    startButton.textContent = "ZNOVU?";
    saveScore(score);
}

function saveScore(finalScore) {

    let nickname = prompt("Zadej svou přezdívku:");

    if (!nickname || nickname.trim() === "") {
        nickname = "KLADIVOUN";
    }

    let scores = JSON.parse(localStorage.getItem("whackScores")) || [];

    const newScore = {
        nickname: nickname.trim(),
        score: finalScore
    };

    scores.push(newScore);

    scores.sort(function (a, b) {
        return b.score - a.score;
    });

    scores = scores.slice(0, 10);

    localStorage.setItem("whackScores", JSON.stringify(scores));
}

startButton.addEventListener("click", function () {

    if (isPlaying) {
        return;
    }

    score = 0;
    timeLeft = 30;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    isPlaying = true;

    difficultySelect.disabled = true;
    startButton.disabled = true;

    spawnCharacter();

    spawnTimer = setInterval(spawnCharacter, getGameSpeed());

    countdownTimer = setInterval(function () {
        timeLeft--;

        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }

    }, 1000);

});