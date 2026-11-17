import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { parseAnswer } from "../utils/voiceParser.js";
import { LANGUAGES, useLanguage } from "../context/LanguageContext.jsx";

export default function VoiceAssistant() {
  const { lang, changeLang, currentLangObj, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState({
    state: "",
    district: "",
    area_type: "Rural",
    education_level: "Intermediate",
    experience_level: "Fresher",
    interest_sector: "Technology",
    career_preference: "Employment",
    skills: [],
  });
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const questions = t.voiceQuestions;

  useEffect(() => {
    setMessages([{ sender: "bot", text: questions[0] }]);
    setStep(0);
  }, [lang]);

  function speakText(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentLangObj.speechCode;
    window.speechSynthesis.speak(utter);
  }

  function startListening() {
    setError("");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Please type your answer below.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLangObj.speechCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      setListening(false);
      setError(`Microphone error (${e.error}). You can type your answer below.`);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleAnswer(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function handleAnswer(rawText) {
    const text = rawText.trim();
    if (!text) return;

    const updatedMessages = [...messages, { sender: "user", text }];
    const parsed = parseAnswer(step, text, profileData);
    setProfileData(parsed);
    setInput("");

    const nextStep = step + 1;
    if (nextStep < questions.length) {
      const nextQ = questions[nextStep];
      updatedMessages.push({ sender: "bot", text: nextQ });
      setMessages(updatedMessages);
      setStep(nextStep);
      speakText(nextQ);
    } else {
      const doneMsg =
        "All 6 questions completed! Click 'Save to Profile & View Dashboard' below to see your NSQF matches.";
      updatedMessages.push({ sender: "bot", text: doneMsg });
      setMessages(updatedMessages);
      setStep(nextStep);
      speakText(doneMsg);
    }
  }

  async function saveAndFinish() {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.put("/profile", {
        state: profileData.state,
        district: profileData.district,
        area_type: profileData.area_type,
        education_level: profileData.education_level,
        experience_level: profileData.experience_level,
        interest_sector: profileData.interest_sector,
        career_preference: profileData.career_preference,
      });
      navigate("/dashboard");
    } catch {
      setError("Could not save profile. Please make sure you are logged in.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1>{t.navVoice}</h1>
          <p className="small">
            Language: <strong>{currentLangObj.native} ({currentLangObj.speechCode})</strong> • Question{" "}
            {Math.min(step + 1, questions.length)} of {questions.length}
          </p>
        </div>

        <select
          aria-label="Voice Language"
          value={lang}
          onChange={(e) => changeLang(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontWeight: 600 }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native} ({l.label})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#991b1b", marginTop: 14 }}>
          {error}
        </div>
      )}

      <div className="card stack" style={{ marginTop: 18, maxHeight: 380, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
              background: m.sender === "user" ? "#2563eb" : "#f1f5f9",
              color: m.sender === "user" ? "#ffffff" : "#0f172a",
              padding: "10px 14px",
              borderRadius: 12,
              maxWidth: "80%",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {step < questions.length ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={startListening}
              disabled={listening}
            >
              {listening ? t.listening : `🎙️ ${t.speakAnswer}`}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => speakText(questions[step])}
            >
              🔊 Replay Question
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnswer(input);
            }}
            style={{ display: "flex", gap: 10, marginTop: 12 }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Or type your answer here..."
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">
              {t.send}
            </button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Extracted Profile Summary</h3>
          <p>
            <strong>Location:</strong> {profileData.district || "—"}, {profileData.state || "—"} ({profileData.area_type})
          </p>
          <p>
            <strong>Education:</strong> {profileData.education_level} • <strong>Experience:</strong> {profileData.experience_level}
          </p>
          <p>
            <strong>Sector & Preference:</strong> {profileData.interest_sector} ({profileData.career_preference})
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn btn-primary" onClick={saveAndFinish} disabled={saving}>
              {saving ? "Saving..." : t.saveProfile}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setStep(0);
                setMessages([{ sender: "bot", text: questions[0] }]);
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}