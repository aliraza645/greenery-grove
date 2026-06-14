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
  images: string[];
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

// Unsplash CDN — stable, free, high-quality plant photography
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const products: Product[] = [
  {
    id: "1", slug: "ficus-lyrata", name: "Fiddle Leaf Fig", latin: "Ficus Lyrata",
    price: 85, image: fiddle, images: [fiddle], category: "indoor", type: "indoor", light: "indirect",
    inStock: true, bestSeller: true, rating: 4.8, reviews: 142,
    description: "The Fiddle Leaf Fig is the sculptural centerpiece every modern interior craves. Its violin-shaped, leathery leaves rise on a slender trunk to create instant architecture.",
    care: { water: "Once a week, when topsoil is dry.", light: "Bright, indirect sunlight.", temperature: "18–24°C." },
  },
  {
    id: "2", slug: "calathea-orbifolia", name: "Calathea Orbifolia", latin: "Prayer Plant",
    price: 42, image: calathea, images: [calathea], category: "indoor", type: "indoor", light: "low",
    inStock: true, rating: 4.6, reviews: 89,
    description: "Wide round leaves striped in silver and emerald. The Orbifolia folds her leaves upward at night, like hands in prayer.",
    care: { water: "Keep evenly moist, never soggy.", light: "Medium to low indirect light.", temperature: "18–27°C." },
  },
  {
    id: "3", slug: "strelitzia-nicolai", name: "Strelitzia Nicolai", latin: "Bird of Paradise",
    price: 120, image: bird, images: [bird], category: "indoor", type: "indoor", light: "direct",
    inStock: true, bestSeller: true, rating: 4.9, reviews: 211,
    description: "A statement floor plant with broad, paddle-shaped leaves that bring tropical drama into any sunlit corner.",
    care: { water: "Weekly in summer, less in winter.", light: "Bright, direct sun.", temperature: "18–30°C." },
  },
  {
    id: "4", slug: "calathea-rufibarba", name: "Velvet Calathea", latin: "Calathea Rufibarba",
    price: 38, image: velvet, images: [velvet], category: "indoor", type: "indoor", light: "indirect",
    inStock: true, rating: 4.5, reviews: 64,
    description: "Soft, ruby-undersided leaves with a velvet finish. A tactile, slightly moody houseplant.",
    care: { water: "Keep soil lightly moist.", light: "Bright, indirect light.", temperature: "16–24°C." },
  },
  {
    id: "5", slug: "zz-plant", name: "ZZ Plant", latin: "Zamioculcas Zamiifolia",
    price: 48, image: zz, images: [zz], category: "indoor", type: "indoor", light: "low",
    inStock: true, bestSeller: true, rating: 4.9, reviews: 318,
    description: "Glossy, almost waxen leaves on architectural stems. Forgiving of neglect and low light.",
    care: { water: "Every 2–3 weeks. Allow to dry between.", light: "Any indoor light, even very low.", temperature: "15–24°C." },
  },
  {
    id: "6", slug: "pothos-golden", name: "Golden Pothos", latin: "Epipremnum Aureum",
    price: 28, image: pothos, images: [pothos], category: "indoor", type: "indoor", light: "low",
    inStock: true, rating: 4.7, reviews: 256,
    description: "Heart-shaped leaves on long, trailing vines. Happiest cascading from a shelf or hanging planter.",
    care: { water: "Weekly. Tolerates missed waterings.", light: "Low to medium indirect.", temperature: "15–27°C." },
  },
  {
    id: "7", slug: "monstera-deliciosa", name: "Monstera Deliciosa", latin: "Swiss Cheese Plant",
    price: 65, image: u("1614594975525-e45190c55d0b"), images: [u("1614594975525-e45190c55d0b")],
    category: "indoor", type: "indoor", light: "indirect",
    inStock: true, bestSeller: true, rating: 4.9, reviews: 402,
    description: "The icon. Dramatic split leaves with natural fenestrations that grow more sculptural with age. A living piece of art for any sunlit room.",
    care: { water: "Every 7–10 days; mist weekly.", light: "Bright, indirect light.", temperature: "18–27°C." },
  },
  {
    id: "8", slug: "snake-plant", name: "Snake Plant", latin: "Sansevieria Trifasciata",
    price: 34, image: u("1593482892290-f54927ae1bb6"), images: [u("1593482892290-f54927ae1bb6")],
    category: "indoor", type: "indoor", light: "low",
    inStock: true, rating: 4.8, reviews: 287,
    description: "Sculptural upright blades with golden margins. Tolerates the toughest corners and purifies the air while you sleep.",
    care: { water: "Every 2–3 weeks.", light: "Any light, even very low.", temperature: "15–29°C." },
  },
  {
    id: "9", slug: "rubber-plant", name: "Rubber Plant", latin: "Ficus Elastica",
    price: 58, image: u("1593691512429-7a23129b1ed4"), images: [u("1593691512429-7a23129b1ed4")],
    category: "indoor", type: "indoor", light: "indirect",
    inStock: true, rating: 4.7, reviews: 156,
    description: "Glossy burgundy leaves on a sturdy trunk. A fast-growing floor plant that brings instant maturity to any room.",
    care: { water: "Weekly; let topsoil dry.", light: "Bright, indirect light.", temperature: "16–24°C." },
  },
  {
    id: "10", slug: "philodendron-pink-princess", name: "Pink Princess Philodendron", latin: "Philodendron Erubescens",
    price: 95, image: u("1632207691143-643e2a9a9361"), images: [u("1632207691143-643e2a9a9361")],
    category: "indoor", type: "indoor", light: "indirect",
    inStock: true, bestSeller: true, rating: 4.9, reviews: 178,
    description: "Collector's favorite with stunning variegated pink and dark green leaves. Each leaf is a one-of-a-kind work of nature.",
    care: { water: "When top inch is dry.", light: "Bright, indirect light.", temperature: "18–27°C." },
  },
  {
    id: "11", slug: "alocasia-polly", name: "Alocasia Polly", latin: "African Mask Plant",
    price: 45, image: u("1632207691108-c14d49d6c6a3"), images: [u("1632207691108-c14d49d6c6a3")],
    category: "indoor", type: "indoor", light: "indirect",
    inStock: true, rating: 4.5, reviews: 92,
    description: "Dramatic arrow-shaped leaves with bone-white veining on deep green. A small but bold statement plant.",
    care: { water: "Keep evenly moist.", light: "Bright, indirect light.", temperature: "18–27°C." },
  },
  {
    id: "12", slug: "string-of-pearls", name: "String of Pearls", latin: "Senecio Rowleyanus",
    price: 24, image: u("1459411552884-841db9b3cc2a"), images: [u("1459411552884-841db9b3cc2a")],
    category: "succulents", type: "indoor", light: "direct",
    inStock: true, rating: 4.6, reviews: 134,
    description: "Cascading strands of pearl-like beads. A whimsical hanging succulent that thrives in bright sun.",
    care: { water: "Every 10–14 days.", light: "Bright, direct light.", temperature: "16–24°C." },
  },
  {
    id: "13", slug: "echeveria-elegans", name: "Echeveria Elegans", latin: "Mexican Snowball",
    price: 16, image: u("1485955900006-10f4d324d411"), images: [u("1485955900006-10f4d324d411")],
    category: "succulents", type: "indoor", light: "direct",
    inStock: true, rating: 4.8, reviews: 211,
    description: "Powder-blue rosettes with pink-tipped leaves. The quintessential desk succulent — geometric, low maintenance, endlessly charming.",
    care: { water: "Every 2 weeks; let dry fully.", light: "Bright, direct sun.", temperature: "15–27°C." },
  },
  {
    id: "14", slug: "haworthia-zebra", name: "Zebra Haworthia", latin: "Haworthia Fasciata",
    price: 14, image: u("1509423350716-97f9360b4e09"), images: [u("1509423350716-97f9360b4e09")],
    category: "succulents", type: "indoor", light: "indirect",
    inStock: true, rating: 4.7, reviews: 98,
    description: "Tidy rosette of pointed dark-green leaves striped with crisp white bands. A graphic little plant that asks for nothing.",
    care: { water: "Every 2–3 weeks.", light: "Bright, indirect light.", temperature: "15–27°C." },
  },
  {
    id: "15", slug: "olive-tree", name: "Mediterranean Olive Tree", latin: "Olea Europaea",
    price: 145, image: u("1610630483306-fb96f29ee72e"), images: [u("1610630483306-fb96f29ee72e")],
    category: "outdoor", type: "outdoor", light: "direct",
    inStock: true, bestSeller: true, rating: 4.9, reviews: 87,
    description: "Silvery foliage on a gnarled, sculptural trunk. A living piece of the Mediterranean for sunny patios and entryways.",
    care: { water: "Deeply, weekly.", light: "Full sun, all day.", temperature: "5–30°C." },
  },
  {
    id: "16", slug: "lavender-french", name: "French Lavender", latin: "Lavandula Stoechas",
    price: 22, image: u("1499002238440-d264edd596ec"), images: [u("1499002238440-d264edd596ec")],
    category: "outdoor", type: "outdoor", light: "direct",
    inStock: true, rating: 4.7, reviews: 165,
    description: "Fragrant silver foliage topped with butterfly-bract purple flowers. Drought-tolerant and bee-loved.",
    care: { water: "Sparingly; drought-tolerant.", light: "Full sun.", temperature: "5–30°C." },
  },
  {
    id: "17", slug: "japanese-maple", name: "Japanese Maple", latin: "Acer Palmatum",
    price: 185, image: u("1507371341162-763b5e419408"), images: [u("1507371341162-763b5e419408")],
    category: "outdoor", type: "outdoor", light: "indirect",
    inStock: true, rating: 4.9, reviews: 73,
    description: "Lace-like crimson foliage that ignites in autumn. A patient, poetic ornamental tree for courtyards and balconies.",
    care: { water: "Twice weekly in summer.", light: "Dappled shade to morning sun.", temperature: "0–28°C." },
  },
  {
    id: "18", slug: "rosemary-tuscan", name: "Tuscan Rosemary", latin: "Salvia Rosmarinus",
    price: 18, image: u("1466692476868-aef1dfb1e735"), images: [u("1466692476868-aef1dfb1e735")],
    category: "outdoor", type: "outdoor", light: "direct",
    inStock: true, rating: 4.8, reviews: 142,
    description: "Aromatic upright herb with needle-like silver-green leaves. Hardy, evergreen, and useful for every kitchen.",
    care: { water: "Weekly; let dry between.", light: "Full sun.", temperature: "5–32°C." },
  },
  {
    id: "19", slug: "terracotta-pot-classic", name: "Classic Terracotta Pot", latin: "Hand-thrown",
    price: 32, image: u("1485955900006-10f4d324d411"), images: [u("1485955900006-10f4d324d411")],
    category: "pots", type: "indoor", light: "indirect",
    inStock: true, rating: 4.6, reviews: 89,
    description: "Hand-thrown unglazed terracotta with breathable walls. Patinas beautifully over years of use. Includes drainage saucer.",
    care: { water: "—", light: "—", temperature: "—" },
  },
  {
    id: "20", slug: "stoneware-planter-cream", name: "Cream Stoneware Planter", latin: "Studio Ceramic",
    price: 58, image: u("1602143407151-7111542de6e8"), images: [u("1602143407151-7111542de6e8")],
    category: "pots", type: "indoor", light: "indirect",
    inStock: true, bestSeller: true, rating: 4.9, reviews: 112,
    description: "Matte cream stoneware with subtle horizontal ribbing. Hand-finished in a small studio, no two are identical.",
    care: { water: "—", light: "—", temperature: "—" },
  },
  {
    id: "21", slug: "brass-pruning-shears", name: "Brass Pruning Shears", latin: "Garden Tool",
    price: 48, image: u("1416879595882-3373a0480b5b"), images: [u("1416879595882-3373a0480b5b")],
    category: "tools", type: "indoor", light: "indirect",
    inStock: true, rating: 4.8, reviews: 67,
    description: "Forged carbon-steel blades with a solid brass handle. Precision-cut, built to last decades. Includes leather sheath.",
    care: { water: "—", light: "—", temperature: "—" },
  },
  {
    id: "22", slug: "heirloom-seed-kit", name: "Heirloom Herb Seed Kit", latin: "Six Varieties",
    price: 26, image: u("1466692476868-aef1dfb1e735"), images: [u("1466692476868-aef1dfb1e735")],
    category: "seeds", type: "outdoor", light: "direct",
    inStock: true, rating: 4.7, reviews: 154,
    description: "Six open-pollinated herb varieties: basil, thyme, oregano, parsley, cilantro, and chives. Compostable seed packets.",
    care: { water: "Daily during germination.", light: "Bright window or grow light.", temperature: "18–24°C." },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const bestSellers = () => products.filter((p) => p.bestSeller);
export const relatedTo = (slug: string) => products.filter((p) => p.slug !== slug).slice(0, 3);
