export type EmotionId =
  | "furious"
  | "angry"
  | "calm"
  | "happy"
  | "sad"
  | "anxious"
  | "love"
  | "motherhood"
  | "sensual"
  | "sweet"
  | "excited"
  | "energetic"
  | "hopeful"
  | "tired"
  | "curious"
  | "confident"
  | "neutral"
  | "custom";

export type EmotionEffect =
  | "flames"
  | "thunder"
  | "rain"
  | "hearts"
  | "candy"
  | "embers"
  | "waves"
  | "sparkles"
  | "mist"
  | "jitter"
  | "bokeh"
  | "bursts"
  | "rise"
  | "blur"
  | "orbit"
  | "rays"
  | "drift";

export interface Emotion {
  id: EmotionId;
  label: string;
  keywords: string[];
  gradient: string[];
  accentColor: string;
  textColor: string;
  effect: EmotionEffect;
  responseMessage: string;
}

export const emotions: Emotion[] = [
  {
    id: "furious",
    label: "Furious",
    keywords: [
      "furious",
      "rage",
      "enraged",
      "livid",
      "outraged",
      "storming",
      "explosive",
      "volatile",
      "seething",
      "boiling",
      "seeing red",
    ],
    gradient: ["#030102", "#16070a", "#5f0712", "#dc2626", "#facc15"],
    accentColor: "#fde047",
    textColor: "#fff7ed",
    effect: "thunder",
    responseMessage: "That storm has a message. Let it flash, then let it pass.",
  },
  {
    id: "angry",
    label: "Angry",
    keywords: [
      "angry",
      "mad",
      "pissed",
      "frustrated",
      "irritated",
      "annoyed",
      "resentful",
      "bitter",
      "heated",
      "impatient",
      "betrayed",
      "defensive",
    ],
    gradient: ["#120407", "#4b0710", "#b91c1c", "#f97316", "#070203"],
    accentColor: "#fb923c",
    textColor: "#fff7ed",
    effect: "flames",
    responseMessage: "That fire is valid. Let it move through you.",
  },
  {
    id: "calm",
    label: "Calm",
    keywords: [
      "calm",
      "chill",
      "relaxed",
      "peaceful",
      "serene",
      "grounded",
      "soft",
      "centered",
      "clear",
      "safe",
      "balanced",
      "ease",
      "still",
    ],
    gradient: ["#061525", "#153e75", "#7c3aed", "#22d3ee", "#020617"],
    accentColor: "#67e8f9",
    textColor: "#ecfeff",
    effect: "waves",
    responseMessage: "Stay here for a second. This feels peaceful.",
  },
  {
    id: "happy",
    label: "Happy",
    keywords: [
      "happy",
      "joyful",
      "joy",
      "cheerful",
      "good",
      "sunny",
      "grateful",
      "content",
      "delighted",
      "playful",
      "upbeat",
      "glad",
    ],
    gradient: ["#fff7d6", "#facc15", "#fb923c", "#fb7185", "#fffaf0"],
    accentColor: "#f59e0b",
    textColor: "#2b1700",
    effect: "sparkles",
    responseMessage: "A little light found you today.",
  },
  {
    id: "sad",
    label: "Sad",
    keywords: [
      "sad",
      "blue",
      "down",
      "grief",
      "heartbroken",
      "lonely",
      "low",
      "empty",
      "numb",
      "disappointed",
      "melancholy",
      "nostalgic",
      "homesick",
    ],
    gradient: ["#020617", "#172554", "#334155", "#64748b", "#0f172a"],
    accentColor: "#93c5fd",
    textColor: "#e0f2fe",
    effect: "rain",
    responseMessage: "Some days are quieter. You're still here.",
  },
  {
    id: "anxious",
    label: "Anxious",
    keywords: [
      "anxious",
      "anxiety",
      "stressed",
      "overwhelmed",
      "worried",
      "panicked",
      "nervous",
      "restless",
      "uneasy",
      "tense",
      "scared",
      "afraid",
      "insecure",
    ],
    gradient: ["#11100d", "#3b1c0a", "#b45309", "#dc2626", "#18181b"],
    accentColor: "#fbbf24",
    textColor: "#fff7ed",
    effect: "jitter",
    responseMessage: "Breathe first. The color can hold some of it.",
  },
  {
    id: "love",
    label: "Love",
    keywords: [
      "love",
      "romantic",
      "crush",
      "adored",
      "tender",
      "soft",
      "heart",
      "connected",
      "warm",
      "affectionate",
      "caring",
      "cherished",
      "in love",
      "loved",
      "loving",
    ],
    gradient: ["#2e102c", "#be185d", "#fb7185", "#c084fc", "#4c1d95"],
    accentColor: "#f9a8d4",
    textColor: "#fff1f8",
    effect: "hearts",
    responseMessage: "Softness looks good on you.",
  },
  {
    id: "motherhood",
    label: "Motherhood",
    keywords: [
      "motherhood",
      "mother",
      "mom",
      "mama",
      "maternal",
      "motherly",
      "nurturing",
      "protective",
      "caregiving",
      "caregiver",
      "parenting",
      "parenthood",
      "postpartum",
      "baby",
      "children",
      "child",
      "family",
      "held",
      "holding",
    ],
    gradient: ["#2a1015", "#9f3f46", "#f4a7a1", "#f8d8b8", "#6d4a72"],
    accentColor: "#f8b4a8",
    textColor: "#fff7f2",
    effect: "bokeh",
    responseMessage: "There is a whole universe inside that care.",
  },
  {
    id: "sensual",
    label: "Sensual",
    keywords: [
      "sexy",
      "sensual",
      "desirable",
      "desired",
      "attractive",
      "flirty",
      "magnetic",
      "hot",
      "alluring",
      "intimate",
      "seductive",
      "glowing",
      "confident in my body",
      "body confident",
    ],
    gradient: ["#170712", "#5b123c", "#b83280", "#ff7a90", "#2d1028"],
    accentColor: "#fb7185",
    textColor: "#fff1f4",
    effect: "bokeh",
    responseMessage: "That confidence has a pulse. Let it glow.",
  },
  {
    id: "sweet",
    label: "Sweet",
    keywords: [
      "sweet",
      "candy",
      "sugary",
      "cute",
      "adorable",
      "whimsical",
      "honey",
      "gentle",
      "kind",
      "softhearted",
      "treat",
      "delicious",
      "cozy sweet",
    ],
    gradient: ["#fff1f7", "#fecdd3", "#f9a8d4", "#c4b5fd", "#fb7185"],
    accentColor: "#f472b6",
    textColor: "#3b0a22",
    effect: "candy",
    responseMessage: "There is sweetness here. Let it fall around you.",
  },
  {
    id: "excited",
    label: "Excited",
    keywords: [
      "excited",
      "hyped",
      "pumped",
      "alive",
      "inspired",
      "eager",
      "motivated",
      "thrilled",
      "buzzing",
      "creative",
    ],
    gradient: ["#111827", "#2563eb", "#db2777", "#f97316", "#fde047"],
    accentColor: "#fde047",
    textColor: "#fffaf0",
    effect: "bursts",
    responseMessage: "That energy is asking to become something.",
  },
  {
    id: "energetic",
    label: "Energetic",
    keywords: [
      "energetic",
      "electric",
      "charged",
      "wired",
      "amped",
      "unstoppable",
      "power surge",
      "high energy",
      "energized",
      "restless energy",
    ],
    gradient: ["#020617", "#0f172a", "#1d4ed8", "#7c3aed", "#facc15"],
    accentColor: "#fde047",
    textColor: "#f8fafc",
    effect: "thunder",
    responseMessage: "That charge wants motion. Give it somewhere beautiful to go.",
  },
  {
    id: "hopeful",
    label: "Hopeful",
    keywords: [
      "hopeful",
      "optimistic",
      "positive",
      "ready",
      "better",
      "new",
      "encouraged",
      "open",
      "healing",
      "possible",
      "starting over",
    ],
    gradient: ["#042f2e", "#2dd4bf", "#7dd3fc", "#fde68a", "#fed7aa"],
    accentColor: "#86efac",
    textColor: "#052e2b",
    effect: "rise",
    responseMessage: "There's a little opening here.",
  },
  {
    id: "tired",
    label: "Tired",
    keywords: [
      "tired",
      "exhausted",
      "drained",
      "sleepy",
      "burnt out",
      "heavy",
      "weary",
      "fatigued",
      "spent",
      "depleted",
      "slow",
    ],
    gradient: ["#020617", "#111827", "#334155", "#6d5d86", "#1e293b"],
    accentColor: "#c4b5fd",
    textColor: "#eef2ff",
    effect: "blur",
    responseMessage: "Rest is part of the rhythm.",
  },
  {
    id: "curious",
    label: "Curious",
    keywords: [
      "curious",
      "thoughtful",
      "interested",
      "wondering",
      "intrigued",
      "reflective",
      "questioning",
      "fascinated",
      "exploring",
    ],
    gradient: ["#020617", "#1d4ed8", "#4f46e5", "#7c3aed", "#22d3ee"],
    accentColor: "#38bdf8",
    textColor: "#eff6ff",
    effect: "orbit",
    responseMessage: "Something in you is reaching outward.",
  },
  {
    id: "confident",
    label: "Confident",
    keywords: [
      "confident",
      "strong",
      "brave",
      "powerful",
      "proud",
      "capable",
      "focused",
      "determined",
      "secure",
      "bold",
    ],
    gradient: ["#031712", "#0f766e", "#14b8a6", "#facc15", "#020617"],
    accentColor: "#facc15",
    textColor: "#f8fafc",
    effect: "rays",
    responseMessage: "You're taking up space beautifully.",
  },
  {
    id: "neutral",
    label: "Neutral",
    keywords: ["okay", "fine", "meh", "neutral", "normal", "unsure", "blank", "steady", "uncertain", "mixed"],
    gradient: ["#030712", "#1f2937", "#475569", "#64748b", "#111827"],
    accentColor: "#cbd5e1",
    textColor: "#f8fafc",
    effect: "drift",
    responseMessage: "Neutral is still a feeling.",
  },
];

export const neutralEmotion = emotions.find((emotion) => emotion.id === "neutral")!;
