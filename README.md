# 🧠 AI Productivity Chrome Extension

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)
![Manifest](https://img.shields.io/badge/Manifest-v3-orange)

A smart Chrome Extension that tracks website usage time and provides AI-powered productivity insights based on browsing behavior.

Built with:
- Chrome Extension (Manifest v3)
- Vanilla JavaScript
- Chrome Storage API
- Node.js + Express backend
- AI analysis endpoint

---

## 🚀 Features

- ⏱️ Automatic website time tracking
- 📊 Categorized usage summary
- 🤖 AI-powered productivity insights
- 🔒 Prevents multiple request spam
- ⏳ Loading state with disabled button
- 🚫 Double-click protection during API call
- Clean and minimal UI

---

## 🏗️ Project Architecture

```
chrome-extension/
│
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── popup.css
│
backend/
│
├── server.js
└── package.json
```

---

## ⚙️ How It Works

1. The extension tracks active tab usage time.
2. Data is stored in `chrome.storage.local`.
3. When the user clicks **Get AI Insights**:
   - Button gets disabled
   - Loading indicator appears
   - Data is sent to backend (`/analyze`)
4. Backend processes the summary.
5. AI response is returned and displayed.

---

## 🛠️ Installation (Development Mode)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Codewithpabitra/AI-Productivity-Tracker-Chrome-Extension.git
cd AI-Productivity-Tracker-Chrome-Extension
```

---

### 2️⃣ Load Chrome Extension

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select the extension folder

---

### 3️⃣ Setup Backend Server

```bash
cd backend
npm install
npm start
```

Server will run at:

```
http://localhost:5000
```

---

## 📡 API Endpoint

### POST `/analyze`

**Request Body:**

```json
{
  "summary": "Social: 2h 10m\nEducation: 1h 20m"
}
```

**Response:**

```json
{
  "result": "You are spending more time on social media than productive work..."
}
```

---

## 🧠 UX Improvements Implemented

- Button disables during API request
- 🚫 Icon appears while disabled
- Loading spinner animation
- `finally` block ensures safe UI reset
- Prevents duplicate API calls
- Error handling with fallback message

---

## 🧩 Technologies Used

- JavaScript (ES6+)
- Chrome Extension API (Manifest v3)
- Node.js
- Express.js
- Fetch API

---

## 🔒 Error Handling Strategy

- `try/catch` for API failures
- Graceful fallback UI message
- Safe UI state reset using `finally`
- Double-click prevention guard

---

## 🎯 Future Improvements

- 📈 Productivity score meter
- 📊 Weekly report view
- 🧠 Advanced AI pattern detection
- ☁️ Cloud sync support
- 🔐 Authentication system
- 🌙 Dark mode support

---

## 🧑‍💻 Author

Pabitra Maity  
Developer & AI Enthusiast  

---

## 📄 License

MIT License

---

## ⭐ Contributing

Pull requests are welcome.  
For major changes, please open an issue first to discuss what you would like to change.

---

## 💡 Why This Project?

This project demonstrates:

- Chrome Extension architecture
- Asynchronous UI state handling
- API integration
- Real-world UX patterns
- Clean separation of frontend and backend

Perfect for showcasing in:
- GitHub portfolio
- Hackathons
- Internship applications
- Open-source contributions

---

## 📬 Contact

If you found this project useful, consider giving it a ⭐ on GitHub.
