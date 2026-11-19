import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const LOGIN_LABELS = {
  en: {
    title: "Login",
    sub: "Sign in using your registered mobile number or email address.",
    identifierLabel: "Mobile Number or Email",
    phIdentifier: "e.g., 9876543210 or you@example.com",
    passwordLabel: "Password",
    submitBtn: "Login",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    registerLink: "Register with Phone or Email",
    errInvalid: "Incorrect mobile number/email or password.",
  },
  hi: {
    title: "लॉगिन करें",
    sub: "अपने पंजीकृत मोबाइल नंबर या ईमेल पते से साइन इन करें।",
    identifierLabel: "मोबाइल नंबर या ईमेल",
    phIdentifier: "जैसे: 9876543210 या you@example.com",
    passwordLabel: "पासवर्ड",
    submitBtn: "लॉगिन करें",
    loggingIn: "लॉगिन हो रहा है...",
    noAccount: "क्या आपका खाता नहीं है?",
    registerLink: "मोबाइल या ईमेल से पंजीकरण करें",
    errInvalid: "गलत मोबाइल नंबर/ईमेल या पासवर्ड।",
  },
  te: {
    title: "లాగిన్",
    sub: "మీ నమోదిత మొబైల్ నంబర్ లేదా ఇమెయిల్ చిరునామాతో సైన్ ఇన్ చేయండి.",
    identifierLabel: "మొబైల్ నంబర్ లేదా ఇమెయిల్",
    phIdentifier: "ఉదా: 9876543210 లేదా you@example.com",
    passwordLabel: "పాస్‌వర్డ్",
    submitBtn: "లాగిన్",
    loggingIn: "లాగిన్ అవుతోంది...",
    noAccount: "ఖాతా లేదా?",
    registerLink: "ఫోన్ లేదా ఇమెయిల్‌తో నమోదు చేయండి",
    errInvalid: "తప్పు మొబైల్ నంబర్/ఇమెయిల్ లేదా పాస్‌వర్డ్.",
  },
  ta: {
    title: "உள்நுழைக",
    sub: "உங்கள் பதிவுசெய்யப்பட்ட மொபைல் எண் அல்லது மின்னஞ்சல் மூலம் உள்நுழையவும்.",
    identifierLabel: "மொபைல் எண் அல்லது மின்னஞ்சல்",
    phIdentifier: "எ.கா: 9876543210 அல்லது you@example.com",
    passwordLabel: "கடவுச்சொல்",
    submitBtn: "உள்நுழைக",
    loggingIn: "உள்நுழைகிறது...",
    noAccount: "கணக்கு இல்லையா?",
    registerLink: "மொபைல் அல்லது மின்னஞ்சல் மூலம் பதிவு செய்யவும்",
    errInvalid: "தவறான மொபைல் எண்/மின்னஞ்சல் அல்லது கடவுச்சொல்.",
  },
  ml: {
    title: "ലോഗിൻ",
    sub: "രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പറോ ഇമെയിലോ ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക.",
    identifierLabel: "മൊബൈൽ നമ്പർ അല്ലെങ്കിൽ ഇമെയിൽ",
    phIdentifier: "ഉദാ: 9876543210 അല്ലെങ്കിൽ you@example.com",
    passwordLabel: "പാസ്‌വേഡ്",
    submitBtn: "ലോഗിൻ",
    loggingIn: "ലോഗിൻ ചെയ്യുന്നു...",
    noAccount: "അക്കൗണ്ട് ഇല്ലേ?",
    registerLink: "ഫോൺ അല്ലെങ്കിൽ ഇമെയിൽ ഉപയോഗിച്ച് രജിസ്റ്റർ ചെയ്യുക",
    errInvalid: "തെറ്റായ മൊബൈൽ നമ്പർ/ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്.",
  },
  kn: {
    title: "ಲಾಗಿನ್",
    sub: "ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಇಮೇಲ್ ವಿಳಾಸದೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    identifierLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಇಮೇಲ್",
    phIdentifier: "ಉದಾ: 9876543210 ಅಥವಾ you@example.com",
    passwordLabel: "ಪಾಸ್‌ವರ್ಡ್",
    submitBtn: "ಲಾಗಿನ್",
    loggingIn: "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...",
    noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    registerLink: "ಫೋನ್ ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ನೋಂದಾಯಿಸಿ",
    errInvalid: "ತಪ್ಪಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ/ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.",
  },
};

export default function Login() {
  const { lang } = useLanguage();
  const lbl = LOGIN_LABELS[lang] || LOGIN_LABELS.en;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { identifier, password });
      localStorage.setItem("token", res.data.access_token);
      const meRes = await api.get("/auth/me");
      navigate(meRes.data?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || lbl.errInvalid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page container" style={{ maxWidth: 460 }}>
      <form className="card" onSubmit={handleSubmit}>
        <h1>{lbl.title}</h1>
        <p className="small" style={{ marginBottom: 16 }}>{lbl.sub}</p>

        {error && (
          <div className="card" style={{ background: "#fef2f2", color: "#991b1b", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div className="field">
          <label>{lbl.identifierLabel}</label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={lbl.phIdentifier}
          />
        </div>

        <div className="field">
          <label>{lbl.passwordLabel}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? lbl.loggingIn : lbl.submitBtn}
        </button>

        <p className="small center" style={{ marginTop: 14 }}>
          {lbl.noAccount} <Link to="/register">{lbl.registerLink}</Link>
        </p>
      </form>
    </div>
  );
}