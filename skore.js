
const scoreList = document.getElementById("score-list");

const scores = JSON.parse(localStorage.getItem("whackScores")) || [];


scores.forEach(function (result, index) {

    const row = document.createElement("div");
    row.classList.add("score-row");

    const position = document.createElement("span");
    position.textContent = index + 1 + ".";

    const nickname = document.createElement("span");
    nickname.textContent = result.nickname;

    const points = document.createElement("span");
    points.textContent = result.score;

    row.appendChild(position);
    row.appendChild(nickname);
    row.appendChild(points);

    scoreList.appendChild(row);
});
