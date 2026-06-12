import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { getProfileName, type UserProfile } from "../data/profile";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
});

const birthdayFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
});

const zodiacSigns = [
  { name: "Capricorn", start: "12-22", element: "Earth", color: "#d6c4a2" },
  { name: "Aquarius", start: "01-20", element: "Air", color: "#93c5fd" },
  { name: "Pisces", start: "02-19", element: "Water", color: "#a78bfa" },
  { name: "Aries", start: "03-21", element: "Fire", color: "#fb7185" },
  { name: "Taurus", start: "04-20", element: "Earth", color: "#86efac" },
  { name: "Gemini", start: "05-21", element: "Air", color: "#fde047" },
  { name: "Cancer", start: "06-21", element: "Water", color: "#7dd3fc" },
  { name: "Leo", start: "07-23", element: "Fire", color: "#fb923c" },
  { name: "Virgo", start: "08-23", element: "Earth", color: "#bef264" },
  { name: "Libra", start: "09-23", element: "Air", color: "#f0abfc" },
  { name: "Scorpio", start: "10-23", element: "Water", color: "#c084fc" },
  { name: "Sagittarius", start: "11-22", element: "Fire", color: "#fbbf24" },
];

const readingThemes = [
  {
    focus: "Protect your attention",
    reading: "Today wants fewer open tabs in your mind. Choose the one feeling asking for care and let everything else soften around it.",
    ritual: "Write one sentence you do not want to carry into tomorrow.",
    mantra: "I can move slowly and still move forward.",
  },
  {
    focus: "Let the honest thing breathe",
    reading: "A truth is trying to become less heavy by being named. You do not need a dramatic reveal; you only need one clean moment of honesty.",
    ritual: "Send the message, make the note, or say the quiet part to yourself first.",
    mantra: "My clarity can be gentle.",
  },
  {
    focus: "Follow the warm signal",
    reading: "Your energy is more intelligent than your schedule today. Notice what gives you a small spark, then build the day around that signal.",
    ritual: "Put one beautiful thing where you will keep seeing it.",
    mantra: "I am allowed to be guided by aliveness.",
  },
  {
    focus: "Return to your body",
    reading: "The mind may try to solve what the body simply wants to feel. Ground first, decide second, and let your nervous system catch up.",
    ritual: "Take three slow breaths before your next yes or no.",
    mantra: "I do not have to rush my own becoming.",
  },
  {
    focus: "Receive without shrinking",
    reading: "Something supportive may arrive through a person, a pause, or a softer plan. Let help count, even when it looks simple.",
    ritual: "Accept one small kindness without explaining it away.",
    mantra: "I can be held without losing myself.",
  },
  {
    focus: "Make it tangible",
    reading: "A feeling becomes easier to trust when it has shape. Put the idea somewhere real: a list, a sketch, a note, a calendar block.",
    ritual: "Turn one thought into one visible object.",
    mantra: "My inner world deserves a place to land.",
  },
];

interface HoroscopeViewProps {
  accentColor: string;
  onOpenAccount: () => void;
  profile: UserProfile | null;
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getZodiacSign(birthday: string) {
  const [, month, day] = birthday.split("-").map(Number);
  if (!month || !day) return null;

  const monthDay = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const capricorn = zodiacSigns[0];
  if (monthDay >= capricorn.start || monthDay <= "01-19") return capricorn;

  let sign = capricorn;

  for (const zodiacSign of zodiacSigns.slice(1)) {
    if (monthDay >= zodiacSign.start) {
      sign = zodiacSign;
    }
  }

  return sign;
}

function hashText(value: string) {
  return [...value].reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) % 9973;
  }, 17);
}

function getDailyReading(birthday: string, date: Date) {
  const sign = getZodiacSign(birthday);
  if (!sign) return null;

  const theme = readingThemes[hashText(`${birthday}-${getDateKey(date)}-${sign.name}`) % readingThemes.length];

  return { sign, theme };
}

export function HoroscopeView({ accentColor, onOpenAccount, profile }: HoroscopeViewProps) {
  const today = useMemo(() => new Date(), []);
  const birthday = profile?.dateOfBirth ?? "";
  const shouldReduceMotion = useReducedMotion();
  const reading = useMemo(() => getDailyReading(birthday, today), [birthday, today]);
  const birthdayDate = birthday ? new Date(`${birthday}T12:00:00`) : null;

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="horoscope-shell"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
    >
      <div className="horoscope-orb" style={{ background: accentColor }} />

      <div className="horoscope-heading">
        <p className="horoscope-kicker">Premium daily reading</p>
        <h1>Your horoscope for {dateFormatter.format(today)}</h1>
        <p>
          A personalized daily ritual based on your saved profile. Account login and paid access are paused for now
          while we shape the experience.
        </p>
      </div>

      <div className="horoscope-workspace">
        <section className="horoscope-profile-panel">
          <span className="premium-badge">Paid preview</span>
          <h2>Birth profile</h2>
          <div className="horoscope-profile-summary">
            <small>Saved account</small>
            <strong>{profile ? getProfileName(profile) : "No profile yet"}</strong>
            <span>{profile?.email ?? "Add your account details to personalize this."}</span>
          </div>
          <button className="birthday-save-button" onClick={onOpenAccount} type="button">
            {profile ? "Edit profile" : "Create account profile"}
          </button>
          <p id="birthday-note">
            Your date of birth now lives in Account so horoscope readings and payment details use the same profile.
          </p>

          {reading ? (
            <div className="sign-card" style={{ borderColor: reading.sign.color }}>
              <small>Your sign</small>
              <strong>{reading.sign.name}</strong>
              <span>{reading.sign.element} energy</span>
              {birthdayDate ? <em>Born {birthdayFormatter.format(birthdayDate)}</em> : null}
            </div>
          ) : (
            <div className="sign-card empty">
              <small>Set your birthday</small>
              <strong>Your sign appears here</strong>
              <span>The reading will update immediately.</span>
            </div>
          )}
        </section>

        <section className="horoscope-reading-panel">
          {reading ? (
            <>
              <div className="horoscope-reading-header">
                <div>
                  <p>{reading.sign.name} today</p>
                  <h2>{reading.theme.focus}</h2>
                </div>
                <span style={{ color: reading.sign.color }}>Daily</span>
              </div>

              <p className="reading-copy">{reading.theme.reading}</p>

              <div className="reading-grid">
                <article>
                  <small>Ritual</small>
                  <p>{reading.theme.ritual}</p>
                </article>
                <article>
                  <small>Mantra</small>
                  <p>{reading.theme.mantra}</p>
                </article>
              </div>
            </>
          ) : (
            <div className="horoscope-empty-state">
              <span style={{ background: accentColor }} />
              <h2>Create your profile to unlock the preview reading.</h2>
              <p>
                Add your first name, last name, email, and date of birth in Account. This will become the paid member
                space for daily guidance, mood history, and a more personal experience.
              </p>
              <button className="horoscope-empty-button" onClick={onOpenAccount} type="button">
                Go to Account
              </button>
            </div>
          )}
        </section>
      </div>
    </motion.section>
  );
}
