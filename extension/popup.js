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
  const button = document.getElementById("analyzeBtn");
  const loader = document.getElementById("loader");
  const resultBox = document.getElementById("aiResult");

  // Prevent double click
  if (button.disabled) return;

  // Disable button + show loading
  button.disabled = true;
  button.innerText = "Analyzing...";
  button.classList.add("disabled-btn");

  loader.style.display = "block";
  resultBox.innerText = "";

  try {
    const result = await chrome.storage.local.get(["timeData"]);
    const timeData = result.timeData || {};

    let summary = "";

    for (let category in timeData) {
      summary += `${category}: ${formatTime(timeData[category])}\n`;
    }

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ summary }),
    });

    const data = await response.json();

    resultBox.innerText = data.result;
  } catch (error) {
    resultBox.innerText = "Something went wrong. Try again later.";
  } finally {
    // Always reset UI
    loader.style.display = "none";
    button.disabled = false;
    button.innerText = "Get AI Insights";
    button.classList.remove("disabled-btn");
  }
});
