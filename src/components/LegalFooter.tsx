import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type LegalSectionId = "disclaimer" | "privacy" | "terms";

const legalSections: Record<LegalSectionId, { label: string; title: string; body: string[] }> = {
  disclaimer: {
    label: "Disclaimer",
    title: "Voluntary Use & Disclaimer",
    body: [
      "Mood Canvas is a reflection, color, diary, and entertainment experience. It is not medical, mental health, legal, financial, emergency, or professional advice.",
      "You choose voluntarily what to type, save, speak, download, or use. Mood Canvas cannot be responsible for decisions, actions, outcomes, or interpretations based on the app experience.",
      "If you feel unsafe or need urgent support, contact local emergency services or a qualified professional right away.",
    ],
  },
  privacy: {
    label: "Privacy",
    title: "Privacy Summary",
    body: [
      "This preview stores profile details, diary entries, mood prompts, and horoscope birthday details in this browser. Future account and payment features may require secure server-side storage.",
      "Voice diary starts only when you tap the microphone. Your browser may request microphone access and speech recognition may process what you say to create text. Mood Canvas saves the transcript, not a raw audio recording.",
      "Do not enter information you are not comfortable saving in this app experience.",
    ],
  },
  terms: {
    label: "Terms",
    title: "Terms of Use",
    body: [
      "By using Mood Canvas, you agree to use it at your own discretion and understand that the app is provided as-is.",
      "Mood colors, horoscopes, diary prompts, wallpapers, and responses are expressive tools, not guarantees or professional guidance.",
      "You are responsible for manually setting any downloaded wallpaper on your device. Mood Canvas cannot directly change your system wallpaper.",
    ],
  },
};

export function LegalFooter() {
  const [activeSectionId, setActiveSectionId] = useState<LegalSectionId | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const activeSection = activeSectionId ? legalSections[activeSectionId] : null;

  function toggleSection(sectionId: LegalSectionId) {
    setActiveSectionId((currentSectionId) => (currentSectionId === sectionId ? null : sectionId));
  }

  return (
    <footer className="legal-footer" aria-label="Legal information">
      <p>
        By using Mood Canvas, you voluntarily agree to the app's privacy, terms, and disclaimer notices.
      </p>
      <nav aria-label="Legal links">
        {(Object.keys(legalSections) as LegalSectionId[]).map((sectionId) => (
          <button
            aria-expanded={activeSectionId === sectionId}
            aria-controls="legal-footer-panel"
            key={sectionId}
            onClick={() => toggleSection(sectionId)}
            type="button"
          >
            {legalSections[sectionId].label}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {activeSection ? (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className="legal-footer-panel"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            id="legal-footer-panel"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            key={activeSectionId}
            transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" }}
          >
            <div>
              <h2>{activeSection.title}</h2>
              {activeSection.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <button aria-label="Close legal details" onClick={() => setActiveSectionId(null)} type="button">
              Close
            </button>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </footer>
  );
}
