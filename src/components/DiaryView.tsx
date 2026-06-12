import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
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
  const selectedKey = getDateKey(selectedDate);
  const selectedEntry = entries[selectedKey] ?? "";
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(entries));
    window.dispatchEvent(new CustomEvent(DIARY_UPDATED_EVENT));
  }, [entries]);

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

          <textarea
            aria-label={`Diary entry for ${dayFormatter.format(selectedDate)}`}
            onChange={(event) => updateEntry(event.target.value)}
            placeholder="Write what happened, what you felt, what you want to remember..."
            value={selectedEntry}
          />

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
