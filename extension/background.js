let currentTab = null;
let startTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    handleTabChange(tab);
  }
});

async function handleTabChange(tab) {
  const now = Date.now();

  if (currentTab && startTime) {
    const duration = now - startTime;
    await saveTime(currentTab, duration);
  }

  currentTab = tab;
  startTime = now;
}

async function saveTime(tab, duration) {
  if (!tab.url || !tab.url.startsWith("http")) return;

  const domain = new URL(tab.url).hostname;

  const result = await chrome.storage.local.get(["timeData", "classified"]);

  let timeData = result.timeData || {};
  let classified = result.classified || {};

  // If not classified, call backend
  if (!classified[domain]) {
    // Manual fast classification (no AI call)
    if (domain.includes("github.com")) {
      classified[domain] = "Work";
    } else if (domain.includes("chatgpt.com")) {
      classified[domain] = "Study";
    } else if (domain.includes("youtube.com")) {
      classified[domain] = "Entertainment";
    } else {
      // Lock to prevent multiple parallel API calls
      classified[domain] = "Loading";
      await chrome.storage.local.set({ classified });

      const category = await classifySite(tab.title, tab.url);
      classified[domain] = category;
    }
  }

  const category = classified[domain];

  if (!timeData[category]) {
    timeData[category] = 0;
  }

  timeData[category] += duration;

  await chrome.storage.local.set({ timeData, classified });
}

async function classifySite(title, url) {
  try {
    console.log("Calling backend classify for:", url);
    const response = await fetch("http://localhost:5000/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, url }),
    });

    const data = await response.json();
    console.log("Backend returned:", data);
    return data.category || "Other";
  } catch (error) {
    console.error("Fetch error:", error);
    return "Other";
  }
}
