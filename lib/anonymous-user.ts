export const VOTER_ID_KEY = "ballondor2026_voter_id";

export function getAnonymousVoterId(): string {
  if (typeof window === "undefined") throw new Error("A browser is required to create an anonymous voter ID.");
  const existing = window.localStorage.getItem(VOTER_ID_KEY) ?? window.localStorage.getItem("ballot-voter");
  if (existing && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing)) {
    window.localStorage.setItem(VOTER_ID_KEY, existing);
    return existing;
  }
  const id = window.crypto.randomUUID();
  window.localStorage.setItem(VOTER_ID_KEY, id);
  return id;
}
