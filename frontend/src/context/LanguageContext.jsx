import { createContext, useContext, useState } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English", speechCode: "en-IN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", speechCode: "hi-IN" },
  { code: "te", label: "Telugu", native: "తెలుగు", speechCode: "te-IN" },
  { code: "ta", label: "Tamil", native: "தமிழ்", speechCode: "ta-IN" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", speechCode: "ml-IN" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", speechCode: "kn-IN" },
];

export const NSQF_MATRIX = [
  {
    levels: "Levels 1–2",
    tier: "Foundational / Entry",
    benchmark: "Class 5–8 / Basic Literacy",
    roles: "Helper, Retail Trainee, Assistant Mason, Basic Farm Hand",
    badgeColor: "#e0f2fe",
    textColor: "#0369a1",
  },
  {
    levels: "Levels 3–4",
    tier: "Semi-Skilled to Skilled",
    benchmark: "Class 9–12 / ITI Certificate",
    roles: "Field Technician, Data Entry Operator, Solar PV Installer, Tailor",
    badgeColor: "#dcfce7",
    textColor: "#15803d",
  },
  {
    levels: "Levels 5–6",
    tier: "Supervisory / Technical",
    benchmark: "Diploma / Undergraduate Year 1–2",
    roles: "Junior Engineer, Lab Technician, Retail Store Supervisor, Paralegal",
    badgeColor: "#fef3c7",
    textColor: "#b45309",
  },
  {
    levels: "Levels 7–8",
    tier: "Managerial / Specialized",
    benchmark: "Bachelor’s / Postgraduate Degree",
    roles: "Project Manager, AI/Data Analyst, Production Lead, Clinical Specialist",
    badgeColor: "#f3e8ff",
    textColor: "#7e22ce",
  },
  {
    levels: "Levels 9–10",
    tier: "Strategic / Research",
    benchmark: "Master’s / Ph.D.",
    roles: "R&D Director, Policy Architect, Principal Engineer",
    badgeColor: "#ffe4e6",
    textColor: "#be123c",
  },
];

const TRANSLATIONS = {
  en: {
    appName: "Livelihood Mapper",
    navHome: "Home",
    navVoice: "Voice Assistant",
    navDashboard: "Dashboard",
    navPathways: "Pathways (NSQF 1–10)",
    navTraining: "NSQF Training",
    navAbout: "About",
    speakAnswer: "Speak Answer",
    listening: "Listening...",
    send: "Send",
    saveProfile: "Save to Profile & View Dashboard",
    matrixTitle: "NSQF Competency Tiers & Livelihood Pathways (Levels 1–10)",
    matrixSubtitle: "Select or filter pathways aligned with your academic benchmark and competency level.",
    allLevels: "All Levels (1–10)",
    voiceQuestions: [
      "Welcome! Which state and district are you from, and do you live in a rural or urban area?",
      "What is your highest education level (e.g., Class 5-8, 10th, 12th, Diploma/ITI, Graduate, or Postgraduate/PhD)?",
      "How much work experience do you have (Fresher, 1-2 years, or 3+ years)?",
      "Which sector interests you most (Technology, Retail, Construction, Green Jobs, Manufacturing, Business, Agriculture, or Healthcare)?",
      "Do you prefer wage employment, self-employment, or an apprenticeship?",
      "What skills do you already have (for example: typing, Python, communication, solar installation, or customer handling)?",
    ],
  },
  hi: {
    appName: "आजीविका मैपर (Livelihood Mapper)",
    navHome: "होम",
    navVoice: "वॉइस असिस्टेंट",
    navDashboard: "डैशबोर्ड",
    navPathways: "करियर मार्ग (NSQF 1–10)",
    navTraining: "NSQF प्रशिक्षण",
    navAbout: "परिचय",
    speakAnswer: "बोलकर उत्तर दें",
    listening: "सुन रहा हूँ...",
    send: "भेजें",
    saveProfile: "प्रोफ़ाइल सहेजें और डैशबोर्ड देखें",
    matrixTitle: "NSQF दक्षता स्तर और आजीविका मार्ग (स्तर 1–10)",
    matrixSubtitle: "अपनी शैक्षणिक योग्यता के अनुसार NSQF स्तर और रोजगार भूमिकाएं देखें।",
    allLevels: "सभी स्तर (1–10)",
    voiceQuestions: [
      "स्वागत है! आप किस राज्य और जिले से हैं, और क्या आप ग्रामीण या शहरी क्षेत्र में रहते हैं?",
      "आपकी उच्चतम शिक्षा क्या है (जैसे कक्षा 5-8, 10वीं, 12वीं, डिप्लोमा/ITI, स्नातक, या स्नातकोत्तर/PhD)?",
      "आपके पास कितना कार्य अनुभव है (फ्रेशर, 1-2 वर्ष, या 3+ वर्ष)?",
      "आपको किस क्षेत्र में सबसे अधिक रुचि है (टेक्नोलॉजी, रिटेल, निर्माण, ग्रीन जॉब्स, मैन्युफैक्चरिंग, कृषि, या स्वास्थ्य)?",
      "क्या आप नौकरी (वेतन रोजगार), स्वरोजगार, या अप्रेंटिसशिप पसंद करते हैं?",
      "आपके पास पहले से कौन से कौशल हैं (जैसे टाइपिंग, कंप्यूटर, संवाद, या ग्राहक सेवा)?",
    ],
  },
  te: {
    appName: "జీవనోపాధి మ్యాపర్ (Livelihood Mapper)",
    navHome: "హోమ్",
    navVoice: "వాయిస్ అసిస్టెంట్",
    navDashboard: "డ్యాష్‌బోర్డ్",
    navPathways: "మార్గాలు (NSQF 1–10)",
    navTraining: "NSQF శిక్షణ",
    navAbout: "గురించి",
    speakAnswer: "మాట్లాడి సమాధానం చెప్పండి",
    listening: "వింటున్నాను...",
    send: "పంపండి",
    saveProfile: "ప్రొఫైల్ సేవ్ చేసి డ్యాష్‌బోర్డ్ చూడండి",
    matrixTitle: "NSQF సామర్థ్య స్థాయిలు & జీవనోపాధి మార్గాలు (స్థాయిలు 1–10)",
    matrixSubtitle: "మీ విద్యార్హతకు సరిపోయే NSQF స్థాయి మరియు ఉద్యోగ అవకాశాలను చూడండి.",
    allLevels: "అన్ని స్థాయిలు (1–10)",
    voiceQuestions: [
      "స్వాగతం! మీరు ఏ రాష్ట్రం మరియు జిల్లా నుండి వచ్చారు, మీరు గ్రామీణ లేదా పట్టణ ప్రాంతంలో నివసిస్తున్నారా?",
      "మీ అత్యధిక విద్యార్హత ఏమిటి (ఉదా: 5-8 తరగతి, 10వ తరగతి, ఇంటర్, డిప్లొమా/ITI, డిగ్రీ, లేదా PG/PhD)?",
      "మీకు ఎంత పని అనుభవం ఉంది (ఫ్రెషర్, 1-2 సంవత్సరాలు, లేదా 3+ సంవత్సరాలు)?",
      "మీకు ఏ రంగంలో ఎక్కువ ఆసక్తి ఉంది (టెక్నాలజీ, రిటైల్, నిర్మాణం, సోలార్/గ్రీన్ జాబ్స్, వ్యవసాయం, లేదా ఆరోగ్యం)?",
      "మీరు ఉద్యోగం, స్వయం ఉపాధి, లేదా అప్రెంటిస్‌షిప్‌లలో దేనిని ఇష్టపడతారు?",
      "మీకు ఇప్పటికే ఉన్న నైపుణ్యాలు ఏమిటి (ఉదాహరణకు: టైపింగ్, కంప్యూటర్, కమ్యూనికేషన్, లేదా కస్టమర్ హ్యాండ్లింగ్)?",
    ],
  },
  ta: {
    appName: "வாழ்வாதார வழிகாட்டி (Livelihood Mapper)",
    navHome: "முகப்பு",
    navVoice: "குரல் உதவியாளர்",
    navDashboard: "டாஷ்போர்டு",
    navPathways: "பாதைகள் (NSQF 1–10)",
    navTraining: "NSQF பயிற்சி",
    navAbout: "பற்றி",
    speakAnswer: "பேசி பதிலளிக்கவும்",
    listening: "கேட்கிறது...",
    send: "அனுப்பு",
    saveProfile: "சுயவிவரத்தை சேமித்து டாஷ்போர்டைப் பார்க்கவும்",
    matrixTitle: "NSQF திறன் நிலைகள் & வாழ்வாதாரப் பாதைகள் (நிலைகள் 1–10)",
    matrixSubtitle: "உங்கள் கல்வித் தகுதிக்கு ஏற்ற NSQF நிலை மற்றும் வேலை வாய்ப்புகளைக் காண்க.",
    allLevels: "அனைத்து நிலைகள் (1–10)",
    voiceQuestions: [
      "நல்வரவு! நீங்கள் எந்த மாநிலம் மற்றும் மாவட்டத்தைச் சேர்ந்தவர், கிராமப்புறமா அல்லது நகர்ப்புறமா?",
      "உங்கள் உயர்ந்த கல்வித் தகுதி என்ன (5-8 வகுப்பு, 10-ம் வகுப்பு, 12-ம் வகுப்பு, டிப்ளமோ/ITI, பட்டதாரி, அல்லது முதுகலை/PhD)?",
      "உங்களுக்கு எவ்வளவு பணி அனுபவம் உள்ளது (புதியவர், 1-2 ஆண்டுகள், அல்லது 3+ ஆண்டுகள்)?",
      "உங்களுக்கு எந்தத் துறையில் அதிக ஆர்வம் உள்ளது (தொழில்நுட்பம், சில்லறை வணிகம், கட்டுமானம், பசுமை வேலைகள், விவசாயம்)?",
      "நீங்கள் ஊதிய வேலைவாய்ப்பு, சுயதொழில் அல்லது பயிற்சி எதை விரும்புகிறீர்கள்?",
      "உங்களிடம் ஏற்கனவே உள்ள திறன்கள் என்ன (உதாரணம்: தட்டச்சு, கணினி, தகவல் தொடர்பு)?",
    ],
  },
  ml: {
    appName: "ലൈവ്ലിഹുഡ് മാപ്പർ (Livelihood Mapper)",
    navHome: "ഹോം",
    navVoice: "വോയ്‌സ് അസിസ്റ്റന്റ്",
    navDashboard: "ഡാഷ്‌ബോർഡ്",
    navPathways: "പാതകൾ (NSQF 1–10)",
    navTraining: "NSQF പരിശീലനം",
    navAbout: "വിവരങ്ങൾ",
    speakAnswer: "സംസാരിച്ച് ഉത്തരം നൽകുക",
    listening: "ശ്രദ്ധിക്കുന്നു...",
    send: "അയക്കുക",
    saveProfile: "പ്രൊഫൈൽ സേവ് ചെയ്ത് ഡാഷ്‌ബോർഡ് കാണുക",
    matrixTitle: "NSQF നൈപുണ്യ തലങ്ങളും തൊഴിൽ പാതകളും (ലെവൽ 1–10)",
    matrixSubtitle: "നിങ്ങളുടെ വിദ്യാഭ്യാസ യോഗ്യതയ്ക്ക് അനുയോജ്യമായ NSQF ലെവലും തൊഴിലുകളും തിരഞ്ഞെടുക്കുക.",
    allLevels: "എല്ലാ ലെവലുകളും (1–10)",
    voiceQuestions: [
      "സ്വാഗതം! നിങ്ങൾ ഏത് സംസ്ഥാനത്തും ജില്ലയിലുമാണ് താമസിക്കുന്നത്, ഗ്രാമപ്രദേശമാണോ നഗരപ്രദേശമാണോ?",
      "നിങ്ങളുടെ ഉയർന്ന വിദ്യാഭ്യാസ യോഗ്യത എന്താണ് (ക്ലാസ് 5-8, 10-ാം ക്ലാസ്, പ്ലസ് ടു, ഡിപ്ലോമ/ITI, ബിരുദം, അല്ലെങ്കിൽ PG/PhD)?",
      "നിങ്ങൾക്ക് എത്ര വർഷത്തെ പ്രവൃത്തിപരിചയമുണ്ട് (ഫ്രഷർ, 1-2 വർഷം, അല്ലെങ്കിൽ 3+ വർഷം)?",
      "ഏത് മേഖലയിലാണ് നിങ്ങൾക്ക് കൂടുതൽ താൽപ്പര്യം (ടെക്നോളജി, റീട്ടെയിൽ, നിർമ്മാണം, ഗ്രീൻ ജോബ്സ്, കൃഷി, ആരോഗ്യം)?",
      "ശമ്പളമുള്ള ജോലി, സ്വയംതൊഴിൽ, അല്ലെങ്കിൽ അപ്രന്റീസ്ഷിപ്പ് എന്നിവയിൽ ഏതാണ് നിങ്ങൾ ഇഷ്ടപ്പെടുന്നത്?",
      "നിങ്ങൾക്ക് നിലവിലുള്ള കഴിവുകൾ എന്തൊക്കെയാണ് (ഉദാഹരണത്തിന്: ടൈപ്പിംഗ്, കമ്പ്യൂട്ടർ, ആശയവിനിമയം)?",
    ],
  },
  kn: {
    appName: "ಜೀವನೋಪಾಯ ಮ್ಯಾಪರ್ (Livelihood Mapper)",
    navHome: "ಮುಖಪುಟ",
    navVoice: "ಧ್ವನಿ ಸಹಾಯಕ",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    navPathways: "ಮಾರ್ಗಗಳು (NSQF 1–10)",
    navTraining: "NSQF ತರಬೇತಿ",
    navAbout: "ಬಗ್ಗೆ",
    speakAnswer: "ಮಾತನಾಡಿ ಉತ್ತರಿಸಿ",
    listening: "ಆಲಿಸುತ್ತಿದೆ...",
    send: "ಕಳುಹಿಸಿ",
    saveProfile: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ನೋಡಿ",
    matrixTitle: "NSQF ಸಾಮರ್ಥ್ಯದ ಹಂತಗಳು ಮತ್ತು ಜೀವನೋಪಾಯ ಮಾರ್ಗಗಳು (ಹಂತ 1–10)",
    matrixSubtitle: "ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಅರ್ಹತೆಗೆ ಅನುಗುಣವಾಗಿ NSQF ಹಂತ ಮತ್ತು ಉದ್ಯೋಗ ಪಾತ್ರಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
    allLevels: "ಎಲ್ಲಾ ಹಂತಗಳು (1–10)",
    voiceQuestions: [
      "ಸ್ವಾಗತ! ನೀವು ಯಾವ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯವರು, ಮತ್ತು ನೀವು ಗ್ರಾಮೀಣ ಅಥವಾ ನಗರ ಪ್ರದೇಶದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಾ?",
      "ನಿಮ್ಮ ಅತ್ಯುನ್ನತ ಶಿಕ್ಷಣ ಯಾವುದು (ತರಗತಿ 5-8, 10ನೇ ತರಗತಿ, ಪಿಯುಸಿ, ಡಿಪ್ಲೊಮಾ/ITI, ಪದವಿ, ಅಥವಾ PG/PhD)?",
      "ನಿಮಗೆ ಎಷ್ಟು ಕೆಲಸದ ಅನುಭವವಿದೆ (ಫ್ರೆಶರ್, 1-2 ವರ್ಷಗಳು, ಅಥವಾ 3+ ವರ್ಷಗಳು)?",
      "ನಿಮಗೆ ಯಾವ ಕ್ಷೇತ್ರದಲ್ಲಿ ಹೆಚ್ಚು ಆಸಕ್ತಿ ಇದೆ (ತಂತ್ರಜ್ಞಾನ, ರಿಟೇಲ್, ನಿರ್ಮಾಣ, ಗ್ರೀನ್ ಜಾಬ್ಸ್, ಕೃಷಿ, ಆರೋಗ್ಯ)?",
      "ನೀವು ಉದ್ಯೋಗ, ಸ್ವಯಂ ಉದ್ಯೋಗ, ಅಥವಾ ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ ಇವುಗಳಲ್ಲಿ ಯಾವುದನ್ನು ಬಯಸುತ್ತೀರಿ?",
      "ನಿಮ್ಮಲ್ಲಿ ಈಗಾಗಲೇ ಇರುವ ಕೌಶಲ್ಯಗಳು ಯಾವುವು (ಉದಾಹರಣೆಗೆ: ಟೈಪಿಂಗ್, ಕಂಪ್ಯೂಟರ್, ಸಂವಹನ)?",
    ],
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("app_lang") || "en");

  function changeLang(code) {
    setLang(code);
    localStorage.setItem("app_lang", code);
  }

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, currentLangObj, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}