# AI Email Writer 🚀

An AI-powered Email Reply Generator that works directly inside **Gmail** using a **Chrome Extension**, with a **cloud-hosted backend** and a **web-based frontend**.

This repository acts as a **central hub** for all parts of the project.


## 🔥 Features
- One-click **AI Reply** button inside Gmail compose window
- Professional email replies generated using AI
- Secure backend (API keys are not exposed)
- Web UI for demo and public usage
- Fully deployed (Frontend + Backend + Extension)

## 🧩 System Architecture

Gmail (Chrome Extension)
↓
Spring Boot Backend (Render)
↓
AI Model API

Netlify (Frontend)

## 🌐 Live Links

### 🔹 Frontend (Web UI)
Use this if you don’t want to install the extension.

👉 https://aiemailreplygenerator.netlify.app/

### 🔹 Backend (API Base URL)
Used by both frontend and Chrome extension.

👉 https://ai-email-writer-8hvf.onrender.com

🧩 **Project Repositories**
1️⃣ Chrome Extension
Gmail Chrome Extension that injects an AI Reply button into the Gmail UI.

🔗 Repository: https://github.com/Vishesh-techno/ai-email-writer-chrome-ext

2️⃣ Frontend (Web UI)
Web-based interface to generate AI email replies.

🔗 Repository: https://github.com/Vishesh-techno/ai-email-writer-frontend

3️⃣ Backend (Spring Boot API)
Cloud-hosted backend responsible for generating AI replies.

🔗 Repository: https://github.com/<your-username>/ai-email-writer-backend

🚀 **How to Use**
✅ **Option 1: Chrome Extension (Recommended)**
Open the Chrome Extension repository

Download or clone it

Go to chrome://extensions

Enable Developer Mode

Click Load unpacked

Select the extension folder

Open Gmail → Compose → Click AI Reply

✅ **Option 2: Web UI**
Open the frontend URL

Paste your email content

Click Generate

Copy and use the AI reply anywhere

**🔐 Security**
API keys are stored securely on the backend using environment variables

No sensitive information is exposed in the frontend or extension

**🛠 Tech Stack**
Java 21

Spring Boot

REST APIs

Docker

Chrome Extensions (Manifest v3)

Netlify (Frontend Hosting)

Render (Backend Hosting)

👤 **Author**
Vishesh Soni
Electronics & Communication Engineering Student
Interested in Java, Spring Boot, Cloud & Full Stack Development

📈 **Future Enhancements**
Chrome Web Store release

Multiple reply tones

User authentication

Rate limiting

UI improvements
