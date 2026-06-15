import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AccountView } from "./components/AccountView";
import { DiaryView } from "./components/DiaryView";
import { EmotionChips } from "./components/EmotionChips";
import { HoroscopeView } from "./components/HoroscopeView";
import { LegalFooter } from "./components/LegalFooter";
import { MoodBackground } from "./components/MoodBackground";
import { MoodInput } from "./components/MoodInput";
import { WallpaperButton } from "./components/WallpaperButton";
import { emotions, neutralEmotion, type Emotion } from "./data/emotions";
import { PROFILE_UPDATED_EVENT, readProfile, type UserProfile } from "./data/profile";
import { detectEmotion } from "./utils/detectEmotion";

const DIARY_STORAGE_KEY = "mood-canvas-diary-entries";

type AppView = "mood" | "diary" | "horoscope" | "account";

function getDiaryCount() {
  try {
    const storedEntries = window.localStorage.getItem(DIARY_STORAGE_KEY);
    if (!storedEntries) return 0;

    const entries = JSON.parse(storedEntries);
    if (!entries || typeof entries !== "object") return 0;

    return Object.values(entries).filter((entry) => typeof entry === "string" && entry.trim()).length;
  } catch {
    return 0;
  }
}

function App() {
  const [activeView, setActiveView] = useState<AppView>("mood");
  const [diaryCount, setDiaryCount] = useState(() => getDiaryCount());
  const [profile, setProfile] = useState<UserProfile | null>(() => readProfile());
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion>(neutralEmotion);
  const [lastSubmitted, setLastSubmitted] = useState("okay");
  const shouldReduceMotion = useReducedMotion();

  const responseKey = useMemo(
    () => `${selectedEmotion.id}-${lastSubmitted}`,
    [lastSubmitted, selectedEmotion.id],
  );

  useEffect(() => {
    function handleProfileUpdate() {
      setProfile(readProfile());
    }

    function handleDiaryUpdate() {
      setDiaryCount(getDiaryCount());
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
    window.addEventListener("storage", handleProfileUpdate);
    window.addEventListener("storage", handleDiaryUpdate);
    window.addEventListener("mood-canvas-diary-updated", handleDiaryUpdate);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
      window.removeEventListener("storage", handleProfileUpdate);
      window.removeEventListener("storage", handleDiaryUpdate);
      window.removeEventListener("mood-canvas-diary-updated", handleDiaryUpdate);
    };
  }, []);

  function handleMoodSubmit(value: string) {
    const nextEmotion = detectEmotion(value);
    setSelectedEmotion(nextEmotion);
    setLastSubmitted(value.trim() || nextEmotion.label.toLowerCase());
  }

  function handleChipSelect(emotion: Emotion) {
    setSelectedEmotion(emotion);
    setLastSubmitted(emotion.label.toLowerCase());
  }

  return (
    <main className={`app app-${activeView}`} style={{ color: selectedEmotion.textColor }}>
      <MoodBackground emotion={selectedEmotion} />
      <nav aria-label="Main menu" className="app-menu">
        <button aria-pressed={activeView === "mood"} onClick={() => setActiveView("mood")} type="button">
          Mood
        </button>
        <button aria-pressed={activeView === "diary"} onClick={() => setActiveView("diary")} type="button">
          Diary
        </button>
        <button aria-pressed={activeView === "horoscope"} onClick={() => setActiveView("horoscope")} type="button">
          Horoscope
        </button>
      </nav>
      <button
        aria-label={profile ? "Open your profile" : "Create your profile"}
        aria-pressed={activeView === "account"}
        className="profile-bubble"
        onClick={() => setActiveView("account")}
        title={profile ? "Open your profile" : "Create your profile"}
        type="button"
      >
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M12 12.25c2.14 0 3.88-1.74 3.88-3.88S14.14 4.5 12 4.5 8.12 6.23 8.12 8.37 9.86 12.25 12 12.25Z" />
          <path d="M5.85 19.5c.78-3 3.07-4.63 6.15-4.63s5.37 1.63 6.15 4.63" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        {activeView === "mood" ? (
          <motion.section
            className="content-shell"
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
            key="mood"
            transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: "easeOut" }}
          >
            <motion.p
              className="eyebrow"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 0.82, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.7 }}
            >
              Mood Palette
            </motion.p>
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.8,
                delay: shouldReduceMotion ? 0 : 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              How are you feeling today?
            </motion.h1>
            <MoodInput accentColor={selectedEmotion.accentColor} onSubmit={handleMoodSubmit} />
            <AnimatePresence mode="wait">
              <motion.p
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="response-message"
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(5px)" }}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(5px)" }}
                key={responseKey}
                role="status"
                transition={{ duration: shouldReduceMotion ? 0 : 0.42, ease: "easeOut" }}
              >
                {selectedEmotion.responseMessage}
              </motion.p>
            </AnimatePresence>
            <EmotionChips emotions={emotions} onSelect={handleChipSelect} selectedId={selectedEmotion.id} />
            <div className="wallpaper-panel">
              <WallpaperButton emotion={selectedEmotion} />
              <p>Save this mood as a wallpaper and let your phone reflect how you feel.</p>
            </div>
          </motion.section>
        ) : activeView === "diary" ? (
          <DiaryView accentColor={selectedEmotion.accentColor} key="diary" profile={profile} />
        ) : activeView === "horoscope" ? (
          <HoroscopeView
            accentColor={selectedEmotion.accentColor}
            key="horoscope"
            onOpenAccount={() => setActiveView("account")}
            profile={profile}
          />
        ) : (
          <AccountView
            accentColor={selectedEmotion.accentColor}
            diaryCount={diaryCount}
            key="account"
            onProfileChange={setProfile}
            profile={profile}
          />
        )}
      </AnimatePresence>
      <LegalFooter />
    </main>
  );
}

export default App;
