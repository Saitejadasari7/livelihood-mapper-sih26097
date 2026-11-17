# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


# Livelihood Mapper — AI-Driven Voice Assistant for NSQF Skilling (SIH26097)

A full-stack web application that helps youth and job seekers discover matching livelihood pathways, identify skill gaps, and explore verified NSQF-aligned training programs through a browser-based voice and text assistant.

## Architecture & Tech Stack
- **Frontend:** React 19 (Vite), React Router, Axios, Plain CSS, Browser Web Speech API (`SpeechRecognition` + `speechSynthesis`)
- **Backend:** Python, FastAPI, SQLAlchemy ORM, SQLite, JWT + `bcrypt` authentication
- **Recommendation Engine:** Transparent hybrid scorer combining skill overlap (45 pts), sector match (25 pts), education eligibility (15 pts), and `scikit-learn` TF-IDF + cosine similarity (15 pts)
- **Data Integrity:** NSQF qualifications and training programs are loaded from `/data/*.csv` with verification flags, NQR qualification codes, and source URLs.

## Local Setup

### 1. Backend (FastAPI + SQLite)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.init_db
uvicorn app.main:app --reload