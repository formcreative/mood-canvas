import { motion, useReducedMotion } from "framer-motion";
import { type FormEvent, type KeyboardEvent, useState } from "react";

const feelingSuggestions = [
  "I feel peaceful",
  "I feel grounded",
  "I feel content",
  "I feel grateful",
  "I am on fire",
  "I feel lonely",
  "I feel so sad",
  "I feel like crying",
  "I feel heartbroken",
  "I feel overwhelmed",
  "I feel restless",
  "I feel furious",
  "I feel rage",
  "I feel blazing",
  "I feel tender",
  "I feel connected",
  "I feel in love",
  "I feel loved",
  "I feel sexy",
  "I feel sensual",
  "I feel magnetic",
  "I feel desirable",
  "I feel flirty",
  "I feel sweet",
  "I feel candy",
  "I feel adorable",
  "I feel motherhood",
  "I feel maternal",
  "I feel nurturing",
  "I feel protective",
  "I feel held",
  "I feel inspired",
  "I feel energetic",
  "I feel electric",
  "I feel charged",
  "I feel motivated",
  "I feel encouraged",
  "I feel burnt out",
  "I feel depleted",
  "I feel reflective",
  "I feel fascinated",
  "I feel determined",
  "I feel secure",
  "I feel mixed",
  "I feel uncertain",
  "I feel nostalgic",
  "I feel playful",
  "I feel brave",
];

interface MoodInputProps {
  accentColor: string;
  onSubmit: (value: string) => void;
}

export function MoodInput({ accentColor, onSubmit }: MoodInputProps) {
  const [value, setValue] = useState("");
  const shouldReduceMotion = useReducedMotion();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(value);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;

    event.preventDefault();
    onSubmit(value);
  }

  return (
    <motion.form
      aria-label="Mood entry"
      className="mood-input"
      onSubmit={handleSubmit}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <input
        aria-label="Describe how you are feeling"
        autoComplete="off"
        enterKeyHint="send"
        list="feeling-suggestions"
        value={value}
        onKeyDown={handleInputKeyDown}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Try: I feel peaceful..."
        spellCheck="true"
      />
      <datalist id="feeling-suggestions">
        {feelingSuggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
      <button
        type="submit"
        style={{ backgroundColor: accentColor, boxShadow: `0 16px 36px ${accentColor}44` }}
      >
        Send
      </button>
    </motion.form>
  );
}
