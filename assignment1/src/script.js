// -----------------------------
// 1) Decks (two 6-event timelines)
// -----------------------------
const timelines = [
  {
    id: "ussr",
    title: "Deck 1: The Collapse of the Soviet Union (6 events)",
    events: [
      {
        id: "u1",
        text: "1985: Mikhail Gorbachev becomes leader and launches reforms (perestroika/glasnost).",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/RIAN_archive_359290_Mikhail_Gorbachev_%281%29.jpg"
      },
      {
        id: "u2",
        text: "1989: Revolutions in Eastern Europe weaken Soviet influence across the region.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/BerlinWall-BrandenburgGate.jpg"
      },
      {
        id: "u3",
        text: "1990–1991: Several Soviet republics push for sovereignty/independence (centrifugal forces rise).",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/1989_08_23_Baltijoskelias14.jpg"
      },
      {
        id: "u4",
        text: "Aug 1991: The hardliner coup attempt fails, damaging the Communist Party’s authority.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/T-72_tank_in_Moscow,_August_1991.jpg"
      },
      {
        id: "u5",
        text: "Dec 1991: The Belavezha Accords create the CIS and declare the USSR no longer exists.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/1991_Ukrainian_independence_referendum_results.png"
      },
      {
        id: "u6",
        text: "Late Dec 1991: The USSR is formally dissolved; Gorbachev resigns.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/RIAN_archive_848095_Signing_the_Agreement_to_eliminate_the_USSR_and_establish_the_Commonwealth_of_Independent_States.jpg"
      }
    ],
    correctOrder: ["u1", "u2", "u3", "u4", "u5", "u6"]
  },
  {
    id: "ww1",
    title: "Deck 2: WWI — From Spark to Full War (6 events)",
    events: [
      {
        id: "w1",
        text: "June 28, 1914: Archduke Franz Ferdinand is assassinated in Sarajevo.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Archduke_Franz_Ferdinand_in_Sarajevo,_June_1914_Q91848.jpg"
      },
      {
        id: "w2",
        text: "Austria-Hungary sends Serbia an ultimatum with harsh demands.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ultimatum_k.u.k_serbien.png"
      },
      {
        id: "w3",
        text: "Austria-Hungary declares war on Serbia (local conflict begins).",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/TelegramWW1.jpg"
      },
      {
        id: "w4",
        text: "Russia mobilizes to support Serbia (crisis escalates).",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Russian_infantry_1914_railroad.jpg"
      },
      {
        id: "w5",
        text: "Germany declares war on Russia and France (alliance system activates).",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Mobilization_order_is_read_out_in_Berlin,_1_August_1914.jpg"
      },
      {
        id: "w6",
        text: "Germany invades Belgium; Britain enters the war, turning it into a wider conflict.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/German_advance_through_Belgium,_August_1914.jpg"
      }
    ],
    correctOrder: ["w1", "w2", "w3", "w4", "w5", "w6"]
  }
];


// -----------------------------
// timelines: keep your existing const timelines = [...]
// Each event should have: { id, text, imageUrl }
// -----------------------------

let current = null;
let checked = false;

const deckSelect = document.getElementById("deck");
const deckTitle = document.getElementById("deckTitle");
const apiKeyInput = document.getElementById("apiKey");

const startBtn = document.getElementById("start");
const submitBtn = document.getElementById("submit");
const aiBtn = document.getElementById("aiReview");
const revealBtn = document.getElementById("reveal");

const timelineEl = document.getElementById("timeline");
const bankEl = document.getElementById("bank");

const placedCountEl = document.getElementById("placedCount");
const scoreBadgeEl = document.getElementById("scoreBadge");
const logEl = document.getElementById("log");

let draggedEl = null;
let draggedFrom = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

function addLog(type, title, body) {
  const item = document.createElement("div");
  item.className = `log-item ${type}`;
  item.innerHTML = `
    <div class="title">${escapeHtml(title)}</div>
    <div class="body">${escapeHtml(body).replaceAll("\n","<br>")}</div>
  `;
  logEl.appendChild(item);
  logEl.scrollTop = logEl.scrollHeight;
}

function clearLog() {
  logEl.innerHTML = "";
}

function initDecks() {
  deckSelect.innerHTML = "";
  timelines.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.title;
    deckSelect.appendChild(opt);
  });
}
initDecks();

function createCard(ev) {
  const card = document.createElement("div");
  card.className = "event-card";
  card.draggable = true;
  card.dataset.id = ev.id;

  card.innerHTML = `
    <img class="event-thumb" src="${ev.imageUrl}" alt="event" loading="lazy">
    <div class="event-body">
      <div class="event-text">${escapeHtml(ev.text)}</div>
      <div class="small">Tip: click image to open</div>
    </div>
  `;

  // Click image to open full
  card.querySelector("img").addEventListener("click", (e) => {
    e.stopPropagation();
    window.open(ev.imageUrl, "_blank");
  });

  // Drag handlers
  card.addEventListener("dragstart", () => {
    draggedEl = card;
    draggedFrom = card.parentElement;
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    draggedEl = null;
    draggedFrom = null;
    document.querySelectorAll(".slot").forEach(s => s.classList.remove("over"));
  });

  return card;
}

function renderTimelineSlots(n) {
  timelineEl.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = String(i);

    slot.innerHTML = `<div class="slot-index">#${i + 1}</div>`;

    // Allow drop
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
      slot.classList.add("over");
    });
    slot.addEventListener("dragleave", () => slot.classList.remove("over"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      slot.classList.remove("over");
      if (!draggedEl) return;

      // If slot already has a card, swap it back to where dragged card came from
      const existingCard = slot.querySelector(".event-card");
      if (existingCard && draggedFrom) {
        draggedFrom.appendChild(existingCard);
      }

      slot.appendChild(draggedEl);
      updatePlacedCount();

      // If already checked, update colors live
      if (checked) applySlotFeedback();
    });

    timelineEl.appendChild(slot);
  }

  // Make bank droppable too (drag back to bank)
  bankEl.addEventListener("dragover", (e) => e.preventDefault());
  bankEl.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!draggedEl) return;
    bankEl.appendChild(draggedEl);
    updatePlacedCount();
    if (checked) applySlotFeedback();
  });
}

function renderBank(events) {
  bankEl.innerHTML = "";
  events.forEach(ev => bankEl.appendChild(createCard(ev)));
}

function updatePlacedCount() {
  const slots = [...timelineEl.querySelectorAll(".slot")];
  const placed = slots.filter(s => s.querySelector(".event-card")).length;
  placedCountEl.textContent = `${placed}/6 placed`;
}

function getStudentOrder() {
  // slot order: array of event ids or null
  const slots = [...timelineEl.querySelectorAll(".slot")];
  return slots.map(s => {
    const card = s.querySelector(".event-card");
    return card ? card.dataset.id : null;
  });
}

function applySlotFeedback() {
  const order = getStudentOrder();
  const correct = current.correctOrder;

  const slots = [...timelineEl.querySelectorAll(".slot")];
  slots.forEach((slot, i) => {
    slot.classList.remove("correct", "wrong");
    const id = order[i];
    if (!id) return; // empty slot stays neutral
    if (id === correct[i]) slot.classList.add("correct");
    else slot.classList.add("wrong");
  });
}

function scoreOrder(order) {
  let correctCount = 0;
  for (let i = 0; i < current.correctOrder.length; i++) {
    if (order[i] && order[i] === current.correctOrder[i]) correctCount++;
  }
  return correctCount;
}

function idsToText(ids) {
  const map = new Map(current.events.map(e => [e.id, e.text]));
  return ids.map((id, idx) => {
    if (!id) return `${idx + 1}. (empty)`;
    return `${idx + 1}. ${map.get(id)}`;
  }).join("\n");
}

// -----------------------------
// Start round
// -----------------------------
startBtn.onclick = () => {
  const deckId = deckSelect.value;
  current = timelines.find(t => t.id === deckId);

  deckTitle.textContent = current.title;
  clearLog();

  checked = false;
  scoreBadgeEl.textContent = "Score: —";

  renderTimelineSlots(6);
  renderBank(shuffle(current.events));
  updatePlacedCount();

  submitBtn.disabled = false;
  aiBtn.disabled = true;
  revealBtn.disabled = true;

  addLog("note", "Round started", "Drag cards into the 6 slots, then click “Check Timeline”.");
};

// -----------------------------
// Check / Submit
// -----------------------------
submitBtn.onclick = () => {
  if (!current) return;

  const order = getStudentOrder();
  const score = scoreOrder(order);

  checked = true;
  applySlotFeedback();

  scoreBadgeEl.textContent = `Score: ${score}/6`;

  addLog(
    score === 6 ? "good" : "note",
    "Your timeline",
    idsToText(order) + `\n\nScore: ${score}/6 correct slots`
  );

  if (score === 6) {
    addLog("good", "Nice!", "Perfect repair — all 6 events are in the correct slots.");
  } else {
    addLog("note", "Tip", "Lock in the key turning points first, then connect the chain around them.");
  }

  aiBtn.disabled = false;
  revealBtn.disabled = false;
};

// -----------------------------
// Reveal correct order (log only)
// -----------------------------
revealBtn.onclick = () => {
  if (!current) return;
  addLog("note", "Correct order", idsToText(current.correctOrder));
};

// -----------------------------
// Gemini AI feedback
// -----------------------------
aiBtn.onclick = async () => {
  if (!current) return;

  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    addLog("bad", "Missing API key", "Please paste your Gemini API key first.");
    return;
  }

  const studentOrder = getStudentOrder();
  const score = scoreOrder(studentOrder);

  const correctText = idsToText(current.correctOrder);
  const studentText = idsToText(studentOrder);

  const prompt =
    "You are a history teacher.\n" +
    "A student tried to repair a 6-event timeline by placing events into 6 fixed slots.\n\n" +
    "Correct timeline:\n" + correctText + "\n\n" +
    "Student timeline:\n" + studentText + "\n\n" +
    `Score: ${score}/6 correct slots.\n\n` +
    "Write feedback in English.\n" +
    "Format:\n" +
    "1) One sentence overall comment (encouraging)\n" +
    "2) Two key turning points (why they matter)\n" +
    "3) 3–5 bullets explaining cause-and-effect (use 'Because..., therefore...')\n" +
    "4) Two practical tips to sort faster next time\n";

  addLog("note", "AI Feedback", "Generating...");

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    apiKey;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4 }
    })
  });

  const data = await response.json();
  const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(no response)";

  addLog("note", "AI Feedback", botText);
};



