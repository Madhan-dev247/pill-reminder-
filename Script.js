let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

if (Notification.permission !== "granted") Notification.requestPermission();

function addMedicine() {
  const name = document.getElementById("medicineName").value.trim();
  const dosage = document.getElementById("dosage").value.trim();
  const time = document.getElementById("reminderTime").value;
  if (!name || !time) return alert("Please enter medicine name and time!");

  const med = { name, dosage, time, taken: false };
  medicines.push(med);
  localStorage.setItem("medicines", JSON.stringify(medicines));
  showMedicines();
  document.getElementById("medicineName").value = "";
  document.getElementById("dosage").value = "";
  document.getElementById("reminderTime").value = "";
}

function showMedicines() {
  const list = document.getElementById("pillList");
  list.innerHTML = "";
  medicines.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "pill-item" + (m.taken ? " taken" : "");
    div.innerHTML = `
      <div>
        <strong>${m.name}</strong><br>
        <small>${m.dosage || ""} — ${m.time}</small>
      </div>
      <div>
        <button onclick="markTaken(${i})">✅</button>
        <button onclick="markMissed(${i})">❌</button>
      </div>`;
    list.appendChild(div);
  });
  showHistory();
}

function markTaken(i) {
  medicines[i].taken = true;
  addHistory(medicines[i].name, "Taken");
  localStorage.setItem("medicines", JSON.stringify(medicines));
  showMedicines();
}

function markMissed(i) {
  medicines[i].taken = false;
  addHistory(medicines[i].name, "Missed");
  localStorage.setItem("medicines", JSON.stringify(medicines));
  showMedicines();
}

function addHistory(name, status) {
  const entry = { name, status, time: new Date().toLocaleTimeString() };
  history.push(entry);
  localStorage.setItem("history", JSON.stringify(history));
}

function showHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  history.slice(-10).reverse().forEach(h => {
    const div = document.createElement("div");
    div.className = "history-item";
    div.textContent = `${h.time} — ${h.name} (${h.status})`;
    list.appendChild(div);
  });
}

function notify(title, body) {
  if (Notification.permission === "granted") new Notification(title, { body });
}

function checkReminders() {
  const now = new Date();
  const current = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  medicines.forEach(m => {
    if (m.time === current && !m.taken) {
      document.getElementById("alertSound").play();
      notify("Smart Pill Reminder 💊", `Time to take ${m.name} (${m.dosage || "as prescribed"})`);
      alert(`💊 Time to take ${m.name}!`);
    }
  });
}

setInterval(checkReminders, 60000);
showMedicines();