/**
 * Shared Pet Helpers mock data.
 * Used by the /helpers list, the home "Pet Helpers" section and the
 * /helpers/:helperId detail page — one source of truth.
 * Phone numbers are demo values (not real people).
 */
export interface Helper {
  _id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  address: string;
  phone: string;
  message: string;
  about: string;
  animals: string[];
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
}

export const HELPERS: Helper[] = [
  { _id: "h1", name: "Jiyeon Kim", specialty: "Dog Care Specialist", experience: "3 yrs experience", location: "Seoul, Korea", address: "Gangnam-gu, Seoul, Korea", phone: "+82 10-2345-6789", message: "Loving daily care and walks for your pup.", about: "I care for dogs of every size with daily walks, feeding and lots of affection. Your pup is treated like family, with photo updates after every visit.", animals: ["Dogs", "Puppies"], rating: 5.0, reviews: 128, image: "/img/home/ithelper.png", verified: true },
  { _id: "h2", name: "Minho Park", specialty: "Cat Care Specialist", experience: "4 yrs experience", location: "Seoul, Korea", address: "Mapo-gu, Seoul, Korea", phone: "+82 10-3456-7890", message: "Calm, gentle handling for shy cats.", about: "Cats need patience and a calm routine. I specialise in shy and senior cats, keeping them relaxed with gentle handling and a quiet presence.", animals: ["Cats", "Kittens"], rating: 5.0, reviews: 98, image: "/img/home/catHelper.jpg", verified: true },
  { _id: "h3", name: "Soojin Lee", specialty: "Small Animals Helper", experience: "2 yrs experience", location: "Incheon, Korea", address: "Yeonsu-gu, Incheon, Korea", phone: "+82 10-4567-8901", message: "Friendly care for rabbits and tiny friends.", about: "Rabbits, guinea pigs and other small friends get careful, gentle attention — clean habitats, fresh food and safe play time every visit.", animals: ["Rabbits", "Guinea Pigs"], rating: 4.9, reviews: 76, image: "/img/home/rabbithelper.jpg", verified: true },
  { _id: "h4", name: "Hyunwoo Choi", specialty: "Bird Care Helper", experience: "3 yrs experience", location: "Busan, Korea", address: "Haeundae-gu, Busan, Korea", phone: "+82 10-5678-9012", message: "Patient care for parrots and songbirds.", about: "From parrots to songbirds, I provide calm, attentive care, cage cleaning and enrichment so your feathered friend stays happy and healthy.", animals: ["Birds", "Parrots"], rating: 4.9, reviews: 76, image: "/img/home/muhelper.png", verified: true },
  { _id: "h5", name: "Eunji Han", specialty: "Dog Walker", experience: "2 yrs experience", location: "Seoul, Korea", address: "Songpa-gu, Seoul, Korea", phone: "+82 10-6789-0123", message: "Energetic daily walks, rain or shine.", about: "Reliable, energetic dog walking on your schedule — rain or shine. Your dog gets real exercise, fresh air and a happy tired tail at the end.", animals: ["Dogs"], rating: 4.8, reviews: 54, image: "/img/home/doghelper.jpg", verified: true },
  { _id: "h6", name: "Jisoo Kang", specialty: "Puppy Trainer", experience: "5 yrs experience", location: "Daejeon, Korea", address: "Yuseong-gu, Daejeon, Korea", phone: "+82 10-7890-1234", message: "Positive-reinforcement puppy training.", about: "I train puppies with kind, positive-reinforcement methods — basic obedience, house training and confidence building from day one.", animals: ["Dogs", "Puppies"], rating: 5.0, reviews: 112, image: "/img/home/dogHel.jpg", verified: true },
  { _id: "h7", name: "Daniel Cho", specialty: "Cat Sitter", experience: "3 yrs experience", location: "Gwangju, Korea", address: "Buk-gu, Gwangju, Korea", phone: "+82 10-8901-2345", message: "In-home sitting so your cat stays comfy.", about: "In-home cat sitting keeps your cat comfortable in familiar surroundings — feeding, litter, play and company while you're away.", animals: ["Cats"], rating: 4.7, reviews: 41, image: "/img/home/helper7.jpg", verified: false },
  { _id: "h8", name: "Seoyeon Yoon", specialty: "Multi-pet Helper", experience: "4 yrs experience", location: "Ulsan, Korea", address: "Nam-gu, Ulsan, Korea", phone: "+82 10-9012-3456", message: "Comfortable with dogs, cats and more.", about: "A multi-pet household is no problem for me. I'm comfortable caring for dogs, cats and small animals together, keeping everyone calm and cared for.", animals: ["Dogs", "Cats"], rating: 4.9, reviews: 88, image: "/img/home/helper8.jpg", verified: true },
  { _id: "h9", name: "Yuna Seo", specialty: "Dog Care Specialist", experience: "3 yrs experience", location: "Seoul, Korea", address: "Seocho-gu, Seoul, Korea", phone: "+82 10-1123-4567", message: "Warm daily care and playtime for pups.", about: "Warm, dependable daily care and playtime for dogs of all ages, with feeding, walks and plenty of belly rubs.", animals: ["Dogs", "Puppies"], rating: 4.9, reviews: 67, image: "/img/home/doghelper.jpg", verified: true },
  { _id: "h10", name: "Junho Lim", specialty: "Cat Sitter", experience: "2 yrs experience", location: "Incheon, Korea", address: "Namdong-gu, Incheon, Korea", phone: "+82 10-2234-5678", message: "Quiet, careful sitting for indoor cats.", about: "Quiet, careful sitting for indoor cats — I keep their routine steady with feeding, fresh water, litter care and gentle company.", animals: ["Cats", "Kittens"], rating: 4.8, reviews: 45, image: "/img/home/catHelper.jpg", verified: true },
  { _id: "h11", name: "Haeun Jang", specialty: "Small Animals Helper", experience: "4 yrs experience", location: "Busan, Korea", address: "Suyeong-gu, Busan, Korea", phone: "+82 10-3345-6789", message: "Gentle handling for rabbits and guinea pigs.", about: "Experienced with rabbits and guinea pigs — gentle handling, clean habitats and the right diet keep your small pets thriving.", animals: ["Rabbits", "Guinea Pigs"], rating: 5.0, reviews: 93, image: "/img/home/rabbithelper.jpg", verified: true },
  { _id: "h12", name: "Taeyang Oh", specialty: "Bird Care Helper", experience: "3 yrs experience", location: "Daegu, Korea", address: "Suseong-gu, Daegu, Korea", phone: "+82 10-4456-7890", message: "Patient, attentive care for all birds.", about: "Patient, attentive care for birds of all kinds — feeding, cage hygiene and enrichment to keep them chirpy and content.", animals: ["Birds", "Parrots"], rating: 4.7, reviews: 38, image: "/img/home/muhelper.png", verified: false },
  { _id: "h13", name: "Nari Baek", specialty: "Dog Walker", experience: "2 yrs experience", location: "Seoul, Korea", address: "Jongno-gu, Seoul, Korea", phone: "+82 10-5567-8901", message: "Reliable walks that keep tails wagging.", about: "Dependable daily walks that keep tails wagging — flexible timing, good exercise and a friendly, familiar face for your dog.", animals: ["Dogs"], rating: 4.8, reviews: 59, image: "/img/home/dogHel.jpg", verified: true },
  { _id: "h14", name: "Kevin Ryu", specialty: "Puppy Trainer", experience: "5 yrs experience", location: "Gwangju, Korea", address: "Seo-gu, Gwangju, Korea", phone: "+82 10-6678-9012", message: "Kind, effective training from day one.", about: "Kind, effective puppy training from day one — obedience, socialisation and house training with a calm, consistent approach.", animals: ["Dogs", "Puppies"], rating: 5.0, reviews: 104, image: "/img/home/ithelper.png", verified: true },
  { _id: "h15", name: "Sena Moon", specialty: "Cat Care Specialist", experience: "3 yrs experience", location: "Ulsan, Korea", address: "Jung-gu, Ulsan, Korea", phone: "+82 10-7789-0123", message: "Calm care tailored to each cat's mood.", about: "Calm, tailored care that respects each cat's mood and personality — feeding, play and a stress-free routine they can rely on.", animals: ["Cats"], rating: 4.9, reviews: 71, image: "/img/justin.webp", verified: true },
  { _id: "h16", name: "Doyoon Nam", specialty: "Multi-pet Helper", experience: "4 yrs experience", location: "Daejeon, Korea", address: "Seo-gu, Daejeon, Korea", phone: "+82 10-8890-1234", message: "Happy to care for the whole furry family.", about: "Happy to care for the whole furry family — dogs, cats and small pets together, with attentive, all-round daily care.", animals: ["Dogs", "Cats"], rating: 4.8, reviews: 82, image: "/img/martin.webp", verified: true },
];

export const findHelper = (id: string): Helper | undefined =>
  HELPERS.find((h) => h._id === id);
