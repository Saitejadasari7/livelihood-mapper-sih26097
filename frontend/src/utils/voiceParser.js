export function parseAnswer(step, rawText, currentProfile) {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const updated = { ...currentProfile };

  // Step 0: Location (State, District, Rural/Urban)
  if (step === 0) {
    if (
      lower.includes("urban") ||
      lower.includes("city") ||
      lower.includes("town") ||
      text.includes("शहरी") ||
      text.includes("పట్టణ") ||
      text.includes("நகர") ||
      text.includes("നഗര") ||
      text.includes("ನಗರ")
    ) {
      updated.area_type = "Urban";
    } else if (
      lower.includes("rural") ||
      lower.includes("village") ||
      text.includes("ग्रामीण") ||
      text.includes("గ్రామీణ") ||
      text.includes("கிராம") ||
      text.includes("ഗ്രാമ") ||
      text.includes("ಗ್ರಾಮೀಣ")
    ) {
      updated.area_type = "Rural";
    }

    const parts = text
      .replace(/\b(rural|urban|village|city|town|from|in|district|state)\b/gi, "")
      .replace(/(ग्रामीण|शहरी|గ్రామీణ|పట్టణ|கிராமப்புறம்|நகர்ப்புறம்|ഗ്രാമപ്രദേശം|നഗരപ്രദേശം|ಗ್ರಾಮೀಣ|ನಗರ)/g, "")
      .split(/[,|-]/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length >= 2) {
      updated.district = parts[0];
      updated.state = parts[1];
    } else if (parts.length === 1) {
      updated.state = parts[0];
    }
  }

  // Step 1: Education Level (NSQF Levels 1-10)
  if (step === 1) {
    if (
      lower.includes("phd") ||
      lower.includes("ph.d") ||
      lower.includes("postgrad") ||
      lower.includes("master") ||
      lower.includes("m.tech") ||
      lower.includes("mba") ||
      text.includes("स्नातकोत्तर") ||
      text.includes("మాస్టర్స్") ||
      text.includes("முதுகலை") ||
      text.includes("ബിരുദാനന്തര") ||
      text.includes("ಸ್ನಾತಕೋತ್ತರ")
    ) {
      updated.education_level = "Postgraduate / Ph.D.";
    } else if (
      lower.includes("grad") ||
      lower.includes("b.tech") ||
      lower.includes("bachelor") ||
      lower.includes("degree") ||
      text.includes("स्नातक") ||
      text.includes("డిగ్రీ") ||
      text.includes("பட்டதாரி") ||
      text.includes("ബിരുദം") ||
      text.includes("ಪದವಿ")
    ) {
      updated.education_level = "Graduate";
    } else if (
      lower.includes("diploma") ||
      lower.includes("iti") ||
      lower.includes("polytechnic") ||
      text.includes("डिप्लोमा") ||
      text.includes("డిప్లొమా") ||
      text.includes("டிப்ளமோ") ||
      text.includes("ഡിപ്ലോമ") ||
      text.includes("ಡಿಪ್ಲೊಮಾ")
    ) {
      updated.education_level = "Diploma / ITI";
    } else if (
      lower.includes("12") ||
      lower.includes("inter") ||
      lower.includes("plus two") ||
      lower.includes("+2") ||
      text.includes("12वीं") ||
      text.includes("ఇంటర్") ||
      text.includes("12-ம்") ||
      text.includes("പ്ലസ് ടു") ||
      text.includes("ಪಿಯುಸಿ")
    ) {
      updated.education_level = "Intermediate";
    } else if (
      lower.includes("10") ||
      lower.includes("ssc") ||
      lower.includes("matric") ||
      text.includes("10वीं") ||
      text.includes("10వ") ||
      text.includes("10-ம்") ||
      text.includes("10-ാം") ||
      text.includes("10ನೇ")
    ) {
      updated.education_level = "10th Pass";
    } else if (
      lower.includes("5") ||
      lower.includes("8") ||
      lower.includes("below") ||
      lower.includes("basic") ||
      text.includes("5–8") ||
      text.includes("5-8")
    ) {
      updated.education_level = "Class 5-8";
    }
  }

  // Step 2: Experience Level
  if (step === 2) {
    if (lower.includes("3") || lower.includes("4") || lower.includes("5") || lower.includes("senior")) {
      updated.experience_level = "3+ Years";
    } else if (lower.includes("1") || lower.includes("2")) {
      updated.experience_level = "1-2 Years";
    } else {
      updated.experience_level = "Fresher";
    }
  }

  // Step 3: Interest Sector
  if (step === 3) {
    if (lower.includes("tech") || lower.includes("it") || lower.includes("ai") || lower.includes("data") || text.includes("टेक्नोलॉजी") || text.includes("టెక్నాలజీ") || text.includes("தொழில்நுட்பம்") || text.includes("ടെക്നോളജി") || text.includes("ತಂತ್ರಜ್ಞಾನ")) {
      updated.interest_sector = "Technology";
    } else if (lower.includes("retail") || text.includes("रिटेल") || text.includes("రిటైల్") || text.includes("சில்லறை") || text.includes("റീട്ടെയിൽ") || text.includes("ರಿಟೇಲ್")) {
      updated.interest_sector = "Retail";
    } else if (lower.includes("construct") || lower.includes("mason") || text.includes("निर्माण") || text.includes("నిర్మాణం") || text.includes("கட்டுமானம்") || text.includes("നിർമ്മാണം") || text.includes("ನಿರ್ಮಾಣ")) {
      updated.interest_sector = "Construction";
    } else if (lower.includes("solar") || lower.includes("green") || text.includes("ग्रीन") || text.includes("సోలార్") || text.includes("பசுமை") || text.includes("ഗ്രീൻ") || text.includes("ಗ್ರೀನ್")) {
      updated.interest_sector = "Green Jobs";
    } else if (lower.includes("manufactur") || text.includes("मैन्युफैक्चरिंग") || text.includes("తయారీ") || text.includes("உற்பத்தி") || text.includes("നിർമ്മാണ") || text.includes("ಉತ್ಪಾದನೆ")) {
      updated.interest_sector = "Manufacturing";
    } else if (lower.includes("agri") || text.includes("कृषि") || text.includes("వ్యవసాయం") || text.includes("விவசாயம்") || text.includes("കൃഷി") || text.includes("ಕೃಷಿ")) {
      updated.interest_sector = "Agriculture";
    } else if (lower.includes("health") || text.includes("स्वास्थ्य") || text.includes("ఆరోగ్యం") || text.includes("சுகாதாரம்") || text.includes("ആരോഗ്യം") || text.includes("ಆರೋಗ್ಯ")) {
      updated.interest_sector = "Healthcare";
    } else if (lower.includes("business") || text.includes("व्यापार") || text.includes("వ్యాపారం") || text.includes("வணிகம்") || text.includes("ബിസിനസ്") || text.includes("ವ್ಯಾಪಾರ")) {
      updated.interest_sector = "Business";
    }
  }

  // Step 4: Career Preference
  if (step === 4) {
    if (lower.includes("self") || lower.includes("own") || text.includes("स्वरोजगार") || text.includes("స్వయం") || text.includes("சுயதொழில்") || text.includes("സ്വയംതൊഴിൽ") || text.includes("ಸ್ವಯಂ")) {
      updated.career_preference = "Self-Employment";
    } else if (lower.includes("apprentice") || text.includes("अप्रेंटिस") || text.includes("అప్రెంటిస్") || text.includes("பயிற்சி") || text.includes("അപ്രന്റീസ്") || text.includes("ಅಪ್ರೆಂಟಿಸ್")) {
      updated.career_preference = "Apprenticeship";
    } else {
      updated.career_preference = "Employment";
    }
  }

  // Step 5: Skills Extraction
  if (step === 5) {
    const existing = Array.isArray(updated.skills) ? updated.skills : [];
    const items = text.split(/[,،、;]+/).map((s) => s.trim()).filter(Boolean);
    updated.skills = Array.from(new Set([...existing, ...items]));
  }

  return updated;
}

export default parseAnswer;