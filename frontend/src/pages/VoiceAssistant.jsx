import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { parseAnswer } from "../utils/voiceParser.js";
import { LANGUAGES, useLanguage } from "../context/LanguageContext.jsx";

const MULTILINGUAL_UI = {
  en: {
    modeVoice: "🎙️ Voice & Chat Assistant",
    modeForm: "📋 Traditional Form Filling",
    suggestedLabel: "Suggested answers (tap to use):",
    fillInBar: "Insert into typing bar",
    formTitle: "Complete Your Livelihood Profile Form",
    formSub: "Fill or review all fields directly in English, or switch back to Voice Assistant anytime.",
    lblState: "State",
    phState: "e.g., Andhra Pradesh",
    lblDistrict: "District",
    phDistrict: "e.g., Krishna",
    lblArea: "Area Type",
    optRural: "Rural",
    optUrban: "Urban",
    lblEdu: "Highest Education (NSQF Benchmark)",
    optEdu1: "Class 5–8 / Basic Literacy (NSQF 1–2)",
    optEdu2: "Class 9–10 Pass (NSQF 3–4)",
    optEdu3: "Class 11–12 / Intermediate (NSQF 3–4)",
    optEdu4: "Diploma / ITI / UG Year 1–2 (NSQF 5–6)",
    optEdu5: "Bachelor’s Degree (NSQF 7–8)",
    optEdu6: "Master’s / Ph.D. (NSQF 9–10)",
    lblExp: "Work Experience",
    optExp1: "Fresher (0 Years)",
    optExp2: "1–2 Years",
    optExp3: "3+ Years",
    lblSector: "Preferred Sector",
    lblPref: "Career Preference",
    optPref1: "Wage Employment",
    optPref2: "Self-Employment / Entrepreneurship",
    optPref3: "Apprenticeship / Training",
    lblSkills: "Your Current Skills (tap suggestions or type)",
    phSkills: "e.g., Computer fundamentals, Typing, Communication",
    suggestionsByStep: [
      ["Krishna, Andhra Pradesh, Rural", "Hyderabad, Telangana, Urban", "Pune, Maharashtra, Urban", "Guntur, Andhra Pradesh, Rural"],
      ["Class 5–8", "10th Pass", "Intermediate (12th)", "Diploma / ITI", "Graduate", "Postgraduate / Ph.D."],
      ["Fresher", "1–2 Years", "3+ Years"],
      ["Technology", "Retail", "Construction", "Green Jobs", "Manufacturing", "Business", "Agriculture", "Healthcare"],
      ["Wage Employment", "Self-Employment", "Apprenticeship"],
      ["Computer fundamentals, Typing", "Customer handling, Communication", "Python programming, Data analysis", "Electrical basics, Solar panel mounting"],
    ],
  },
  hi: {
    modeVoice: "🎙️ वॉइस और चैट असिस्टेंट",
    modeForm: "📋 पारंपरिक फॉर्म भरें",
    suggestedLabel: "सुझाए गए उत्तर (चुनने के लिए क्लिक करें):",
    fillInBar: "टाइपिंग बार में डालें",
    formTitle: "अपना आजीविका प्रोफ़ाइल फॉर्म भरें",
    formSub: "सभी विवरण सीधे फॉर्म में भरें या कभी भी वॉइस असिस्टेंट पर वापस जाएं।",
    lblState: "राज्य (State)",
    phState: "जैसे: उत्तर प्रदेश / आंध्र प्रदेश",
    lblDistrict: "जिला (District)",
    phDistrict: "जैसे: लखनऊ / कृष्णा",
    lblArea: "क्षेत्र का प्रकार",
    optRural: "ग्रामीण (Rural)",
    optUrban: "शहरी (Urban)",
    lblEdu: "उच्चतम शिक्षा (NSQF स्तर)",
    optEdu1: "कक्षा 5–8 / बुनियादी साक्षरता (NSQF 1–2)",
    optEdu2: "10वीं पास (NSQF 3–4)",
    optEdu3: "12वीं / इंटरमीडिएट (NSQF 3–4)",
    optEdu4: "डिप्लोमा / ITI (NSQF 5–6)",
    optEdu5: "स्नातक / ग्रेजुएट (NSQF 7–8)",
    optEdu6: "स्नातकोत्तर / Ph.D. (NSQF 9–10)",
    lblExp: "कार्य अनुभव",
    optExp1: "फ्रेशर (0 वर्ष)",
    optExp2: "1–2 वर्ष",
    optExp3: "3+ वर्ष",
    lblSector: "पसंदीदा क्षेत्र",
    lblPref: "करियर प्राथमिकता",
    optPref1: "वेतन रोजगार (नौकरी)",
    optPref2: "स्वरोजगार / व्यवसाय",
    optPref3: "अप्रेंटिसशिप / प्रशिक्षण",
    lblSkills: "आपके कौशल (सुझाव चुनें या टाइप करें)",
    phSkills: "जैसे: कंप्यूटर, टाइपिंग, संवाद कौशल",
    suggestionsByStep: [
      ["लखनऊ, उत्तर प्रदेश, शहरी", "कृष्णा, आंध्र प्रदेश, ग्रामीण", "जयपुर, राजस्थान, शहरी", "पटना, बिहार, ग्रामीण"],
      ["कक्षा 5–8", "10वीं पास", "12वीं / इंटरमीडिएट", "डिप्लोमा / ITI", "स्नातक", "स्नातकोत्तर / Ph.D."],
      ["फ्रेशर", "1–2 वर्ष", "3+ वर्ष"],
      ["टेक्नोलॉजी (Technology)", "रिटेल (Retail)", "निर्माण (Construction)", "ग्रीन जॉब्स (Green Jobs)", "कृषि (Agriculture)", "स्वास्थ्य (Healthcare)"],
      ["वेतन रोजगार (Employment)", "स्वरोजगार (Self-Employment)", "अप्रेंटिसशिप (Apprenticeship)"],
      ["Computer fundamentals, Typing", "Customer handling, Communication", "Python programming, Data analysis", "Electrical basics, Solar panel mounting"],
    ],
  },
  te: {
    modeVoice: "🎙️ వాయిస్ & చాట్ అసిస్టెంట్",
    modeForm: "📋 సాధారణ ఫారమ్ నింపండి",
    suggestedLabel: "సూచించిన సమాధానాలు (ఎంచుకోవడానికి క్లిక్ చేయండి):",
    fillInBar: "టైపింగ్ బార్‌లో చేర్చండి",
    formTitle: "మీ జీవనోపాధి ప్రొఫైల్ ఫారమ్ నింపండి",
    formSub: "అన్ని వివరాలను నేరుగా ఫారమ్‌లో నింపండి లేదా ఎప్పుడైనా వాయిస్ అసిస్టెంట్‌కు మారండి.",
    lblState: "రాష్ట్రం (State)",
    phState: "ఉదా: ఆంధ్రప్రదేశ్ / తెలంగాణ",
    lblDistrict: "జిల్లా (District)",
    phDistrict: "ఉదా: కృష్ణా / హైదరాబాద్",
    lblArea: "ప్రాంతం రకం",
    optRural: "గ్రామీణ (Rural)",
    optUrban: "పట్టణ (Urban)",
    lblEdu: "అత్యధిక విద్యార్హత (NSQF స్థాయి)",
    optEdu1: "5–8 తరగతి / ప్రాథమిక అక్షరాస్యత (NSQF 1–2)",
    optEdu2: "10వ తరగతి పాస్ (NSQF 3–4)",
    optEdu3: "ఇంటర్మీడియట్ / 12వ తరగతి (NSQF 3–4)",
    optEdu4: "డిప్లొమా / ITI / డిగ్రీ 1–2 సం. (NSQF 5–6)",
    optEdu5: "బ్యాచిలర్స్ డిగ్రీ (NSQF 7–8)",
    optEdu6: "మాస్టర్స్ / Ph.D. (NSQF 9–10)",
    lblExp: "పని అనుభవం",
    optExp1: "ఫ్రెషర్ (0 సంవత్సరాలు)",
    optExp2: "1–2 సంవత్సరాలు",
    optExp3: "3+ సంవత్సరాలు",
    lblSector: "ఆసక్తి ఉన్న రంగం",
    lblPref: "కెరీర్ ప్రాధాన్యత",
    optPref1: "ఉద్యోగం (Wage Employment)",
    optPref2: "స్వయం ఉపాధి (Self-Employment)",
    optPref3: "అప్రెంటిస్‌షిప్ / శిక్షణ",
    lblSkills: "మీ ప్రస్తుత నైపుణ్యాలు (సూచనలు ఎంచుకోండి లేదా టైప్ చేయండి)",
    phSkills: "ఉదా: Computer fundamentals, Typing, Communication",
    suggestionsByStep: [
      ["కృష్ణా, ఆంధ్రప్రదేశ్, గ్రామీణ", "హైదరాబాద్, తెలంగాణ, పట్టణ", "గుంటూరు, ఆంధ్రప్రదేశ్, గ్రామీణ", "విశాఖపట్నం, ఆంధ్రప్రదేశ్, పట్టణ"],
      ["5–8 తరగతి", "10వ తరగతి", "ఇంటర్మీడియట్", "డిప్లొమా / ITI", "డిగ్రీ (Graduate)", "మాస్టర్స్ / Ph.D."],
      ["ఫ్రెషర్", "1–2 సంవత్సరాలు", "3+ సంవత్సరాలు"],
      ["టెక్నాలజీ (Technology)", "రిటైల్ (Retail)", "నిర్మాణం (Construction)", "సోలార్ / గ్రీన్ జాబ్స్", "వ్యవసాయం (Agriculture)", "ఆరోగ్యం (Healthcare)"],
      ["ఉద్యోగం (Employment)", "స్వయం ఉపాధి (Self-Employment)", "అప్రెంటిస్‌షిప్ (Apprenticeship)"],
      ["Computer fundamentals, Typing", "Customer handling, Communication", "Python programming, Data analysis", "Electrical basics, Solar panel mounting"],
    ],
  },
  ta: {
    modeVoice: "🎙️ குரல் & அரட்டை உதவியாளர்",
    modeForm: "📋 பாரம்பரிய படிவம் நிரப்புதல்",
    suggestedLabel: "பரிந்துரைக்கப்பட்ட பதில்கள் (தேர்ந்தெடுக்க கிளிக் செய்யவும்):",
    fillInBar: "தட்டச்சுப் பட்டியில் சேர்",
    formTitle: "உங்கள் வாழ்வாதார சுயவிவரப் படிவத்தை நிரப்பவும்",
    formSub: "அனைத்து விவரங்களையும் படிவத்தில் நிரப்பவும் அல்லது எப்போது வேண்டுமானாலும் குரல் உதவியாளருக்கு மாறவும்.",
    lblState: "மாநிலம் (State)",
    phState: "எ.கா: தமிழ்நாடு",
    lblDistrict: "மாவட்டம் (District)",
    phDistrict: "எ.கா: சென்னை / மதுரை",
    lblArea: "பகுதி வகை",
    optRural: "கிராமப்புறம் (Rural)",
    optUrban: "நகர்ப்புறம் (Urban)",
    lblEdu: "உயர்ந்த கல்வித் தகுதி (NSQF நிலை)",
    optEdu1: "வகுப்பு 5–8 / அடிப்படை எழுத்தறிவு (NSQF 1–2)",
    optEdu2: "10-ம் வகுப்பு தேர்ச்சி (NSQF 3–4)",
    optEdu3: "12-ம் வகுப்பு (NSQF 3–4)",
    optEdu4: "டிப்ளமோ / ITI (NSQF 5–6)",
    optEdu5: "பட்டதாரி (NSQF 7–8)",
    optEdu6: "முதுகலை / Ph.D. (NSQF 9–10)",
    lblExp: "பணி அனுபவம்",
    optExp1: "புதியவர் (Fresher)",
    optExp2: "1–2 ஆண்டுகள்",
    optExp3: "3+ ஆண்டுகள்",
    lblSector: "விருப்பமான துறை",
    lblPref: "தொழில் விருப்பம்",
    optPref1: "ஊதிய வேலைவாய்ப்பு",
    optPref2: "சுயதொழில்",
    optPref3: "பயிற்சி (Apprenticeship)",
    lblSkills: "உங்கள் தற்போதைய திறன்கள்",
    phSkills: "எ.கா: Computer fundamentals, Typing, Communication",
    suggestionsByStep: [
      ["மதுரை, தமிழ்நாடு, கிராமப்புறம்", "சென்னை, தமிழ்நாடு, நகர்ப்புறம்", "கோயம்புத்தூர், தமிழ்நாடு, நகர்ப்புறம்"],
      ["வகுப்பு 5–8", "10-ம் வகுப்பு", "12-ம் வகுப்பு", "டிப்ளமோ / ITI", "பட்டதாரி", "முதுகலை / Ph.D."],
      ["புதியவர் (Fresher)", "1–2 ஆண்டுகள்", "3+ ஆண்டுகள்"],
      ["தொழில்நுட்பம் (Technology)", "சில்லறை வணிகம் (Retail)", "கட்டுமானம் (Construction)", "பசுமை வேலைகள் (Green Jobs)", "விவசாயம் (Agriculture)"],
      ["ஊதிய வேலைவாய்ப்பு (Employment)", "சுயதொழில் (Self-Employment)", "பயிற்சி (Apprenticeship)"],
      ["Computer fundamentals, Typing", "Customer handling, Communication", "Python programming, Data analysis"],
    ],
  },
  ml: {
    modeVoice: "🎙️ വോയ്‌സ് & ചാറ്റ് അസിസ്റ്റന്റ്",
    modeForm: "📋 പരമ്പരാഗത ഫോം പൂരിപ്പിക്കൽ",
    suggestedLabel: "നിർദ്ദേശിച്ച ഉത്തരങ്ങൾ (തിരഞ്ഞെടുക്കാൻ ക്ലിക്ക് ചെയ്യുക):",
    fillInBar: "ടൈപ്പിംഗ് ബാറിൽ ചേർക്കുക",
    formTitle: "നിങ്ങളുടെ തൊഴിൽ പ്രൊഫൈൽ ഫോം പൂരിപ്പിക്കുക",
    formSub: "എല്ലാ വിവരങ്ങളും ഫോമിൽ പൂരിപ്പിക്കുക അല്ലെങ്കിൽ എപ്പോൾ വേണമെങ്കിലും വോയ്‌സ് അസിസ്റ്റന്റിലേക്ക് മാറുക.",
    lblState: "സംസ്ഥാനം (State)",
    phState: "ഉദാ: കേരളം",
    lblDistrict: "ജില്ല (District)",
    phDistrict: "ഉദാ: എറണാകുളം / കോഴിക്കോട്",
    lblArea: "പ്രദേശത്തിന്റെ തരം",
    optRural: "ഗ്രാമപ്രദേശം (Rural)",
    optUrban: "നഗരപ്രദേശം (Urban)",
    lblEdu: "ഉയർന്ന വിദ്യാഭ്യാസ യോഗ്യത (NSQF)",
    optEdu1: "ക്ലാസ് 5–8 / അടിസ്ഥാന സാക്ഷരത (NSQF 1–2)",
    optEdu2: "10-ാം ക്ലാസ് വിജയം (NSQF 3–4)",
    optEdu3: "പ്ലസ് ടു / 12-ാം ക്ലാസ് (NSQF 3–4)",
    optEdu4: "ഡിപ്ലോമ / ITI (NSQF 5–6)",
    optEdu5: "ബിരുദം (NSQF 7–8)",
    optEdu6: "ബിരുദാനന്തര ബിരുദം / Ph.D. (NSQF 9–10)",
    lblExp: "പ്രവൃത്തിപരിചയം",
    optExp1: "ഫ്രഷർ (0 വർഷം)",
    optExp2: "1–2 വർഷം",
    optExp3: "3+ വർഷം",
    lblSector: "താൽപ്പര്യമുള്ള മേഖല",
    lblPref: "കരിയർ മുൻഗണന",
    optPref1: "ശമ്പളമുള്ള ജോലി",
    optPref2: "സ്വയംതൊഴിൽ",
    optPref3: "അപ്രന്റീസ്ഷിപ്പ് / പരിശീലനം",
    lblSkills: "നിങ്ങളുടെ നിലവിലുള്ള കഴിവുകൾ",
    phSkills: "ഉദാ: Computer fundamentals, Typing, Communication",
    suggestionsByStep: [
      ["കോഴിക്കോട്, കേരളം, ഗ്രാമപ്രദേശം", "എറണാകുളം, കേരളം, നഗരപ്രദേശം", "തിരുവനന്തപുരം, കേരളം, നഗരപ്രദേശം"],
      ["ക്ലാസ് 5–8", "10-ാം ക്ലാസ്", "പ്ലസ് ടു", "ഡിപ്ലോമ / ITI", "ബിരുദം", "ബിരുദാനന്തര ബിരുദം / Ph.D."],
      ["ഫ്രഷർ", "1–2 വർഷം", "3+ വർഷം"],
      ["ടെക്നോളജി (Technology)", "റീട്ടെയിൽ (Retail)", "നിർമ്മാണം (Construction)", "ഗ്രീൻ ജോബ്സ് (Green Jobs)", "കൃഷി (Agriculture)"],
      ["ശമ്പളമുള്ള ജോലി (Employment)", "സ്വയംതൊഴിൽ (Self-Employment)", "അപ്രന്റീസ്ഷിപ്പ് (Apprenticeship)"],
      ["Computer fundamentals, Typing", "Customer handling, Communication", "Python programming, Data analysis"],
    ],
  },
  kn: {
    modeVoice: "🎙️ ಧ್ವನಿ ಮತ್ತು ಚಾಟ್ ಸಹಾಯಕ",
    modeForm: "📋 ಸಾಂಪ್ರದಾಯಿಕ ಫಾರ್ಮ್ ಭರ್ತಿ",
    suggestedLabel: "ಸೂಚಿಸಲಾದ ಉತ್ತರಗಳು (ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ):",
    fillInBar: "ಟೈಪಿಂಗ್ ಬಾರ್‌ಗೆ ಸೇರಿಸಿ",
    formTitle: "ನಿಮ್ಮ ಜೀವನೋಪಾಯ ಪ್ರೊಫೈಲ್ ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿ",
    formSub: "ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ನೇರವಾಗಿ ಫಾರ್ಮ್‌ನಲ್ಲಿ ಭರ್ತಿ ಮಾಡಿ ಅಥವಾ ಯಾವಾಗ ಬೇಕಾದರೂ ಧ್ವನಿ ಸಹಾಯಕಕ್ಕೆ ಬದಲಾಯಿಸಿ.",
    lblState: "ರಾಜ್ಯ (State)",
    phState: "ಉದಾ: ಕರ್ನಾಟಕ",
    lblDistrict: "ಜಿಲ್ಲೆ (District)",
    phDistrict: "ಉದಾ: ಬೆಂಗಳೂರು / ಮೈಸೂರು",
    lblArea: "ಪ್ರದೇಶದ ವಿಧ",
    optRural: "ಗ್ರಾಮೀಣ (Rural)",
    optUrban: "ನಗರ (Urban)",
    lblEdu: "ಅತ್ಯುನ್ನತ ಶಿಕ್ಷಣ (NSQF ಹಂತ)",
    optEdu1: "ತರಗತಿ 5–8 / ಮೂಲ ಸಾಕ್ಷರತೆ (NSQF 1–2)",
    optEdu2: "10ನೇ ತರಗತಿ ಪಾಸ್ (NSQF 3–4)",
    optEdu3: "ಪಿಯುಸಿ / 12ನೇ ತರಗತಿ (NSQF 3–4)",
    optEdu4: "ಡಿಪ್ಲೊಮಾ / ITI (NSQF 5–6)",
    optEdu5: "ಪದವಿ (NSQF 7–8)",
    optEdu6: "ಸ್ನಾತಕೋತ್ತರ / Ph.D. (NSQF 9–10)",
    lblExp: "ಕೆಲಸದ ಅನುಭವ",
    optExp1: "ಫ್ರೆಶರ್ (0 ವರ್ಷ)",
    optExp2: "1–2 ವರ್ಷಗಳು",
    optExp3: "3+ ವರ್ಷಗಳು",
    lblSector: "ಆಸಕ್ತಿಯ ಕ್ಷೇತ್ರ",
    lblPref: "ವೃತ್ತಿ ಆದ್ಯತೆ",
    optPref1: "ಉದ್ಯೋಗ (Wage Employment)",
    optPref2: "ಸ್ವಯಂ ಉದ್ಯೋಗ (Self-Employment)",
    optPref3: "ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ / ತರಬೇತಿ",
    lblSkills: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಕೌಶಲ್ಯಗಳು",
    phSkills: "ಉದಾ: Computer fundamentals, Typing, Communication",
    suggestionsByStep: [
      ["ಮೈಸೂರು, ಕರ್ನಾಟಕ, ಗ್ರಾಮೀಣ", "ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ, ನಗರ", "ಹುಬ್ಬಳ್ಳಿ, ಕರ್ನಾಟಕ, ನಗರ"],
      ["ತರಗತಿ 5–8", "10ನೇ ತರಗತಿ", "ಪಿಯುಸಿ (12th)", "ಡಿಪ್ಲೊಮಾ / ITI", "ಪದವಿ", "ಸ್ನಾತಕೋತ್ತರ / Ph.D."],
      ["ಫ್ರೆಶರ್", "1–2 ವರ್ಷಗಳು", "3+ ವರ್ಷಗಳು"],
      ["ತಂತ್ರಜ್ಞಾನ (Technology)", "ರಿಟೇಲ್ (Retail)", "ನಿರ್ಮಾಣ (Construction)", "ಗ್ರೀನ್ ಜಾಬ್ಸ್ (Green Jobs)", "ಕೃಷಿ (Agriculture)"],
      ["ಉದ್ಯೋಗ (Employment)", "ಸ್ವಯಂ ಉದ್ಯೋಗ (Self-Employment)", "ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ (Apprenticeship)"],
      ["Computer fundamentals, Typing", "Customer handling, Communication", "Python programming, Data analysis"],
    ],
  },
};

export default function VoiceAssistant() {
  const { lang, changeLang, currentLangObj, t } = useLanguage();
  const ui = MULTILINGUAL_UI[lang] || MULTILINGUAL_UI.en;

  const [mode, setMode] = useState("voice");
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [skillsText, setSkillsText] = useState("");
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

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api
      .get("/profile")
      .then((res) => {
        if (res.data) {
          setProfileData((prev) => ({
            ...prev,
            ...res.data,
            skills: res.data.skills || [],
          }));
          if (res.data.skills?.length) {
            setSkillsText(res.data.skills.join(", "));
          }
        }
      })
      .catch(() => {});
  }, []);

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
      setError("Speech recognition is not supported in this browser. Use the typing bar, suggested chips, or Traditional Form below.");
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
      setError(`Microphone error (${e.error}). You can type, tap a suggested answer, or switch to Traditional Form.`);
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
    if (parsed.skills?.length) {
      setSkillsText(parsed.skills.join(", "));
    }
    setInput("");

    const nextStep = step + 1;
    if (nextStep < questions.length) {
      const nextQ = questions[nextStep];
      updatedMessages.push({ sender: "bot", text: nextQ });
      setMessages(updatedMessages);
      setStep(nextStep);
      speakText(nextQ);
    } else {
      const doneMsg = `✅ ${t.saveProfile}`;
      updatedMessages.push({ sender: "bot", text: doneMsg });
      setMessages(updatedMessages);
      setStep(nextStep);
      speakText(doneMsg);
    }
  }

  const currentSuggestions = ui.suggestionsByStep[step] || [];
  const filteredSuggestions = input.trim()
    ? currentSuggestions.filter((s) =>
        s.toLowerCase().includes(input.trim().toLowerCase())
      )
    : currentSuggestions;

  async function saveAndFinish(e) {
    if (e) e.preventDefault();
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
        skills: profileData.skills || [],
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
            <strong>{currentLangObj.native} ({currentLangObj.speechCode})</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => changeLang(l.code)}
              className={lang === l.code ? "btn btn-primary" : "btn btn-outline"}
              style={{ padding: "6px 12px", fontSize: "0.88rem" }}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
        <button
          type="button"
          onClick={() => setMode("voice")}
          className={mode === "voice" ? "btn btn-primary" : "btn btn-outline"}
        >
          {ui.modeVoice}
        </button>
        <button
          type="button"
          onClick={() => setMode("form")}
          className={mode === "form" ? "btn btn-primary" : "btn btn-outline"}
        >
          {ui.modeForm}
        </button>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#991b1b", marginTop: 14 }}>
          {error}
        </div>
      )}

      {mode === "voice" ? (
        <>
          <div className="card stack" style={{ marginTop: 16, maxHeight: 340, overflowY: "auto" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  background: m.sender === "user" ? "#0f766e" : "#f1f5f9",
                  color: m.sender === "user" ? "#ffffff" : "#0f172a",
                  padding: "10px 14px",
                  borderRadius: 12,
                  maxWidth: "82%",
                  lineHeight: 1.5,
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
                  {listening ? ui.listening : `🎙️ ${t.speakAnswer}`}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => speakText(questions[step])}
                >
                  🔊 {t.replayQuestion}
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAnswer(input);
                }}
                style={{ display: "flex", gap: 10, marginTop: 14 }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.typePlaceholder}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">
                  {t.send}
                </button>
              </form>

              {currentSuggestions.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p className="small" style={{ fontWeight: 600, marginBottom: 8 }}>
                    {ui.suggestedLabel}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(filteredSuggestions.length > 0 ? filteredSuggestions : currentSuggestions).map((sug) => (
                      <div
                        key={sug}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background: "#f0fdf4",
                          border: "1px solid #86efac",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleAnswer(sug)}
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: "6px 12px",
                            color: "#166534",
                            fontWeight: 600,
                            fontSize: "0.86rem",
                            cursor: "pointer",
                          }}
                        >
                          {sug}
                        </button>
                        <button
                          type="button"
                          title={ui.fillInBar}
                          onClick={() => setInput(sug)}
                          style={{
                            border: "none",
                            borderLeft: "1px solid #86efac",
                            background: "#dcfce7",
                            padding: "6px 8px",
                            color: "#15803d",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                          }}
                        >
                          ✎
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ marginTop: 16 }}>
              <p>
                <strong>{ui.lblDistrict} / {ui.lblState}:</strong>{" "}
                {profileData.district || "—"}, {profileData.state || "—"} ({profileData.area_type})
              </p>
              <p>
                <strong>{ui.lblEdu}:</strong> {profileData.education_level} •{" "}
                <strong>{ui.lblExp}:</strong> {profileData.experience_level}
              </p>
              <p>
                <strong>{ui.lblSector}:</strong> {profileData.interest_sector} ({profileData.career_preference})
              </p>
              <p>
                <strong>{ui.lblSkills}:</strong> {(profileData.skills || []).join(", ") || "—"}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                <button className="btn btn-primary" onClick={saveAndFinish} disabled={saving}>
                  {saving ? "..." : t.saveProfile}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setMode("form")}
                >
                  {ui.modeForm}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setStep(0);
                    setMessages([{ sender: "bot", text: questions[0] }]);
                  }}
                >
                  {t.restart}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <form className="card" onSubmit={saveAndFinish} style={{ marginTop: 16 }}>
          <h2>{ui.formTitle}</h2>
          <p className="small" style={{ marginBottom: 16 }}>{ui.formSub}</p>

          <div className="grid grid-2">
            <div className="field">
              <label>{ui.lblState}</label>
              <input
                type="text"
                placeholder={ui.phState}
                value={profileData.state}
                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
              />
            </div>

            <div className="field">
              <label>{ui.lblDistrict}</label>
              <input
                type="text"
                placeholder={ui.phDistrict}
                value={profileData.district}
                onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
              />
            </div>

            <div className="field">
              <label>{ui.lblArea}</label>
              <select
                value={profileData.area_type}
                onChange={(e) => setProfileData({ ...profileData, area_type: e.target.value })}
              >
                <option value="Rural">{ui.optRural}</option>
                <option value="Urban">{ui.optUrban}</option>
              </select>
            </div>

            <div className="field">
              <label>{ui.lblEdu}</label>
              <select
                value={profileData.education_level}
                onChange={(e) => setProfileData({ ...profileData, education_level: e.target.value })}
              >
                <option value="Class 5-8">{ui.optEdu1}</option>
                <option value="10th Pass">{ui.optEdu2}</option>
                <option value="Intermediate">{ui.optEdu3}</option>
                <option value="Diploma / ITI">{ui.optEdu4}</option>
                <option value="Graduate">{ui.optEdu5}</option>
                <option value="Postgraduate / Ph.D.">{ui.optEdu6}</option>
              </select>
            </div>

            <div className="field">
              <label>{ui.lblExp}</label>
              <select
                value={profileData.experience_level}
                onChange={(e) => setProfileData({ ...profileData, experience_level: e.target.value })}
              >
                <option value="Fresher">{ui.optExp1}</option>
                <option value="1-2 Years">{ui.optExp2}</option>
                <option value="3+ Years">{ui.optExp3}</option>
              </select>
            </div>

            <div className="field">
              <label>{ui.lblSector}</label>
              <select
                value={profileData.interest_sector}
                onChange={(e) => setProfileData({ ...profileData, interest_sector: e.target.value })}
              >
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Construction">Construction</option>
                <option value="Green Jobs">Green Jobs</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Business">Business</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>

            <div className="field">
              <label>{ui.lblPref}</label>
              <select
                value={profileData.career_preference}
                onChange={(e) => setProfileData({ ...profileData, career_preference: e.target.value })}
              >
                <option value="Employment">{ui.optPref1}</option>
                <option value="Self-Employment">{ui.optPref2}</option>
                <option value="Apprenticeship">{ui.optPref3}</option>
              </select>
            </div>

            <div className="field">
              <label>{ui.lblSkills}</label>
              <input
                type="text"
                placeholder={ui.phSkills}
                value={skillsText}
                onChange={(e) => {
                  setSkillsText(e.target.value);
                  setProfileData({
                    ...profileData,
                    skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  });
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 8, marginBottom: 16 }}>
            <p className="small" style={{ fontWeight: 600, marginBottom: 6 }}>
              {ui.suggestedLabel}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(ui.suggestionsByStep[5] || []).map((skillGroup) => (
                <button
                  key={skillGroup}
                  type="button"
                  onClick={() => {
                    const nextVal = skillsText ? `${skillsText}, ${skillGroup}` : skillGroup;
                    setSkillsText(nextVal);
                    setProfileData({
                      ...profileData,
                      skills: nextVal.split(",").map((s) => s.trim()).filter(Boolean),
                    });
                  }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 999,
                    border: "1px solid #86efac",
                    background: "#f0fdf4",
                    color: "#166534",
                    fontWeight: 600,
                    fontSize: "0.84rem",
                    cursor: "pointer",
                  }}
                >
                  + {skillGroup}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "..." : t.saveProfile}
          </button>
        </form>
      )}
    </div>
  );
}