import {
  collection, doc, getDoc, onSnapshot, runTransaction, serverTimestamp,
  type Firestore, type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { players } from "@/data/players";

const VOTES_COLLECTION = "votes";
const candidateIds = new Set(players.map((player) => player.id));
const voterIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ExistingVote = { candidateId: string; voterId: string };
export type CandidateVotes = { candidateId: string; votes: number; percentage: number };
export type VoteTotals = { totalVotes: number; candidates: CandidateVotes[] };
export const emptyVoteTotals = (): VoteTotals => ({ totalVotes: 0, candidates: players.map(({ id }) => ({ candidateId: id, votes: 0, percentage: 0 })) });

function requireDb(): Firestore {
  if (!db) throw new Error("Live voting is currently unavailable.");
  return db;
}

function validVote(candidateId: unknown, voterId: unknown): candidateId is string {
  return typeof candidateId === "string" && candidateIds.has(candidateId)
    && typeof voterId === "string" && voterIdPattern.test(voterId);
}

export async function getExistingVote(voterId: string): Promise<ExistingVote | null> {
  const database = requireDb();
  const snapshot = await getDoc(doc(database, VOTES_COLLECTION, voterId));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  if (!validVote(data.candidateId, data.voterId) || data.voterId !== voterId) {
    throw new Error("The stored ballot could not be validated.");
  }
  return { candidateId: data.candidateId, voterId };
}

export async function submitVote(candidateId: string, voterId: string): Promise<ExistingVote> {
  if (!validVote(candidateId, voterId)) throw new Error("Choose one of the listed candidates to vote.");
  const database = requireDb();
  const voteRef = doc(database, VOTES_COLLECTION, voterId);
  return runTransaction(database, async (transaction) => {
    const existing = await transaction.get(voteRef);
    if (existing.exists()) {
      const data = existing.data();
      if (!validVote(data.candidateId, data.voterId) || data.voterId !== voterId) throw new Error("The stored ballot could not be validated.");
      return { candidateId: data.candidateId, voterId };
    }
    transaction.set(voteRef, { candidateId, voterId, createdAt: serverTimestamp() });
    return { candidateId, voterId };
  });
}

function summarizeVotes(database: Firestore, onUpdate: (totals: VoteTotals) => void, onError?: (error: Error) => void): Unsubscribe {
  return onSnapshot(collection(database, VOTES_COLLECTION), (snapshot) => {
    const counts = new Map(players.map(({ id }) => [id, 0]));
    snapshot.forEach((vote) => {
      const candidateId = vote.data().candidateId;
      if (typeof candidateId === "string" && counts.has(candidateId)) counts.set(candidateId, (counts.get(candidateId) ?? 0) + 1);
    });
    const totalVotes = [...counts.values()].reduce((sum, count) => sum + count, 0);
    const candidates = [...counts.entries()]
      .map(([candidateId, votes]) => ({ candidateId, votes, percentage: totalVotes ? (votes / totalVotes) * 100 : 0 }))
      .sort((a, b) => b.votes - a.votes || players.findIndex((p) => p.id === a.candidateId) - players.findIndex((p) => p.id === b.candidateId));
    onUpdate({ totalVotes, candidates });
  }, (error) => onError?.(error));
}

export function subscribeToResults(onUpdate: (totals: VoteTotals) => void, onError?: (error: Error) => void): Unsubscribe {
  return summarizeVotes(requireDb(), onUpdate, onError);
}
