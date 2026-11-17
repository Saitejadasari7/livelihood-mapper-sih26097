import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { LANGUAGES, QUESTIONS, extractAnswer } from "../utils/voiceParser.js";

export default function VoiceAssistant() {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("en-IN");
  const [messages, setMessages] = useState([{ sender: "bot", text: QUESTIONS[0].prompt }]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [answers, setAnswers] = useState({});
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
  }

  useEffect(() => {
    speak(QUESTIONS[0].prompt);
  }, []);

  function startListening() {
    if (!SpeechRecognition) {
      setStatusMsg("Voice recognition is not supported in this browser. Please use Chrome/Edge or type below.");
      return;
    }
    setStatusMsg("");
    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      setListening(false);
      setStatusMsg(`Microphone issue (${e.error}). You can type your answer below instead.`);
    };
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      processUserInput(transcript);
    };

    recognitionRef.current = rec;
    rec.start();
  }

  function processUserInput(rawText) {
    const clean = rawText.trim();
    if (!clean) return;

    const currentQ = QUESTIONS[step];
    const parsed = extractAnswer(currentQ.key, clean);

    const updatedAnswers = { ...answers };
    let updatedSkills = [...matchedSkills];

    if (currentQ.key === "skills") {
      updatedSkills = parsed;
      setMatchedSkills(parsed);
    } else if (currentQ.key === "location") {
      updatedAnswers.district = parsed.district;
      updatedAnswers.state = parsed.state;
      updatedAnswers.area_type = parsed.area_type;
    } else {
      updatedAnswers[currentQ.key] = parsed;
    }
    setAnswers(updatedAnswers);

    const nextMessages = [...messages, { sender: "user", text: clean }];
    const nextStep = step + 1;

    if (nextStep < QUESTIONS.length) {
      const nextPrompt = QUESTIONS[nextStep].prompt;
      nextMessages.push({ sender: "bot", text: nextPrompt });
      setMessages(nextMessages);
      setStep(nextStep);
      speak(nextPrompt);
    } else {
      const doneText = "Thank you! I have captured your profile and skills. Review below and click Save to Dashboard.";
      nextMessages.push({ sender: "bot", text: doneText });
      setMessages(nextMessages);
      setStep(nextStep);
      speak(doneText);
    }
    setInput("");
  }

  async function saveToProfile() {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    setSaving(true);
    try {
      await api.put("/profile", {
        age_range: "18-25",
        ...answers,
      });
      if (matchedSkills.length) {
        await api.put("/profile/skills", { skills: matchedSkills });
      }
      navigate("/dashboard");
    } catch {
      setStatusMsg("Could not save profile. Please make sure you are logged in.");
    } finally {
      setSaving(false);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setMatchedSkills([]);
    setMessages([{ sender: "bot", text: QUESTIONS[0].prompt }]);
    speak(QUESTIONS[0].prompt);
  }

  return (
    <div className="page container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <h1>Voice & Text Assistant</h1>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border)" }}
        >
          {Object.values(LANGUAGES).map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      {!SpeechRecognition && (
        <div className="notice" style={{ marginBottom: 16 }}>
          Browser speech-to-text works best in Google Chrome or Microsoft Edge. Text input works in all browsers.
        </div>
      )}
      {statusMsg && <div className="alert-err">{statusMsg}</div>}

      <div className="chat-box">
        {messages.map((m, idx) => (
          <div key={idx} className={`msg ${m.sender === "bot" ? "msg-bot" : "msg-user"}`}>
            {m.text}
          </div>
        ))}
      </div>

      {step < QUESTIONS.length ? (
        <form
          className="voice-controls"
          onSubmit={(e) => {
            e.preventDefault();
            processUserInput(input);
          }}
        >
          <button
            type="button"
            className={`btn btn-mic ${listening ? "listening" : ""}`}
            onClick={startListening}
          >
            {listening ? "Listening..." : "Speak Answer"}
          </button>
          <input
            type="text"
            placeholder="Or type your answer here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
      ) : (
        <div className="card">
          <h3>Extracted Profile Summary</h3>
          <p><strong>Education:</strong> {answers.education_level}</p>
          <p><strong>Skills:</strong> {matchedSkills.join(", ")}</p>
          <p><strong>Sector:</strong> {answers.interest_sector}</p>
          <p><strong>Experience:</strong> {answers.experience_level}</p>
          <p><strong>Preference:</strong> {answers.career_preference}</p>
          <p><strong>Location:</strong> {answers.district}, {answers.state} ({answers.area_type})</p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button onClick={saveToProfile} className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save to Profile & View Dashboard"}
            </button>
            <button onClick={restart} className="btn btn-outline">Start Over</button>
          </div>
        </div>
      )}
    </div>
  );
}