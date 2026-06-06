import fiddle from "@/assets/p-fiddle.jpg";
import calathea from "@/assets/p-calathea.jpg";
import bird from "@/assets/p-bird.jpg";
import velvet from "@/assets/p-velvet.jpg";
import zz from "@/assets/p-zz.jpg";
import pothos from "@/assets/p-pothos.jpg";
import catIndoor from "@/assets/cat-indoor.jpg";
import catPots from "@/assets/cat-pots.jpg";
import catTools from "@/assets/cat-tools.jpg";
import catSucculents from "@/assets/cat-succulents.jpg";

export type LightLevel = "low" | "indirect" | "direct";
export type PlantType = "indoor" | "outdoor";

export interface Product {
  id: string;
  slug: string;
  name: string;
  latin: string;
  price: number;
  image: string;
  category: string;
  type: PlantType;
  light: LightLevel;
  inStock: boolean;
  bestSeller?: boolean;
  rating: number;
  reviews: number;
  description: string;
  care: { water: string; light: string; temperature: string };
}

export interface Category {
  slug: string;
  name: string;
  blurb: string;
  image: string;
}

export const categories: Category[] = [
  { slug: "indoor", name: "Indoor Giants", blurb: "Architectural foliage for the living room.", image: catIndoor },
  { slug: "pots", name: "Handmade Pots", blurb: "Hand-thrown ceramic vessels.", image: catPots },
  { slug: "tools", name: "Tools & Seeds", blurb: "Brass shears, heirloom seeds.", image: catTools },
  { slug: "succulents", name: "Succulents", blurb: "Easy-care arid varieties.", image: catSucculents },
];

export const products: Product[] = [
  {
    id: "1", slug: "ficus-lyrata", name: "Fiddle Leaf Fig", latin: "Ficus Lyrata",
    price: 85, image: fiddle, category: "indoor", type: "indoor", light: "indirect",
    inStock: true, bestSeller: true, rating: 4.8, reviews: 142,
    description: "The Fiddle Leaf Fig is the sculptural centerpiece every modern interior craves. Its violin-shaped, leathery leaves rise on a slender trunk to create instant architecture.",
    care: { water: "Once a week, when topsoil is dry.", light: "Bright, indirect sunlight.", temperature: "18–24°C." },
  },
  {
    id: "2", slug: "calathea-orbifolia", name: "Calathea Orbifolia", latin: "Prayer Plant",
    price: 42, image: calathea, category: "indoor", type: "indoor", light: "low",
    inStock: true, rating: 4.6, reviews: 89,
    description: "Wide round leaves striped in silver and emerald. The Orbifolia folds her leaves upward at night, like hands in prayer.",
    care: { water: "Keep evenly moist, never soggy.", light: "Medium to low indirect light.", temperature: "18–27°C." },
  },
  {
    id: "3", slug: "strelitzia-nicolai", name: "Strelitzia Nicolai", latin: "Bird of Paradise",
    price: 120, image: bird, category: "indoor", type: "indoor", light: "direct",
    inStock: true, bestSeller: true, rating: 4.9, reviews: 211,
    description: "A statement floor plant with broad, paddle-shaped leaves that bring tropical drama into any sunlit corner.",
    care: { water: "Weekly in summer, less in winter.", light: "Bright, direct sun.", temperature: "18–30°C." },
  },
  {
    id: "4", slug: "calathea-rufibarba", name: "Velvet Calathea", latin: "Calathea Rufibarba",
    price: 38, image: velvet, category: "indoor", type: "indoor", light: "indirect",
    inStock: true, rating: 4.5, reviews: 64,
    description: "Soft, ruby-undersided leaves with a velvet finish. A tactile, slightly moody houseplant.",
    care: { water: "Keep soil lightly moist.", light: "Bright, indirect light.", temperature: "16–24°C." },
  },
  {
    id: "5", slug: "zz-plant", name: "ZZ Plant", latin: "Zamioculcas Zamiifolia",
    price: 48, image: zz, category: "indoor", type: "indoor", light: "low",
    inStock: true, bestSeller: true, rating: 4.9, reviews: 318,
    description: "Glossy, almost waxen leaves on architectural stems. Forgiving of neglect and low light.",
    care: { water: "Every 2–3 weeks. Allow to dry between.", light: "Any indoor light, even very low.", temperature: "15–24°C." },
  },
  {
    id: "6", slug: "pothos-golden", name: "Golden Pothos", latin: "Epipremnum Aureum",
    price: 28, image: pothos, category: "indoor", type: "indoor", light: "low",
    inStock: true, rating: 4.7, reviews: 256,
    description: "Heart-shaped leaves on long, trailing vines. Happiest cascading from a shelf or hanging planter.",
    care: { water: "Weekly. Tolerates missed waterings.", light: "Low to medium indirect.", temperature: "15–27°C." },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const bestSellers = () => products.filter((p) => p.bestSeller);
export const relatedTo = (slug: string) => products.filter((p) => p.slug !== slug).slice(0, 3);
