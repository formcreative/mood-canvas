export const PROFILE_STORAGE_KEY = "mood-canvas-profile";
export const PROFILE_UPDATED_EVENT = "mood-canvas-profile-updated";

export interface UserProfile {
  consentVersion?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  privacyConsentAt?: string;
  updatedAt: string;
}

export function readProfile(): UserProfile | null {
  try {
    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!storedProfile) return null;

    const parsedProfile = JSON.parse(storedProfile);
    const hasRequiredFields =
      parsedProfile &&
      typeof parsedProfile.firstName === "string" &&
      typeof parsedProfile.lastName === "string" &&
      typeof parsedProfile.email === "string" &&
      typeof parsedProfile.dateOfBirth === "string";

    return hasRequiredFields ? parsedProfile as UserProfile : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Omit<UserProfile, "updatedAt">) {
  const nextProfile: UserProfile = {
    ...profile,
    consentVersion: profile.consentVersion ?? "privacy-consent-v1",
    dateOfBirth: profile.dateOfBirth.trim(),
    email: profile.email.trim().toLowerCase(),
    firstName: profile.firstName.trim(),
    lastName: profile.lastName.trim(),
    privacyConsentAt: profile.privacyConsentAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: nextProfile }));

  return nextProfile;
}

export function clearProfile() {
  window.localStorage.removeItem(PROFILE_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: null }));
}

export function getProfileName(profile: UserProfile | null) {
  if (!profile) return "there";

  return [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.email;
}
