function formatTime(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${hours}h ${minutes}m`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const result = await chrome.storage.local.get(["timeData"]);
  const timeData = result.timeData || {};

  let summaryText = "";

  for (let category in timeData) {
    summaryText += `${category}: ${formatTime(timeData[category])}\n`;
  }

  document.getElementById("stats").innerText = summaryText;
});

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const result = await chrome.storage.local.get(["timeData"]);
  const timeData = result.timeData || {};

  let summary = "";

  for (let category in timeData) {
    summary += `${category}: ${formatTime(timeData[category])}\n`;
  }

  const response = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ summary })
  });

  const data = await response.json();

  document.getElementById("aiResult").innerText = data.result;
});