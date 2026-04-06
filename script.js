// 1. จำลองฐานข้อมูลคำศัพท์ (คุณสามารถเพิ่มให้ครบ 1,000 คำได้ในรูปแบบนี้)
const vocabularyData = [
  { en: "Abandon", read: "อะ-แบน-เดิน", th: "ละทิ้ง" },
  { en: "Ability", read: "อะ-บิล-ลิ-ตี้", th: "ความสามารถ" },
  { en: "Beautiful", read: "บิว-ทิ-ฟูล", th: "สวย" },
  { en: "Calendar", read: "แคล-เลน-เดอร์", th: "ปฏิทิน" },
  { en: "Dangerous", read: "เดน-เจอ-รัส", th: "อันตราย" },
  { en: "Education", read: "เอ็ด-ดู-เค-ชั่น", th: "การศึกษา" },
  { en: "Freedom", read: "ฟรี-ดอม", th: "อิสรภาพ" },
  { en: "Galaxy", read: "แกล-แลค-ซี่", th: "กาแล็กซี" },
  { en: "Happiness", read: "แฮป-พิ-เนส", th: "ความสุข" },
  { en: "Immediate", read: "อิม-มี-เดียท", th: "ทันทีทันใด" },
  // ... เติมจนครบ 1,000 คำได้ตรงนี้
];

// สร้างคำศัพท์จำลองเพิ่มเติมให้ครบจำนวนมากๆ เพื่อทดสอบ
for (let i = 1; i <= 990; i++) {
  vocabularyData.push({
    en: `Word ${i}`,
    read: `คำอ่าน ${i}`,
    th: `คำแปลที่ ${i}`,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDictionary();
  initSakura();
  updateCount();
});

// --- ระบบพจนานุกรม ---
function initDictionary() {
  const tbody = document.getElementById("vocab-body");
  renderTable(vocabularyData);

  document.getElementById("searchInput").addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = vocabularyData.filter(
      (item) => item.en.toLowerCase().includes(val) || item.th.includes(val),
    );
    renderTable(filtered);
  });
}

function renderTable(data) {
  const tbody = document.getElementById("vocab-body");
  tbody.innerHTML = data
    .map(
      (item) => `
        <tr>
            <td><b>${item.en}</b></td>
            <td style="color: #888;">${item.read}</td>
            <td>${item.th}</td>
            <td>
                <button onclick="speak('${item.en}')">🔊</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  window.speechSynthesis.speak(utter);
}

function updateCount() {
  document.getElementById("word-count").innerHTML =
    `🔢 ทั้งหมด <b>${vocabularyData.length}</b> คำ`;
}

function showSection(type) {
  document.getElementById("dict-section").style.display =
    type === "dict" ? "block" : "none";
  document.getElementById("game-section").style.display =
    type === "game" ? "block" : "none";
}

// --- ระบบเกม ---
let currentQuestion = {};

function startGame() {
  showSection("game");
  nextQuestion();
}

function nextQuestion() {
  const feedback = document.getElementById("game-feedback");
  const nextBtn = document.getElementById("next-btn");
  feedback.innerHTML = "";
  nextBtn.style.display = "none";

  // สุ่มคำถาม
  currentQuestion =
    vocabularyData[Math.floor(Math.random() * vocabularyData.length)];
  document.getElementById("target-word").textContent = currentQuestion.en;

  // สุ่มตัวเลือก
  let options = [currentQuestion.th];
  while (options.length < 4) {
    let randomWord =
      vocabularyData[Math.floor(Math.random() * vocabularyData.length)].th;
    if (!options.includes(randomWord)) options.push(randomWord);
  }
  options.sort(() => Math.random() - 0.5);

  const grid = document.getElementById("options-grid");
  grid.innerHTML = options
    .map(
      (opt) => `
        <button class="option-btn" onclick="checkAnswer(this, '${opt}')">${opt}</button>
    `,
    )
    .join("");
}

function checkAnswer(btn, choice) {
  const allButtons = document.querySelectorAll(".option-btn");
  allButtons.forEach((b) => (b.disabled = true));

  if (choice === currentQuestion.th) {
    btn.classList.add("correct");
    document.getElementById("game-feedback").innerHTML =
      "<h3 style='color:green'>ถูกต้อง! เก่งมากค่ะ 🌸</h3>";
  } else {
    btn.classList.add("wrong");
    document.getElementById("game-feedback").innerHTML =
      `<h3 style='color:red'>ผิดค่ะ! คำตอบที่ถูกคือ: ${currentQuestion.th}</h3>`;
  }
  document.getElementById("next-btn").style.display = "inline-block";
}

// --- ระบบซากุระตกลงมา (Canvas) ---
function initSakura() {
  const canvas = document.getElementById("sakura-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const petals = [];
  for (let i = 0; i < 50; i++) {
    petals.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 7 + 3,
      speed: Math.random() * 2 + 1,
      angle: Math.random() * 360,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffb7c5";
    petals.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y += p.speed;
      p.x += Math.sin(p.y / 50);
      p.angle += 1;
      if (p.y > canvas.height) p.y = -10;
    });
    requestAnimationFrame(draw);
  }
  draw();
}
