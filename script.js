const startBtn = document.getElementById("start-btn");
const questionArea = document.getElementById("question-area");
const choicesDiv = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const instrumentSelect = document.getElementById("instrument-select");
const difficultySelect = document.getElementById("difficulty-select");

let score = 0;
let currentAnswer = "";
let synth;

const progressions = {
  easy: [
    { name: "I - IV - V", chords: ["C4", "F4", "G4"] },
    { name: "I - V - vi", chords: ["C4", "G4", "A4"] },
    { name: "I - vi - IV", chords: ["C4", "A4", "F4"] }
  ],
  medium: [
    { name: "ii - V - I", chords: ["D4", "G4", "C4"] },
    { name: "I - iii - IV", chords: ["C4", "E4", "F4"] },
    { name: "vi - IV - I", chords: ["A4", "F4", "C4"] }
  ]
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createSynth(type) {
  if (type === "guitar") {
    return new Tone.PluckSynth().toDestination();
  }
  if (type === "synth") {
    return new Tone.Synth().toDestination();
  }
  return new Tone.PolySynth().toDestination(); // default: piano-style
}

function playProgression(chords) {
  synth = createSynth(instrumentSelect.value);
  let now = Tone.now();
  chords.forEach((chord, i) => {
    synth.triggerAttackRelease(chord, "1n", now + i);
  });
}

function startGame() {
  Tone.start();
  questionArea.classList.remove("hidden");
  feedback.textContent = "";
  const difficulty = difficultySelect.value;
  const options = shuffle(progressions[difficulty]);
  const progression = options[Math.floor(Math.random() * options.length)];
  currentAnswer = progression.name;
  playProgression(progression.chords);
  choicesDiv.innerHTML = "";
  options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option.name;
    btn.setAttribute("data-index", index);
    btn.onclick = () => handleAnswer(option.name);
    choicesDiv.appendChild(btn);
  });
}

function handleAnswer(choice) {
  if (choice === currentAnswer) {
    feedback.textContent = "✅ Correct!";
    score++;
  } else {
    feedback.textContent = "❌ Try again!";
  }
  scoreDisplay.textContent = `Score: ${score}`;
}

startBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  if (!questionArea.classList.contains("hidden")) {
    const key = parseInt(e.key);
    if (!isNaN(key)) {
      const btns = choicesDiv.querySelectorAll("button");
      if (btns[key - 1]) btns[key - 1].click();
    }
  }
});
