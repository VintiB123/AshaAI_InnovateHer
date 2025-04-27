

# 🤖 ASHA AI - Context-Aware Chatbot for JobsForHer Foundation

![Asha AI Logo](Screenshot%202025-04-27%20184411.png)

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-0066FF?logo=qdrant&logoColor=white)
![GROQ](https://img.shields.io/badge/GROQ-FF0080?logo=openai&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)

Asha AI is a context-aware, ethical chatbot designed to assist users by providing personalized information about jobs, events, mentorship programs, and global women empowerment initiatives.  
Built with **Next.js**, **FastAPI**, **Qdrant**, and **GROQ**, Asha AI ensures seamless, secure, and bias-free interactions.

---

[Deployed Link](http://3.109.203.114:3000/en)

## 🚀 Features

- Job Listings, Mentorship Programs, and Community Events support
- Gender bias detection and prevention
- Ethical conversational AI guardrails
- Real-time data fetching and updates
- Secure session and context management
- Web portal and mobile app integration

---

## 🧱 Tech Stack Diagram

Below are the different tech stacks used for AshaAI:

![Asha AI TechStack](Screenshot%202025-04-27%20191634.png)

---
## 📂 Project Structure

```
/asha-ai
  |-- ai-server/    # FastAPI server for AI logic
  |-- client/       # Next.js frontend
  |-- public/       # Static assets
  |-- README.md     # This file
```

---

## ⚙️ Environment Variables Setup

You need two `.env` files — one for **client** and one for **ai-server**.

### Frontend (`/client/.env.local`)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_AI_SERVER_URL=http://127.0.0.1:8000
```

### AI Server (`/ai-server/.env`)

```bash
GROQ_API_TOKEN=your_groq_api_token
GOOGLE_CSE_ID=your_google_custom_search_engine_id
GOOGLE_API_KEY=your_google_api_key
QDRANT_URL=your_qdrant_instance_url
QDRANT_API_KEY=your_qdrant_api_key
```


---

## 🛠 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/VintiB123/AshaAI_InnovateHer.git
cd Asha_AI_InnovateHer
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```
Frontend will run at: `http://localhost:3000/en`

### 3. Setup AI Server

```bash
cd ../ai-server
pip install -r requirements.txt
uvicorn main:app --reload
```
AI server will run at: `http://127.0.0.1:8000`

---

## 🧩 Tech Stack

- **Frontend:** Next.js, TailwindCSS
- **Backend:** FastAPI
- **Database/Vector Search:** Qdrant
- **AI Models:** GROQ, OpenAI APIs
- **Authentication:** Clerk.dev

---

## 🛡️ Security and Ethics

- Gender bias detection via custom NLP models.
- No storage of personal user data.
- Encryption for communication between services.
- Guardrails against unethical or discriminatory queries.
- GDPR & AI ethics compliance.

---

## 📈 Monitoring and Performance

- Real-time monitoring for chatbot responses and query handling.
- Regular updates to knowledge bases (jobs, events, mentorship programs).
- Continuous model re-training for bias mitigation.

---

## 🚀 Future Vision

### 📈 Data Integration
- Implement real-time web scraping from HerKey and partner sites for up-to-date job listings and event data.
- Enable dynamic document processing, allowing users to upload and interact with PDFs, DOCs, and images.

### 🌍 Accessibility
- Expand support for multiple regional Indian languages to reach a broader user base.
- Enhance voice-based interactions with improved speech-to-text and text-to-speech systems.
- Enable voice-based navigation within chatbot conversations for better accessibility.

### 📊 Analytics & Feedback
- Develop a user engagement analytics dashboard to monitor bot performance and user behavior.
- Conduct A/B testing to continuously optimize conversations and user journeys.
- Build a community-driven knowledge base with user-submitted improvements and FAQs.

---

## 🎥 Demo
[Watch the demo on YouTube](https://youtu.be/KjYqR17I7qo)

---

## 🙌 Acknowledgments

- **GROQ** for blazing-fast language models
- **Qdrant** for efficient vector search and retrieval
- **Clerk.dev** for authentication services
- **AWS EC2** for hosting both frontend and backend deployments
- **TailwindCSS** for rapid UI development
- **FastAPI** for building high-performance APIs

---

Made with ❤️ by Team InnovateHer for empowering women in careers.  
- Vinti Bhatia, Jeel Doshi

---


