import { emotions, neutralEmotion, type Emotion } from "../data/emotions";
import { vocabularyBoosts } from "../data/vocabularyBoosts";

const generatedEffects = ["waves", "sparkles", "hearts", "candy", "rise", "orbit", "drift"] as const;

function normalizeInput(input: string) {
  return input
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordPattern(keyword: string) {
  const normalizedKeyword = normalizeInput(keyword);
  const flexibleKeyword = normalizedKeyword.split(" ").map(escapeRegExp).join("\\s+");

  return new RegExp(`(^|[^a-z0-9])${flexibleKeyword}($|[^a-z0-9])`);
}

function hashString(value: string) {
  return Array.from(value).reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
  const secondary = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const match = lightness - chroma / 2;
  const [red, green, blue] =
    huePrime < 1
      ? [chroma, secondary, 0]
      : huePrime < 2
        ? [secondary, chroma, 0]
        : huePrime < 3
          ? [0, chroma, secondary]
          : huePrime < 4
            ? [0, secondary, chroma]
            : huePrime < 5
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];

  return [red, green, blue]
    .map((channel) =>
      Math.round((channel + match) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .replace(/^/, "#");
}

function getFeelingLabel(input: string) {
  const label = normalizeInput(input)
    .replace(/^(i feel|i am|im|feeling|feel)\s+/, "")
    .slice(0, 28)
    .trim();

  return label ? label.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Custom Mood";
}

function generateCustomEmotion(input: string): Emotion {
  const normalized = normalizeInput(input);
  const hash = hashString(normalized);
  const hue = hash % 360;
  const secondHue = (hue + 34 + (hash % 40)) % 360;
  const thirdHue = (hue + 196 + (hash % 32)) % 360;

  return {
    id: "custom",
    label: getFeelingLabel(input),
    keywords: [],
    gradient: [
      hslToHex(hue, 0.64, 0.13),
      hslToHex(hue, 0.68, 0.34),
      hslToHex(secondHue, 0.72, 0.55),
      hslToHex(thirdHue, 0.58, 0.48),
      hslToHex((hue + 20) % 360, 0.56, 0.1),
    ],
    accentColor: hslToHex(secondHue, 0.82, 0.66),
    textColor: "#fffaf7",
    effect: generatedEffects[hash % generatedEffects.length],
    responseMessage: "I made a color for that feeling. Stay with it for a moment.",
  };
}

export function detectEmotion(input: string): Emotion {
  const normalized = normalizeInput(input);

  if (!normalized) {
    return neutralEmotion;
  }

  for (const boost of vocabularyBoosts) {
    const hasBoostedPhrase = boost.phrases.some((phrase) => keywordPattern(phrase).test(normalized));

    if (hasBoostedPhrase) {
      return emotions.find((emotion) => emotion.id === boost.emotionId) ?? neutralEmotion;
    }
  }

  let bestMatch: { emotion: Emotion; score: number } | undefined;

  for (const emotion of emotions) {
    const score = emotion.keywords.reduce((total, keyword) => {
      const matches = keywordPattern(keyword).test(normalized);
      const specificity = normalizeInput(keyword).includes(" ") ? 2 : 1;

      return matches ? total + specificity : total;
    }, 0);

    if (score > (bestMatch?.score ?? 0)) {
      bestMatch = { emotion, score };
    }
  }

  return bestMatch?.emotion ?? generateCustomEmotion(input);
}
