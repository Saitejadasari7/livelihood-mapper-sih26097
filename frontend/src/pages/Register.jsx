import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const AUTH_LABELS = {
  en: {
    title: "Create Account",
    sub: "Register with your mobile number (no email required) or email address.",
    modePhone: "📱 Mobile Number (No Email)",
    modeEmail: "✉️ Email Address",
    modeBoth: "📱 + ✉️ Both",
    accountType: "Account Type",
    roleUser: "Job Seeker / Learner",
    roleAdmin: "Admin / Employer (Add Professions & Jobs)",
    fullName: "Full Name / Organization Name",
    phName: "e.g., Sai Teja",
    phoneLabel: "Mobile Number (10 digits)",
    phPhone: "e.g., 9876543210",
    emailLabel: "Email Address",
    emailOptional: "Email Address (Optional)",
    phEmail: "you@example.com",
    passwordLabel: "Password (min 8 characters)",
    submitUser: "Create Account",
    submitAdmin: "Register as Admin / Employer",
    creating: "Creating account...",
    haveAccount: "Already have an account?",
    loginLink: "Login",
    errNeedContact: "Please enter a valid 10-digit mobile number or email address.",
  },
  hi: {
    title: "नया खाता बनाएं",
    sub: "अपने मोबाइल नंबर (ईमेल आवश्यक नहीं) या ईमेल से पंजीकरण करें।",
    modePhone: "📱 मोबाइल नंबर (बिना ईमेल)",
    modeEmail: "✉️ ईमेल पता",
    modeBoth: "📱 + ✉️ दोनों",
    accountType: "खाते का प्रकार",
    roleUser: "नौकरी चाहने वाले / शिक्षार्थी",
    roleAdmin: "एडमिन / नियोक्ता (पेशे और नौकरियां जोड़ें)",
    fullName: "पूरा नाम / संस्था का नाम",
    phName: "जैसे: साई तेजा",
    phoneLabel: "मोबाइल नंबर (10 अंक)",
    phPhone: "जैसे: 9876543210",
    emailLabel: "ईमेल पता",
    emailOptional: "ईमेल पता (वैकल्पिक)",
    phEmail: "you@example.com",
    passwordLabel: "पासवर्ड (कम से कम 8 अक्षर)",
    submitUser: "खाता बनाएं",
    submitAdmin: "एडमिन / नियोक्ता के रूप में पंजीकरण करें",
    creating: "खाता बन रहा है...",
    haveAccount: "पहले से खाता है?",
    loginLink: "लॉगिन करें",
    errNeedContact: "कृपया 10 अंकों का मोबाइल नंबर या ईमेल पता दर्ज करें।",
  },
  te: {
    title: "కొత్త ఖాతా సృష్టించండి",
    sub: "మీ మొబైల్ నంబర్ (ఇమెయిల్ అవసరం లేదు) లేదా ఇమెయిల్‌తో నమోదు చేసుకోండి.",
    modePhone: "📱 మొబైల్ నంబర్ (ఇమెయిల్ లేకుండా)",
    modeEmail: "✉️ ఇమెయిల్ చిరునామా",
    modeBoth: "📱 + ✉️ రెండూ",
    accountType: "ఖాతా రకం",
    roleUser: "ఉద్యోగార్థి / అభ్యాసకుడు",
    roleAdmin: "అడ్మిన్ / యజమాని (వృత్తులు & ఉద్యోగాలు జోడించండి)",
    fullName: "పూర్తి పేరు / సంస్థ పేరు",
    phName: "ఉదా: సాయి తేజ",
    phoneLabel: "మొబైల్ నంబర్ (10 అంకెలు)",
    phPhone: "ఉదా: 9876543210",
    emailLabel: "ఇమెయిల్ చిరునామా",
    emailOptional: "ఇమెయిల్ చిరునామా (ఐచ్ఛికం)",
    phEmail: "you@example.com",
    passwordLabel: "పాస్‌వర్డ్ (కనీసం 8 అక్షరాలు)",
    submitUser: "ఖాతా సృష్టించండి",
    submitAdmin: "అడ్మిన్ / యజమానిగా నమోదు చేయండి",
    creating: "ఖాతా సృష్టించబడుతోంది...",
    haveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    loginLink: "లాగిన్",
    errNeedContact: "దయచేసి 10 అంకెల మొబైల్ నంబర్ లేదా ఇమెయిల్ నమోదు చేయండి.",
  },
  ta: {
    title: "புதிய கணக்கை உருவாக்கவும்",
    sub: "உங்கள் மொபைல் எண் (மின்னஞ்சல் தேவையில்லை) அல்லது மின்னஞ்சல் மூலம் பதிவு செய்யவும்.",
    modePhone: "📱 மொபைல் எண் (மின்னஞ்சல் இல்லாமல்)",
    modeEmail: "✉️ மின்னஞ்சல் முகவரி",
    modeBoth: "📱 + ✉️ இரண்டும்",
    accountType: "கணக்கு வகை",
    roleUser: "வேலை தேடுபவர் / கற்பவர்",
    roleAdmin: "நிர்வாகி / முதலாளி (தொழில்கள் & வேலைகளைச் சேர்க்கவும்)",
    fullName: "முழுப் பெயர் / நிறுவனத்தின் பெயர்",
    phName: "எ.கா: சாய் தேஜா",
    phoneLabel: "மொபைல் எண் (10 இலக்கங்கள்)",
    phPhone: "எ.கா: 9876543210",
    emailLabel: "மின்னஞ்சல் முகவரி",
    emailOptional: "மின்னஞ்சல் முகவரி (விருப்பத்திற்குரியது)",
    phEmail: "you@example.com",
    passwordLabel: "கடவுச்சொல் (குறைந்தது 8 எழுத்துக்கள்)",
    submitUser: "கணக்கை உருவாக்கு",
    submitAdmin: "நிர்வாகி / முதலாளியாகப் பதிவு செய்",
    creating: "கணக்கு உருவாக்கப்படுகிறது...",
    haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    loginLink: "உள்நுழைக",
    errNeedContact: "10 இலக்க மொபைல் எண் அல்லது மின்னஞ்சல் முகவரியை உள்ளிடவும்.",
  },
  ml: {
    title: "പുതിയ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    sub: "മൊബൈൽ നമ്പർ (ഇമെയിൽ ആവശ്യമില്ല) അല്ലെങ്കിൽ ഇമെയിൽ ഉപയോഗിച്ച് രജിസ്റ്റർ ചെയ്യുക.",
    modePhone: "📱 മൊബൈൽ നമ്പർ (ഇമെയിൽ ഇല്ലാതെ)",
    modeEmail: "✉️ ഇമെയിൽ വിലാസം",
    modeBoth: "📱 + ✉️ രണ്ടും",
    accountType: "അക്കൗണ്ട് തരം",
    roleUser: "തൊഴിലന്വേഷകൻ / പഠിതാവ്",
    roleAdmin: "അഡ്മിൻ / തൊഴിലുടമ (തൊഴിലുകളും ജോലികളും ചേർക്കുക)",
    fullName: "മുഴുവൻ പേര് / സ്ഥാപനത്തിന്റെ പേര്",
    phName: "ഉദാ: സായ് തേജ",
    phoneLabel: "മൊബൈൽ നമ്പർ (10 അക്കങ്ങൾ)",
    phPhone: "ഉദാ: 9876543210",
    emailLabel: "ഇമെയിൽ വിലാസം",
    emailOptional: "ഇമെയിൽ വിലാസം (ഓപ്ഷണൽ)",
    phEmail: "you@example.com",
    passwordLabel: "പാസ്‌വേഡ് (കുറഞ്ഞത് 8 അക്ഷരങ്ങൾ)",
    submitUser: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    submitAdmin: "അഡ്മിൻ / തൊഴിലുടമയായി രജിസ്റ്റർ ചെയ്യുക",
    creating: "അക്കൗണ്ട് സൃഷ്ടിക്കുന്നു...",
    haveAccount: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",
    loginLink: "ലോഗിൻ",
    errNeedContact: "ദയവായി 10 അക്ക മൊബൈൽ നമ്പറോ ഇമെയിലോ നൽകുക.",
  },
  kn: {
    title: "ಹೊಸ ಖಾತೆ ರಚಿಸಿ",
    sub: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಇಮೇಲ್ ಅಗತ್ಯವಿಲ್ಲ) ಅಥವಾ ಇಮೇಲ್ ಮೂಲಕ ನೋಂದಾಯಿಸಿ.",
    modePhone: "📱 ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಇಮೇಲ್ ಇಲ್ಲದೆ)",
    modeEmail: "✉️ ಇಮೇಲ್ ವಿಳಾಸ",
    modeBoth: "📱 + ✉️ ಎರಡೂ",
    accountType: "ಖಾತೆಯ ವಿಧ",
    roleUser: "ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿ / ಕಲಿಯುವವರು",
    roleAdmin: "ಅಡ್ಮಿನ್ / ಉದ್ಯೋಗದಾತ (ವೃತ್ತಿ ಮತ್ತು ಉದ್ಯೋಗಗಳನ್ನು ಸೇರಿಸಿ)",
    fullName: "ಪೂರ್ಣ ಹೆಸರು / ಸಂಸ್ಥೆಯ ಹೆಸರು",
    phName: "ಉದಾ: ಸಾಯಿ ತೇಜ",
    phoneLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (10 ಅಂಕೆಗಳು)",
    phPhone: "ಉದಾ: 9876543210",
    emailLabel: "ಇಮೇಲ್ ವಿಳಾಸ",
    emailOptional: "ಇಮೇಲ್ ವಿಳಾಸ (ಐಚ್ಛಿಕ)",
    phEmail: "you@example.com",
    passwordLabel: "ಪಾಸ್‌ವರ್ಡ್ (ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು)",
    submitUser: "ಖಾತೆ ರಚಿಸಿ",
    submitAdmin: "ಅಡ್ಮಿನ್ / ಉದ್ಯೋಗದಾತರಾಗಿ ನೋಂದಾಯಿಸಿ",
    creating: "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    haveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
    loginLink: "ಲಾಗಿನ್",
    errNeedContact: "ದಯವಿಟ್ಟು 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಇಮೇಲ್ ನಮೂದಿಸಿ.",
  },
};

export default function Register() {
  const { lang } = useLanguage();
  const lbl = AUTH_LABELS[lang] || AUTH_LABELS.en;

  const [contactMode, setContactMode] = useState("phone"); // "phone" | "email" | "both"
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanPhone = contactMode !== "email" ? phone.trim() : "";
    const cleanEmail = contactMode !== "phone" ? email.trim() : "";

    if (!cleanPhone && !cleanEmail) {
      setError(lbl.errNeedContact);
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        full_name: fullName,
        phone: cleanPhone || null,
        email: cleanEmail || null,
        password,
        role,
      });
      const loginRes = await api.post("/auth/login", {
        identifier: cleanPhone || cleanEmail,
        password,
      });
      localStorage.setItem("token", loginRes.data.access_token);
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Registration failed.");
      } else {
        setError(detail || "Registration failed. Check details and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page container" style={{ maxWidth: 500 }}>
      <form className="card" onSubmit={handleSubmit}>
        <h1>{lbl.title}</h1>
        <p className="small" style={{ marginBottom: 14 }}>{lbl.sub}</p>

        {/* Contact Mode Toggle: Phone Only (No Email) vs Email vs Both */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setContactMode("phone")}
            className={contactMode === "phone" ? "btn btn-primary" : "btn btn-outline"}
            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
          >
            {lbl.modePhone}
          </button>
          <button
            type="button"
            onClick={() => setContactMode("email")}
            className={contactMode === "email" ? "btn btn-primary" : "btn btn-outline"}
            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
          >
            {lbl.modeEmail}
          </button>
          <button
            type="button"
            onClick={() => setContactMode("both")}
            className={contactMode === "both" ? "btn btn-primary" : "btn btn-outline"}
            style={{ padding: "6px 12px", fontSize: "0.85rem" }}
          >
            {lbl.modeBoth}
          </button>
        </div>

        {error && (
          <div className="card" style={{ background: "#fef2f2", color: "#991b1b", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div className="field">
          <label>{lbl.accountType}</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">{lbl.roleUser}</option>
            <option value="admin">{lbl.roleAdmin}</option>
          </select>
        </div>

        <div className="field">
          <label>{lbl.fullName}</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={lbl.phName}
          />
        </div>

        {contactMode !== "email" && (
          <div className="field">
            <label>{lbl.phoneLabel}</label>
            <input
              type="tel"
              required={contactMode === "phone"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={lbl.phPhone}
            />
          </div>
        )}

        {contactMode !== "phone" && (
          <div className="field">
            <label>{contactMode === "both" ? lbl.emailOptional : lbl.emailLabel}</label>
            <input
              type="email"
              required={contactMode === "email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lbl.phEmail}
            />
          </div>
        )}

        <div className="field">
          <label>{lbl.passwordLabel}</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? lbl.creating : role === "admin" ? lbl.submitAdmin : lbl.submitUser}
        </button>

        <p className="small center" style={{ marginTop: 14 }}>
          {lbl.haveAccount} <Link to="/login">{lbl.loginLink}</Link>
        </p>
      </form>
    </div>
  );
}