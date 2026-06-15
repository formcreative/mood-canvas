import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { getProfileName, type UserProfile } from "../data/profile";

const DIARY_STORAGE_KEY = "mood-canvas-diary-entries";
const DIARY_UPDATED_EVENT = "mood-canvas-diary-updated";
const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
const todayFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});
const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DiaryEntries = Record<string, string>;
type SpeechRecognitionError = "aborted" | "audio-capture" | "network" | "not-allowed" | "no-speech" | "service-not-allowed";

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  readonly [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  readonly error: SpeechRecognitionError | string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  abort: () => void;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function readEntries() {
  try {
    const storedEntries = window.localStorage.getItem(DIARY_STORAGE_KEY);
    if (!storedEntries) return {};

    const parsedEntries = JSON.parse(storedEntries);
    return parsedEntries && typeof parsedEntries === "object" ? parsedEntries as DiaryEntries : {};
  } catch {
    return {};
  }
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null;

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function MicrophoneIcon() {
  return (
    <svg aria-hidden="true" className="diary-microphone-icon" fill="none" viewBox="0 0 24 24">
      <path d="M12 14.75c1.93 0 3.5-1.57 3.5-3.5V6.5a3.5 3.5 0 0 0-7 0v4.75c0 1.93 1.57 3.5 3.5 3.5Z" />
      <path d="M18.25 10.75a6.25 6.25 0 0 1-12.5 0" />
      <path d="M12 17v3.25" />
      <path d="M8.75 20.25h6.5" />
    </svg>
  );
}

interface DiaryViewProps {
  accentColor: string;
  profile: UserProfile | null;
}

export function DiaryView({ accentColor, profile }: DiaryViewProps) {
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => getDateKey(today), [today]);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => today);
  const [entries, setEntries] = useState<DiaryEntries>(() => readEntries());
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState("Tap the microphone and speak your diary entry.");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const selectedKeyRef = useRef("");
  const selectedKey = getDateKey(selectedDate);
  const selectedEntry = entries[selectedKey] ?? "";
  const speechRecognitionSupported = Boolean(getSpeechRecognitionConstructor());
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    selectedKeyRef.current = selectedKey;
  }, [selectedKey]);

  useEffect(() => {
    window.localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(entries));
    window.dispatchEvent(new CustomEvent(DIARY_UPDATED_EVENT));
  }, [entries]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(visibleMonth);
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
    const emptyDays = Array.from({ length: firstDay }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, index) => {
      return new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1);
    });

    return [...emptyDays, ...days];
  }, [visibleMonth]);

  function changeMonth(direction: -1 | 1) {
    setVisibleMonth((currentMonth) => {
      return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1);
    });
  }

  function selectToday() {
    setSelectedDate(today);
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function updateEntry(value: string) {
    setEntries((currentEntries) => {
      const nextEntries = { ...currentEntries };

      if (value.trim()) {
        nextEntries[selectedKey] = value;
      } else {
        delete nextEntries[selectedKey];
      }

      return nextEntries;
    });
  }

  function appendTranscript(value: string) {
    const transcript = value.trim();
    if (!transcript) return;

    setEntries((currentEntries) => {
      const dateKey = selectedKeyRef.current;
      const currentEntry = currentEntries[dateKey] ?? "";
      const separator = currentEntry && !/\s$/.test(currentEntry) ? " " : "";

      return {
        ...currentEntries,
        [dateKey]: `${currentEntry}${separator}${transcript}`,
      };
    });
  }

  function stopDictation() {
    recognitionRef.current?.stop();
    setInterimTranscript("");
    setSpeechStatus("Dictation paused. Tap the microphone to continue.");
    setIsListening(false);
  }

  function startDictation() {
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setSpeechStatus("Voice dictation is not supported in this browser yet. You can still type your entry.");
      return;
    }

    recognitionRef.current?.abort();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechStatus("Listening... speak naturally. Tap Stop when you are done.");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let nextInterimTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? "";

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          nextInterimTranscript += transcript;
        }
      }

      appendTranscript(finalTranscript);
      setInterimTranscript(nextInterimTranscript.trim());
    };

    recognition.onerror = (event) => {
      const message =
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Microphone access was blocked. Allow microphone access in your browser to use voice diary."
          : "Dictation stopped. You can tap the microphone and try again.";

      setSpeechStatus(message);
      setInterimTranscript("");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    try {
      recognition.start();
    } catch {
      setSpeechStatus("Dictation is already starting. Give it a second and try again.");
    }
  }

  function toggleDictation() {
    if (isListening) {
      stopDictation();
      return;
    }

    startDictation();
  }

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="diary-shell"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
    >
      <div className="diary-heading">
        <p className="diary-kicker">{profile ? `${getProfileName(profile)}'s private diary` : "Private daily diary"}</p>
        <h1>{todayFormatter.format(today)}</h1>
      </div>

      <div className="diary-workspace">
        <section aria-label="Diary calendar" className="diary-calendar-panel">
          <div className="diary-calendar-header">
            <button aria-label="Previous month" onClick={() => changeMonth(-1)} type="button">
              Prev
            </button>
            <p>{monthFormatter.format(visibleMonth)}</p>
            <button aria-label="Next month" onClick={() => changeMonth(1)} type="button">
              Next
            </button>
          </div>

          <button className="diary-today-button" onClick={selectToday} style={{ color: accentColor }} type="button">
            Jump to today
          </button>

          <div className="diary-weekdays" aria-hidden="true">
            {weekdayLabels.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="diary-calendar-grid">
            {calendarDays.map((date, index) => {
              if (!date) return <span aria-hidden="true" className="diary-empty-day" key={`empty-${index}`} />;

              const dateKey = getDateKey(date);
              const isSelected = dateKey === selectedKey;
              const isToday = dateKey === todayKey;
              const hasEntry = Boolean(entries[dateKey]?.trim());

              return (
                <button
                  aria-label={`${dayFormatter.format(date)}${hasEntry ? ", has diary entry" : ""}`}
                  aria-pressed={isSelected}
                  className="diary-day"
                  key={dateKey}
                  onClick={() => setSelectedDate(date)}
                  style={isSelected ? { borderColor: accentColor, boxShadow: `0 0 30px ${accentColor}44` } : undefined}
                  type="button"
                >
                  <span>{date.getDate()}</span>
                  {isToday ? <small>Today</small> : null}
                  {hasEntry ? <i aria-hidden="true" style={{ backgroundColor: accentColor }} /> : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="diary-entry-panel">
          <div className="diary-entry-header">
            <div>
              <p>Selected day</p>
              <h2>{dayFormatter.format(selectedDate)}</h2>
            </div>
            <span>{selectedEntry.trim() ? "Saved" : "Empty"}</span>
          </div>

          <div className="diary-entry-field">
            <textarea
              aria-describedby="diary-voice-status diary-voice-note"
              aria-label={`Diary entry for ${dayFormatter.format(selectedDate)}`}
              onChange={(event) => updateEntry(event.target.value)}
              placeholder="Write what happened, what you felt, what you want to remember..."
              value={selectedEntry}
            />
            <button
              aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
              aria-pressed={isListening}
              className="diary-voice-button"
              disabled={!speechRecognitionSupported}
              onClick={toggleDictation}
              style={isListening ? { backgroundColor: accentColor, boxShadow: `0 0 28px ${accentColor}66` } : undefined}
              title={isListening ? "Stop dictation" : "Speak your diary entry"}
              type="button"
            >
              <MicrophoneIcon />
            </button>
          </div>

          <div className="diary-voice-panel">
            <div className="diary-voice-copy">
              <p id="diary-voice-status" role="status">
                {speechStatus}
              </p>
              <small id="diary-voice-note">
                Voice dictation starts only when you tap the microphone. Your browser may ask for microphone access.
              </small>
              {interimTranscript ? <em aria-live="polite">Hearing: {interimTranscript}</em> : null}
            </div>
          </div>

          <p className="diary-save-note">
            {profile
              ? `Entries are saved with ${profile.email} in this browser. Pick any day to read or continue it.`
              : "Entries save privately in this browser. Create an Account profile to keep your diary, birthday, and horoscope together."}
          </p>
        </section>
      </div>
    </motion.section>
  );
}
