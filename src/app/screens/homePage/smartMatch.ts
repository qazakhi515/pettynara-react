/**
 * Smart Match — pet matching logic (hard filters + weighted scoring).
 * Runs against a local pet dataset because the backend Product schema
 * does not carry care/allergy/energy attributes.
 */

export type HomeAns = "apartment" | "house";
export type ExpAns = "first" | "experienced";
export type TimeAns = "low" | "enough";
export type AllergyAns = "yes" | "no";
export type EnergyAns = "calm" | "active";

export interface Answers {
  home?: HomeAns;
  exp?: ExpAns;
  time?: TimeAns;
  allergy?: AllergyAns;
  energy?: EnergyAns;
}

interface MatchPet {
  name: string;
  species: string;
  image: string;
  price: number;
  home: "apartment" | "house" | "both";
  timeNeed: "low" | "high";
  care: "easy" | "advanced";
  allergy: "low" | "high"; // allergen / shedding level
  size: "small" | "medium" | "large";
  energy: "calm" | "active";
}

const PETS: MatchPet[] = [
  { name: "Holland Lop Rabbit", species: "Rabbit", image: "/img/home/pet4.webp", price: 700, home: "both", timeNeed: "low", care: "easy", allergy: "low", size: "small", energy: "calm" },
  { name: "Munchkin Cat", species: "Cat", image: "/img/home/pet2.webp", price: 1100, home: "both", timeNeed: "low", care: "easy", allergy: "high", size: "small", energy: "calm" },
  { name: "Cockatiel", species: "Bird", image: "/img/home/pet5.webp", price: 600, home: "both", timeNeed: "low", care: "easy", allergy: "low", size: "small", energy: "active" },
  { name: "Goldfish", species: "Fish", image: "/img/home/fish.webp", price: 200, home: "apartment", timeNeed: "low", care: "easy", allergy: "low", size: "small", energy: "calm" },
  { name: "Pomeranian", species: "Dog", image: "/img/home/pet3.webp", price: 1500, home: "both", timeNeed: "high", care: "easy", allergy: "high", size: "small", energy: "active" },
  { name: "Ragdoll Cat", species: "Cat", image: "/img/home/cats.webp", price: 1200, home: "both", timeNeed: "low", care: "easy", allergy: "high", size: "medium", energy: "calm" },
  { name: "Shiba Inu", species: "Dog", image: "/img/home/dogs.webp", price: 1600, home: "house", timeNeed: "high", care: "advanced", allergy: "high", size: "medium", energy: "active" },
  { name: "Golden Retriever", species: "Dog", image: "/img/home/pet1.webp", price: 1800, home: "house", timeNeed: "high", care: "advanced", allergy: "high", size: "large", energy: "active" },
];

export interface MatchResult {
  name: string;
  species: string;
  image: string;
  price: number;
  score: number; // 0..100
  label: string;
  reasons: string[];
  cautions: string[];
}

function label(score: number): string {
  if (score >= 88) return "Perfect Match";
  if (score >= 74) return "Great Match";
  if (score >= 58) return "Good Match";
  return "Possible Match";
}

// hard filters — remove pets that clearly do not fit
function passesFilters(pet: MatchPet, a: Answers): boolean {
  if (a.allergy === "yes" && pet.allergy === "high") return false;
  if (a.time === "low" && pet.timeNeed === "high") return false;
  if (a.exp === "first" && pet.care === "advanced") return false;
  if (
    a.home === "apartment" &&
    pet.home === "house" &&
    !(pet.size === "small" || pet.energy === "calm")
  )
    return false;
  return true;
}

function scorePet(pet: MatchPet, a: Answers): MatchResult {
  let score = 0;
  const reasons: string[] = [];
  const cautions: string[] = [];

  // +30 home fit
  const apartmentOk = pet.home !== "house" || pet.size === "small";
  if (a.home === "apartment" && apartmentOk) {
    score += 30;
    reasons.push("Great for apartment living");
  } else if (a.home === "house") {
    score += 30;
    reasons.push("Loves a home with space");
  }

  // +25 time fit
  if (a.time === "enough" || pet.timeNeed === "low") {
    score += 25;
    reasons.push(pet.timeNeed === "low" ? "Low daily care needs" : "Fits an active schedule");
  }

  // +20 experience fit
  if (a.exp === "experienced" || pet.care === "easy") {
    score += 20;
    reasons.push(pet.care === "easy" ? "Beginner-friendly" : "Rewarding for experienced owners");
  }

  // +15 personality match
  if (a.energy && a.energy === pet.energy) {
    score += 15;
    reasons.push(pet.energy === "calm" ? "Calm and gentle" : "Playful and lively");
  }

  // +10 activity fit
  if (a.energy === "active" && pet.energy === "active") score += 10;
  else if (a.energy === "calm" && pet.energy === "calm") score += 10;

  // +10 budget fit
  if (pet.price <= 1000) {
    score += 10;
    reasons.push("Budget-friendly");
  } else if (pet.price <= 1400) {
    score += 6;
  }

  // -20 mild allergy risk
  if (a.allergy === "no" && pet.allergy === "high") {
    score -= 20;
    cautions.push("Sheds — mild allergy risk");
  }

  // -15 near-miss care / mismatch
  if (a.energy === "calm" && pet.energy === "active") {
    score -= 15;
    cautions.push("More active than you asked for");
  }
  if (a.home === "apartment" && pet.size === "large") {
    cautions.push("Large pet — needs room to move");
  }

  score = Math.max(0, Math.min(100, score));
  return {
    name: pet.name,
    species: pet.species,
    image: pet.image,
    price: pet.price,
    score,
    label: label(score),
    reasons: reasons.slice(0, 3),
    cautions: cautions.slice(0, 2),
  };
}

export function computeMatches(a: Answers): MatchResult[] {
  return PETS.filter((p) => passesFilters(p, a))
    .map((p) => scorePet(p, a))
    .sort((x, y) => y.score - x.score)
    .slice(0, 3);
}
