import type { EmotionId } from "./emotions";

export interface VocabularyBoost {
  emotionId: EmotionId;
  phrases: string[];
}

export const vocabularyBoosts: VocabularyBoost[] = [
  {
    emotionId: "angry",
    phrases: [
      "on fire",
      "i am on fire",
      "im on fire",
      "feel on fire",
      "bursting in flames",
      "in flames",
      "flames",
      "fire",
      "fiery",
      "blazing",
      "burning up",
      "lit up",
      "heated",
      "worked up",
      "hot headed",
    ],
  },
  {
    emotionId: "sad",
    phrases: [
      "so sad",
      "very sad",
      "really sad",
      "i am so sad",
      "im so sad",
      "feel so sad",
      "crying",
      "cry",
      "tears",
      "teary",
      "weepy",
      "devastated",
      "depressed",
      "miserable",
      "broken",
      "hurting",
    ],
  },
  {
    emotionId: "furious",
    phrases: [
      "seeing red",
      "so mad",
      "so angry",
      "really angry",
      "about to explode",
      "losing it",
      "raging",
      "seething",
      "boiling",
    ],
  },
  {
    emotionId: "love",
    phrases: ["in love", "so in love", "feeling loved", "heart full", "butterflies", "lovestruck", "smitten"],
  },
  {
    emotionId: "energetic",
    phrases: ["fired up", "amped up", "supercharged", "full power", "on a roll", "adrenaline", "high energy"],
  },
  {
    emotionId: "calm",
    phrases: ["at ease", "unbothered", "quiet", "settled", "tranquil", "breathing", "soft day", "slow morning"],
  },
  {
    emotionId: "happy",
    phrases: ["smiling", "blessed", "radiant", "bright", "amazing", "great", "wonderful", "sunny inside"],
  },
  {
    emotionId: "anxious",
    phrases: [
      "spiraling",
      "on edge",
      "too much",
      "can't breathe",
      "cant breathe",
      "tight chest",
      "freaking out",
      "jittery",
    ],
  },
  {
    emotionId: "sweet",
    phrases: ["soft girl", "precious", "sugar", "cupcake", "lovable", "tender sweet", "adorable"],
  },
  {
    emotionId: "excited",
    phrases: ["can't wait", "cant wait", "ready to go", "stoked", "ecstatic", "celebrating", "sparked"],
  },
  {
    emotionId: "hopeful",
    phrases: ["fresh start", "new beginning", "getting better", "looking up", "open heart", "faith", "trusting"],
  },
  {
    emotionId: "tired",
    phrases: ["worn out", "need rest", "need sleep", "running on empty", "burned out", "low energy"],
  },
  {
    emotionId: "curious",
    phrases: ["what if", "open minded", "searching", "discovering", "learning", "mysterious"],
  },
  {
    emotionId: "confident",
    phrases: ["in control", "ready", "winning", "empowered", "fearless", "taking up space"],
  },
  {
    emotionId: "neutral",
    phrases: ["i don't know", "i dont know", "in between", "whatever", "nothing much", "idk"],
  },
];
