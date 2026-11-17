export const LANGUAGES = {
  "en-IN": { label: "English (India)", code: "en-IN" },
  "hi-IN": { label: "Hindi (Experimental)", code: "hi-IN" },
};

export const QUESTIONS = [
  {
    key: "education_level",
    prompt: "What is your highest education level? For example: 10th pass, Intermediate, Diploma, or Graduate.",
  },
  {
    key: "skills",
    prompt: "Which skills do you already know? For example: computer, typing, spreadsheet, communication, or customer handling.",
  },
  {
    key: "interest_sector",
    prompt: "Which sector interests you most? Technology, Business and Office, Agriculture, or Healthcare?",
  },
  {
    key: "experience_level",
    prompt: "How much work experience do you have? Fresher, 1 to 2 years, or 3 or more years?",
  },
  {
    key: "career_preference",
    prompt: "Do you prefer wage employment, self-employment, or an apprenticeship?",
  },
  {
    key: "location",
    prompt: "Which district and state are you from, and is it rural or urban?",
  },
];

export function extractAnswer(key, rawText) {
  const t = rawText.toLowerCase();

  if (key === "education_level") {
    if (t.includes("below") || t.includes("8th") || t.includes("9th")) return "Below 10th";
    if (t.includes("10") || t.includes("tenth") || t.includes("ssc")) return "10th Pass";
    if (t.includes("12") || t.includes("inter") || t.includes("plus two")) return "Intermediate";
    if (t.includes("diploma") || t.includes("iti")) return "Diploma / ITI";
    if (t.includes("grad") || t.includes("degree") || t.includes("btech") || t.includes("bsc") || t.includes("bcom")) return "Graduate";
    return "Intermediate";
  }

  if (key === "skills") {
    const found = [];
    if (t.includes("computer") || t.includes("basic")) found.push("Computer fundamentals");
    if (t.includes("typ")) found.push("Typing");
    if (t.includes("excel") || t.includes("sheet") || t.includes("spreadsheet")) found.push("Spreadsheet operations");
    if (t.includes("data")) found.push("Data handling");
    if (t.includes("email") || t.includes("internet")) found.push("Email and internet use");
    if (t.includes("file") || t.includes("filing") || t.includes("record")) found.push("Filing and record keeping");
    if (t.includes("communicat") || t.includes("speak") || t.includes("english")) found.push("Communication");
    if (t.includes("customer") || t.includes("support") || t.includes("call")) found.push("Customer handling");
    if (t.includes("read") || t.includes("writ")) found.push("Basic reading and writing");
    if (t.includes("time")) found.push("Time management");
    return found.length ? found : ["Computer fundamentals"];
  }

  if (key === "interest_sector") {
    if (t.includes("agri") || t.includes("farm")) return "Agriculture";
    if (t.includes("health") || t.includes("medic") || t.includes("nurs")) return "Healthcare";
    if (t.includes("busi") || t.includes("office") || t.includes("admin") || t.includes("account")) return "Business";
    return "Technology";
  }

  if (key === "experience_level") {
    if (t.includes("3") || t.includes("three") || t.includes("four") || t.includes("five")) return "3+ Years";
    if (t.includes("1") || t.includes("2") || t.includes("one") || t.includes("two")) return "1-2 Years";
    return "Fresher";
  }

  if (key === "career_preference") {
    if (t.includes("self") || t.includes("business") || t.includes("own")) return "Self-Employment";
    if (t.includes("apprentice") || t.includes("train") || t.includes("intern")) return "Apprenticeship";
    return "Employment";
  }

  if (key === "location") {
    const area_type = t.includes("urban") || t.includes("city") || t.includes("town") ? "Urban" : "Rural";
    const parts = rawText.split(/,|from|in/i).map((s) => s.trim()).filter(Boolean);
    return {
      district: parts[0] || "Sample District",
      state: parts[1] || "Andhra Pradesh",
      area_type,
    };
  }

  return rawText;
}