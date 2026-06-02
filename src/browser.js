import img1 from "./assets/romans/symbol_1.png";
import img2 from "./assets/romans/symbol_2.png";
import img3 from "./assets/romans/symbol_3.png";
import img4 from "./assets/romans/symbol_4.png";
import img5 from "./assets/romans/symbol_5.png";
import img6 from "./assets/romans/symbol_6.png";
import img7 from "./assets/romans/symbol_7.png";
import img8 from "./assets/romans/symbol_8.png";
import eyeOpenImg from "./assets/eyes/open.png";
import eyeClosedImg from "./assets/eyes/close.png";
import Board from "./Board.js";
import Writer from "./Writer.js";
import "./style.css"

let board;
let topWriter;
let botWriter;
let eyesOpen;
let targetNumber;
let currentRow = "top";
let phase = "writer";
let writer2Name = "";
let roundFinished = false;
let roundTimer = null;
let timeLeft = 40;

const eyeImage = document.getElementById("eyeImage");
const timerText = document.getElementById("timerText");
const romanImages = {
    1: img1,
    2: img2,
    3: img3,
    4: img4,
    5: img5,
    6: img6,
    7: img7,
    8: img8
};
const newRoundBtn = document.getElementById("newRoundBtn");
const submitBtn = document.getElementById("submitBtn");
const topArena = document.getElementById("topArena");
const bottomArena = document.getElementById("bottomArena");
const rowInput = document.getElementById("rowInput");
const feedback = document.getElementById("feedback");
const chatMessages = document.getElementById("chatMessages");
const guildMembers = [
    "Vertrauen",
    "KouMizuki",
    "Terravox",
    "Eins",
    "xThannatos",
    "xDAsunaYuuki",
    "fabrication",
    "Eudazairon",
    "IRubrub",
    "Asalvo",
    "Lycte",
    "Wechsel",
    "Charmer",
    "Spaghettieis",
    "MatchaPuff",
    "Punchu",
    "Chouquette",
    "BasicColours",
    "LabysZW",
    "Hanso",
    "Eirian",
    "KimiSaru",
    "MyeChu",
    "evemorphs",
    "HerculePoi",
    "Zanika"
];

newRoundBtn.addEventListener("click", startNewRound);
submitBtn.addEventListener("click", submitRow);
rowInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        submitRow();
    }
});

showInitialScreen();

function showInitialScreen() {
    rowInput.style.display = "none";
    submitBtn.style.display = "none";
    eyeImage.style.display = "none";

    feedback.textContent = "";
    timerText.textContent = "";

    renderEmptyRow(topArena, "top");
    renderEmptyRow(bottomArena, "bottom");
}

function startNewRound() {
    newRoundBtn.textContent = "New Round";
    clearInterval(roundTimer);

    timeLeft = 40;
    timerText.textContent = `Time Left: ${timeLeft}s`;
    startRoundTimer();

    phase = "writer";
    roundFinished = false;

    eyeImage.style.display = "block";
    rowInput.style.display = "block";
    submitBtn.style.display = "block";

    rowInput.placeholder = "e.g. 483 347";

    eyesOpen = Math.random() < 0.5;
    targetNumber = Math.floor(Math.random() * 8) + 1;
    eyeImage.src = eyesOpen ? eyeOpenImg : eyeClosedImg;

    board = new Board(targetNumber, eyesOpen);
    topWriter = new Writer(board.getTopRow());
    botWriter = new Writer(board.getBottomRow());

    currentRow = "top";
    rowInput.value = "";
    feedback.textContent = "";

    chatMessages.innerHTML = "";
    writer2Name = guildMembers[Math.floor(Math.random() * guildMembers.length)];
    renderRow(topArena, topWriter.getWriter1Row(), "top");
    renderEmptyRow(bottomArena, "bottom");
}

function submitRow() {
    if (phase === "combine") {
        submitCombinedBoard();
        return;
    }

    const rawInput = rowInput.value.trim();

    if (currentRow === "top") {
        addChatMessage(`You: ${rawInput}`);
        addChatMessage(`${writer2Name}: ${topWriter.getWriter2()}`);
        addChatMessage("=-=-=-=-=-=-=-=-=-=-="  );

        currentRow = "bottom";
        rowInput.value = "";

        renderEmptyRow(topArena, "top");
        renderRow(bottomArena, botWriter.getWriter1Row(), "bottom");
        return;
    }

    addChatMessage(`You: ${rawInput}`);
    addChatMessage(`${writer2Name}: ${botWriter.getWriter2()}`);
    addChatMessage("=-=-=-=-=-=-=-=-=-=-=");

    startCombinePhase();
}

function renderRow(arenaElement, row, type) {
    arenaElement.innerHTML = "";

    const groups = type === "top"
        ? [[0, 1], [2], [3], [4, 5]]
        : [[0], [1, 2], [3, 4], [5]];

    for (const group of groups) {
        const platform = document.createElement("div");
        platform.classList.add("platform");

        if (group.length === 2) {
            platform.classList.add("double");
        }

        for (const index of group) {
            const symbol = document.createElement("div");
            symbol.classList.add("symbol");

            if (row[index] === 0) {
                symbol.textContent = "x";
                symbol.classList.add("hidden");
            } else {
                const img = document.createElement("img");
                img.src = romanImages[row[index]];
                img.classList.add("roman-image");
                symbol.appendChild(img);
            }

            platform.appendChild(symbol);
        }

        arenaElement.appendChild(platform);
    }
}

function renderEmptyRow(arenaElement, type) {
    arenaElement.innerHTML = "";

    const groups = type === "top"
        ? [[0, 1], [2], [3], [4, 5]]
        : [[0], [1, 2], [3, 4], [5]];

    for (const group of groups) {
        const platform = document.createElement("div");
        platform.classList.add("platform");

        if (group.length === 2) {
            platform.classList.add("double");
        }

        for (let i = 0; i < group.length; i++) {
            const symbol = document.createElement("div");
            symbol.classList.add("symbol", "empty-symbol");
            platform.appendChild(symbol);
        }

        arenaElement.appendChild(platform);
    }
}

function normalizeInput(value) {
    return value.replace(/\s+/g, "");
}

function toRoman(n) {
    switch (n) {
        case 1: return "I";
        case 2: return "II";
        case 3: return "III";
        case 4: return "IV";
        case 5: return "V";
        case 6: return "VI";
        case 7: return "VII";
        case 8: return "VIII";
        default: return "◇";
    }
}

function addChatMessage(message) {
    const p = document.createElement("p");
    p.classList.add("chat-message");
    p.textContent = message;

    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startCombinePhase() {
    phase = "combine";

    renderEmptyRow(topArena, "top");
    renderEmptyRow(bottomArena, "bottom");

    rowInput.value = "";
    rowInput.placeholder = "e.g. 483 347 // 255 623";

    feedback.textContent =
        "Combine both rows";
}

function submitCombinedBoard() {
    const rawInput = rowInput.value.trim();

    addChatMessage(`You Combined: ${rawInput}`);
    addChatMessage("=-=-=-=-=-=-=-=-=-=-=");

    startSafeSpotPhase();
}

function combineRow(a, b) {
    let result = "";

    const rowA = normalizeInput(a);
    const rowB = normalizeInput(b);

    for (let i = 0; i < rowA.length; i++) {
        result += rowA[i] !== "x"
            ? rowA[i]
            : rowB[i];

        if (i === 2) {
            result += " ";
        }
    }

    return result;
}
function startSafeSpotPhase() {
    phase = "safeSpot";

    rowInput.style.display = "none";
    submitBtn.style.display = "none";
    feedback.textContent = "Click a spot to stand on";

    renderClickableSafeRow(topArena, "top");
    renderClickableSafeRow(bottomArena, "bottom");
}

function renderClickableSafeRow(arenaElement, type) {
    arenaElement.innerHTML = "";

    const groups = type === "top"
        ? [[0, 1], [2], [3], [4, 5]]
        : [[0], [1, 2], [3, 4], [5]];

    for (const group of groups) {
        const platform = document.createElement("div");
        platform.classList.add("platform");

        for (const index of group) {
            const symbol = document.createElement("button");
            symbol.classList.add("symbol", "safe-choice");
            symbol.textContent = "x";

            symbol.addEventListener("click", () => {
                checkSafeSpot(type, index, symbol);
            });

            platform.appendChild(symbol);
        }

        arenaElement.appendChild(platform);
    }
}

function checkSafeSpot(type, index, clickedButton) {
    if (roundFinished) return;

    const safe = type === "top"
        ? board.getSafeTop()[index]
        : board.getSafeBot()[index];

    roundFinished = true;

    if (safe) {
        clickedButton.classList.add("safe-choice-correct");
    } else {
        clickedButton.classList.add("safe-choice-wrong");
    }

    feedback.textContent = safe ? "SAFE - SAFE SPOT" : "DEAD - UNSAFE SPOT";
    renderFullAnswerBoard(type, index, safe);

    addChatMessage(
        `${type === "top" ? "Top" : "Bottom"} spot ${index + 1}: ${
            safe ? "SAFE" : "DEAD"
        }`
    );

    addChatSpacer();

    if (!safe) {
        showCorrections();
    }

    clearInterval(roundTimer);
    roundTimer = null;
    disableSafeSpotSelection();
}

function disableSafeSpotSelection() {
    document.querySelectorAll(".safe-choice").forEach(button => {
        button.disabled = true;
        button.style.cursor = "not-allowed";
        button.style.opacity = "0.25";
    });
}

function addChatSpacer() {
    const spacer = document.createElement("div");
    spacer.classList.add("chat-spacer");
    chatMessages.appendChild(spacer);
}

function renderFullAnswerBoard(selectedType, selectedIndex, safe) {
    renderAnswerRow(topArena, board.getTopRow(), "top", selectedType, selectedIndex, safe);
    renderAnswerRow(bottomArena, board.getBottomRow(), "bottom", selectedType, selectedIndex, safe);
}

function renderAnswerRow(arenaElement, row, type, selectedType, selectedIndex, safe) {
    arenaElement.innerHTML = "";

    const groups = type === "top"
        ? [[0, 1], [2], [3], [4, 5]]
        : [[0], [1, 2], [3, 4], [5]];

    for (const group of groups) {
        const platform = document.createElement("div");
        platform.classList.add("platform");

        if (group.length === 2) {
            platform.classList.add("double");
        }

        for (const index of group) {
            const symbol = document.createElement("div");
            symbol.classList.add("symbol");

            if (type === selectedType && index === selectedIndex) {
                symbol.classList.add(safe ? "safe-choice-correct" : "safe-choice-wrong");
            }

            const img = document.createElement("img");
            img.src = romanImages[row[index]];
            img.classList.add("roman-image");
            symbol.appendChild(img);

            platform.appendChild(symbol);
        }

        arenaElement.appendChild(platform);
    }
}

function startRoundTimer() {
    clearInterval(roundTimer);

    timeLeft = 40;
    timerText.textContent = `Time Left: ${timeLeft}s`;

    roundTimer = setInterval(() => {
        timeLeft--;
        timerText.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(roundTimer);
            roundTimer = null;
            handleRoundTimeout();
        }
    }, 1000);
}

function showCorrections() {
    addChatMessage("");
    addChatMessage("CORRECTIONS:");

    addChatMessage(`Top: ${topWriter.getWriter1()}`);
    addChatMessage(`Bottom: ${botWriter.getWriter1()}`);
    addChatSpacer();

    const correctedCombined =
        `${combineRow(topWriter.getWriter1(), topWriter.getWriter2())} // ` +
        `${combineRow(botWriter.getWriter1(), botWriter.getWriter2())}`;

    addChatMessage("");
    addChatMessage(`Combined: ${correctedCombined}`);
    addChatMessage(`Number to ${eyesOpen ? "stand on" : "avoid"}: ${targetNumber}`);
}

function handleRoundTimeout() {
    if (roundFinished) return;

    roundFinished = true;

    feedback.textContent = "DEAD - YOU RAN OUT OF TIME";
    timerText.textContent = "TIME'S UP";

    rowInput.style.display = "none";
    submitBtn.style.display = "none";

    addChatMessage("You ran out of time: DEAD");
    addChatSpacer();

    renderFullAnswerBoard(null, null, false);

    showCorrections();
    disableSafeSpotSelection();
}