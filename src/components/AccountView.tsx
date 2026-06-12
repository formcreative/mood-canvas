import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, type FormEvent } from "react";
import { clearProfile, getProfileName, saveProfile, type UserProfile } from "../data/profile";

interface AccountViewProps {
  accentColor: string;
  diaryCount: number;
  onProfileChange: (profile: UserProfile | null) => void;
  profile: UserProfile | null;
}

function getInitialForm(profile: UserProfile | null) {
  return {
    dateOfBirth: profile?.dateOfBirth ?? "",
    email: profile?.email ?? "",
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
  };
}

function getZodiacName(dateOfBirth: string) {
  const [, month, day] = dateOfBirth.split("-").map(Number);
  if (!month || !day) return "Add a birthday";

  const monthDay = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (monthDay >= "12-22" || monthDay <= "01-19") return "Capricorn";
  if (monthDay >= "11-22") return "Sagittarius";
  if (monthDay >= "10-23") return "Scorpio";
  if (monthDay >= "09-23") return "Libra";
  if (monthDay >= "08-23") return "Virgo";
  if (monthDay >= "07-23") return "Leo";
  if (monthDay >= "06-21") return "Cancer";
  if (monthDay >= "05-21") return "Gemini";
  if (monthDay >= "04-20") return "Taurus";
  if (monthDay >= "03-21") return "Aries";
  if (monthDay >= "02-19") return "Pisces";

  return "Aquarius";
}

export function AccountView({ accentColor, diaryCount, onProfileChange, profile }: AccountViewProps) {
  const [form, setForm] = useState(() => getInitialForm(profile));
  const [status, setStatus] = useState(profile ? "Profile ready" : "Create your local profile");
  const shouldReduceMotion = useReducedMotion();
  const displayName = getProfileName(profile);
  const zodiacName = useMemo(() => getZodiacName(form.dateOfBirth), [form.dateOfBirth]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextProfile = saveProfile(form);
    onProfileChange(nextProfile);
    setStatus("Saved. Your diary and horoscope now use this profile.");
  }

  function handleSignOut() {
    clearProfile();
    onProfileChange(null);
    setForm(getInitialForm(null));
    setStatus("Signed out of this browser.");
  }

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="account-shell"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
    >
      <div className="account-heading">
        <p className="account-kicker">Private profile</p>
        <h1>{profile ? `Welcome, ${profile.firstName}` : "Create your Mood Canvas profile"}</h1>
        <p>
          Save your name, email, birthday, diary, and horoscope setup in one place. This preview stores your profile in
          this browser until real account login is connected.
        </p>
      </div>

      <div className="account-workspace">
        <form className="account-form-panel" onSubmit={handleSubmit}>
          <span className="account-badge" style={{ color: accentColor }}>
            {profile ? "Signed in locally" : "Local login preview"}
          </span>
          <h2>Profile details</h2>

          <div className="account-form-grid">
            <label>
              First name
              <input
                autoComplete="given-name"
                onChange={(event) => updateField("firstName", event.target.value)}
                required
                type="text"
                value={form.firstName}
              />
            </label>
            <label>
              Last name
              <input
                autoComplete="family-name"
                onChange={(event) => updateField("lastName", event.target.value)}
                required
                type="text"
                value={form.lastName}
              />
            </label>
            <label>
              Email
              <input
                autoComplete="email"
                onChange={(event) => updateField("email", event.target.value)}
                required
                type="email"
                value={form.email}
              />
            </label>
            <label>
              Date of birth
              <input
                autoComplete="bday"
                onChange={(event) => updateField("dateOfBirth", event.target.value)}
                required
                type="date"
                value={form.dateOfBirth}
              />
            </label>
          </div>

          <div className="account-actions">
            <button className="account-primary-button" type="submit">
              Save profile
            </button>
            {profile ? (
              <button className="account-secondary-button" onClick={handleSignOut} type="button">
                Sign out
              </button>
            ) : null}
          </div>

          <p className="account-status" role="status">
            {status}
          </p>
        </form>

        <section className="account-summary-panel" aria-label="Saved account overview">
          <div className="account-summary-card large">
            <small>Profile</small>
            <strong>{profile ? displayName : "Not saved yet"}</strong>
            <span>{profile?.email ?? "Add an email before payment is enabled."}</span>
          </div>

          <div className="account-summary-grid">
            <article>
              <small>Diary days</small>
              <strong>{diaryCount}</strong>
              <span>{diaryCount === 1 ? "saved entry" : "saved entries"}</span>
            </article>
            <article>
              <small>Horoscope</small>
              <strong>{zodiacName}</strong>
              <span>based on date of birth</span>
            </article>
          </div>

          <p>
            When payments and real login are turned on, this same profile can be used to unlock unlimited feelings,
            save diary history, and personalize daily horoscope readings across devices.
          </p>
        </section>
      </div>
    </motion.section>
  );
}
