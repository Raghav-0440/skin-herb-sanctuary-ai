interface PlantInfo {
  id: string;
  name: string;
  scientificName: string;
  size: string;
  nativeRegion: string;
  climate: string;
  sunlight: string;
  soil: string;
  partsUsed: string[];
  activeCompounds: string[];
  therapeuticProperties: string[];
  dosageForms: string[];
  ayushApplications: {
    ayurveda?: string;
    unani?: string;
    siddha?: string;
  };
  healthBenefits: string[];
  image: string;
  category: string;
}

export const plantsData: Record<string, PlantInfo> = {
  "1": {
    id: "1",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis",
    size: "24–39 inches tall",
    nativeRegion: "Arabian Peninsula",
    climate: "Warm, dry climates",
    sunlight: "Full sun to partial shade",
    soil: "Sandy, well-drained soil",
    partsUsed: ["Leaves (gel and latex)"],
    activeCompounds: ["Aloin", "Aloesin", "Acemannan"],
    therapeuticProperties: ["Anti-inflammatory", "Moisturizing", "Wound-healing"],
    dosageForms: ["Gel", "Juice", "Capsules"],
    ayushApplications: {
      ayurveda: "Used for wound healing, skin diseases, and digestive disorders",
      unani: "Used as a purgative and liver tonic",
      siddha: "Used for burns, skin rejuvenation, and ulcers"
    },
    healthBenefits: [
      "Promotes skin healing and soothes burns",
      "Aids in digestion and relieves constipation",
      "Enhances immune response and detoxification"
    ],
    image: "/images/aloe-vera.jpg",
    category: "Burns & Wounds"
  },
  "2": {
    id: "2",
    name: "Turmeric",
    scientificName: "Curcuma longa",
    size: "3–4 feet tall",
    nativeRegion: "South Asia (especially India)",
    climate: "Tropical climates",
    sunlight: "Full sun",
    soil: "Fertile, well-drained soil",
    partsUsed: ["Rhizome (root)"],
    activeCompounds: ["Curcumin", "Turmerone"],
    therapeuticProperties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial"],
    dosageForms: ["Powder", "Capsules", "Tincture"],
    ayushApplications: {
      ayurveda: "Used to purify blood, improve digestion, and treat skin disorders",
      unani: "Used for liver ailments and wound healing",
      siddha: "Used for anti-inflammatory treatment and skin issues"
    },
    healthBenefits: [
      "Reduces inflammation and joint pain",
      "Boosts skin health and complexion",
      "Enhances liver function and detoxification"
    ],
    image: "/images/turmeric.jpg",
    category: "General Skincare"
  },
  "3": {
    id: "3",
    name: "Neem",
    scientificName: "Azadirachta indica",
    size: "50–65 feet tall",
    nativeRegion: "Indian subcontinent",
    climate: "Tropical and subtropical climates",
    sunlight: "Full sun",
    soil: "Well-drained sandy or clay soils",
    partsUsed: ["Leaves", "Bark", "Seeds"],
    activeCompounds: ["Azadirachtin", "Nimbin"],
    therapeuticProperties: ["Antibacterial", "Antifungal", "Antiparasitic"],
    dosageForms: ["Oil", "Capsules", "Powders"],
    ayushApplications: {
      ayurveda: "Used for treating skin diseases and blood purification",
      unani: "Used for anti-inflammatory and antiseptic purposes",
      siddha: "Used for treating ulcers and skin infections"
    },
    healthBenefits: [
      "Supports skin health and acne treatment",
      "Enhances oral hygiene and dental care",
      "Boosts immune system against infections"
    ],
    image: "/images/neem.jpg",
    category: "Acne"
  },
  "4": {
    id: "4",
    name: "Calendula",
    scientificName: "Calendula officinalis",
    size: "12–24 inches tall",
    nativeRegion: "Mediterranean region",
    climate: "Temperate climates",
    sunlight: "Full sun",
    soil: "Well-drained, moderately fertile soil",
    partsUsed: ["Flowers"],
    activeCompounds: ["Flavonoids", "Triterpenoids"],
    therapeuticProperties: ["Anti-inflammatory", "Wound healing", "Antimicrobial"],
    dosageForms: ["Ointments", "Tinctures", "Teas"],
    ayushApplications: {
      ayurveda: "Used for wound healing and skin irritation"
    },
    healthBenefits: [
      "Accelerates wound healing",
      "Reduces skin inflammation and irritation",
      "Protects against infections and boosts skin repair"
    ],
    image: "/images/calendula.jpg",
    category: "Skin Health"
  },
  "5": {
    id: "5",
    name: "Sandalwood",
    scientificName: "Santalum album",
    size: "12–20 feet tall",
    nativeRegion: "Southern India, Indonesia, Australia",
    climate: "Tropical and subtropical climates",
    sunlight: "Full sun to partial shade",
    soil: "Well-drained, slightly alkaline soil",
    partsUsed: ["Heartwood", "Oil"],
    activeCompounds: ["Santalol", "β-santalol"],
    therapeuticProperties: ["Anti-inflammatory", "Antimicrobial", "Calming"],
    dosageForms: ["Essential oil", "Powder", "Paste"],
    ayushApplications: {
      ayurveda: "Used for cooling effect, treating skin inflammation, and mental relaxation",
      unani: "Used for fever, headache, and skin diseases"
    },
    healthBenefits: [
      "Promotes healthy, glowing skin",
      "Provides stress relief and enhances mental clarity",
      "Reduces inflammation and treats minor wounds"
    ],
    image: "/images/sandalwood.jpg",
    category: "Skin Health"
  },
  "6": {
    id: "6",
    name: "Saffron",
    scientificName: "Crocus sativus",
    size: "4–6 inches tall",
    nativeRegion: "Southwest Asia (especially Iran, Kashmir)",
    climate: "Temperate climate with dry summers",
    sunlight: "Full sun",
    soil: "Well-drained, rich loamy soil",
    partsUsed: ["Stigmas (threads)"],
    activeCompounds: ["Crocin", "Safranal"],
    therapeuticProperties: ["Antidepressant", "Antioxidant", "Neuroprotective"],
    dosageForms: ["Dried threads", "Powder", "Extract"],
    ayushApplications: {
      ayurveda: "Used to enhance complexion and as a mood enhancer",
      unani: "Used for liver support and respiratory health"
    },
    healthBenefits: [
      "Improves mood and reduces symptoms of depression",
      "Enhances skin brightness and complexion",
      "Supports cognitive function and memory"
    ],
    image: "/images/saffron.jpg",
    category: "Skin Health"
  },
  "7": {
    id: "7",
    name: "Gotu Kola",
    scientificName: "Centella asiatica",
    size: "2–6 inches tall",
    nativeRegion: "Asia and South Pacific Islands",
    climate: "Tropical and subtropical regions",
    sunlight: "Partial shade to full sun",
    soil: "Moist, well-drained soil",
    partsUsed: ["Leaves", "Whole plant"],
    activeCompounds: ["Triterpenoids", "Asiaticoside"],
    therapeuticProperties: ["Wound healing", "Anti-inflammatory", "Cognitive enhancement"],
    dosageForms: ["Capsules", "Tinctures", "Topical preparations"],
    ayushApplications: {
      ayurveda: "Used for skin conditions, mental clarity, and longevity",
      siddha: "Used for skin diseases and mental disorders"
    },
    healthBenefits: [
      "Promotes wound healing and skin repair",
      "Reduces inflammation and scarring",
      "Improves circulation and skin health"
    ],
    image: "/images/gotu-kola.jpg",
    category: "Skin Health"
  },
  "8": {
    id: "8",
    name: "Echinacea",
    scientificName: "Echinacea purpurea",
    size: "2–4 feet tall",
    nativeRegion: "North America",
    climate: "Temperate regions",
    sunlight: "Full sun",
    soil: "Well-drained, rich soil",
    partsUsed: ["Roots", "Flowers", "Leaves"],
    activeCompounds: ["Alkamides", "Polysaccharides"],
    therapeuticProperties: ["Immunostimulant", "Anti-inflammatory", "Antimicrobial"],
    dosageForms: ["Tinctures", "Capsules", "Teas"],
    ayushApplications: {
      ayurveda: "Adopted for immune support and skin health"
    },
    healthBenefits: [
      "Boosts immune system function",
      "Reduces inflammation",
      "Supports skin healing and repair"
    ],
    image: "/images/echinacea.jpg",
    category: "Skin Health"
  },
  "9": {
    id: "9",
    name: "Holy Basil",
    scientificName: "Ocimum sanctum",
    size: "1–2 feet tall",
    nativeRegion: "Indian subcontinent",
    climate: "Tropical and subtropical regions",
    sunlight: "Full sun to partial shade",
    soil: "Well-drained, fertile soil",
    partsUsed: ["Leaves", "Seeds", "Whole plant"],
    activeCompounds: ["Eugenol", "Ursolic acid"],
    therapeuticProperties: ["Adaptogenic", "Anti-inflammatory", "Antimicrobial"],
    dosageForms: ["Fresh leaves", "Dried powder", "Tea"],
    ayushApplications: {
      ayurveda: "Used for skin diseases, stress relief, and purification",
      siddha: "Used for skin infections and respiratory conditions"
    },
    healthBenefits: [
      "Treats acne and skin infections",
      "Reduces stress and anxiety",
      "Supports overall skin health"
    ],
    image: "/images/holy-basil.jpg",
    category: "Skin Health"
  },
  "10": {
    id: "10",
    name: "Nettles",
    scientificName: "Urtica dioica",
    size: "3–7 feet tall",
    nativeRegion: "Europe, Asia, North America",
    climate: "Temperate regions",
    sunlight: "Full sun to partial shade",
    soil: "Rich, moist soil",
    partsUsed: ["Leaves", "Roots"],
    activeCompounds: ["Flavonoids", "Minerals", "Vitamins"],
    therapeuticProperties: ["Anti-inflammatory", "Nutritive", "Blood purifying"],
    dosageForms: ["Tea", "Capsules", "Tinctures"],
    ayushApplications: {
      ayurveda: "Used for skin conditions and blood purification",
      unani: "Used for treating skin disorders"
    },
    healthBenefits: [
      "Improves skin conditions",
      "Reduces inflammation",
      "Supports hair growth"
    ],
    image: "/images/nettles.jpg",
    category: "Skin Health"
  },
  "11": {
    id: "11",
    name: "Hemp Seed Oil",
    scientificName: "Cannabis sativa",
    size: "4–15 feet tall (parent plant)",
    nativeRegion: "Central Asia",
    climate: "Temperate to subtropical",
    sunlight: "Full sun",
    soil: "Well-drained, nutrient-rich soil",
    partsUsed: ["Seeds"],
    activeCompounds: ["Essential fatty acids", "Omega-3", "Omega-6"],
    therapeuticProperties: ["Anti-inflammatory", "Moisturizing", "Nutritive"],
    dosageForms: ["Oil", "Capsules", "Topical preparations"],
    ayushApplications: {
      ayurveda: "Used for skin nourishment and inflammation"
    },
    healthBenefits: [
      "Moisturizes and nourishes skin",
      "Reduces inflammation",
      "Balances oil production"
    ],
    image: "/images/hemp-seed-oil.jpg",
    category: "Skin Health"
  },
  "12": {
    id: "12",
    name: "Oregon Grape",
    scientificName: "Mahonia aquifolium",
    size: "3–6 feet tall",
    nativeRegion: "North America",
    climate: "Temperate regions",
    sunlight: "Partial to full shade",
    soil: "Well-drained, acidic soil",
    partsUsed: ["Root", "Bark"],
    activeCompounds: ["Berberine", "Alkaloids"],
    therapeuticProperties: ["Antimicrobial", "Anti-inflammatory", "Antifungal"],
    dosageForms: ["Tinctures", "Topical preparations", "Tea"],
    ayushApplications: {
      ayurveda: "Adopted for skin conditions and infections"
    },
    healthBenefits: [
      "Treats psoriasis and eczema",
      "Reduces inflammation",
      "Fights bacterial infections"
    ],
    image: "/images/oregon-grape.jpg",
    category: "Skin Health"
  },
  "13": {
    id: "13",
    name: "Indigo",
    scientificName: "Indigofera tinctoria",
    size: "2–3 feet tall",
    nativeRegion: "South Asia",
    climate: "Tropical and subtropical",
    sunlight: "Full sun",
    soil: "Well-drained, sandy loam",
    partsUsed: ["Leaves", "Root"],
    activeCompounds: ["Indirubin", "Tryptanthrin"],
    therapeuticProperties: ["Anti-inflammatory", "Antimicrobial", "Cooling"],
    dosageForms: ["Powder", "Oil", "Paste"],
    ayushApplications: {
      ayurveda: "Used for skin diseases and inflammation",
      unani: "Treatment of skin disorders and wounds"
    },
    healthBenefits: [
      "Treats skin infections",
      "Reduces inflammation",
      "Soothes burns and scalds"
    ],
    image: "/images/indigo.jpg",
    category: "Skin Health"
  },
  "14": {
    id: "14",
    name: "Comfrey",
    scientificName: "Symphytum officinale",
    size: "2–4 feet tall",
    nativeRegion: "Europe",
    climate: "Temperate regions",
    sunlight: "Full sun to partial shade",
    soil: "Rich, moist soil",
    partsUsed: ["Leaves", "Root"],
    activeCompounds: ["Allantoin", "Rosmarinic acid"],
    therapeuticProperties: ["Wound healing", "Anti-inflammatory", "Cell proliferant"],
    dosageForms: ["Ointment", "Poultice", "Cream"],
    ayushApplications: {
      ayurveda: "Adopted for wound healing and skin repair"
    },
    healthBenefits: [
      "Accelerates wound healing",
      "Reduces inflammation",
      "Promotes skin cell regeneration"
    ],
    image: "/images/comfrey.jpg",
    category: "Skin Health"
  },
  "15": {
    id: "15",
    name: "Black Nightshade",
    scientificName: "Solanum nigrum",
    size: "1–2 feet tall",
    nativeRegion: "Worldwide",
    climate: "Temperate to tropical",
    sunlight: "Full sun to partial shade",
    soil: "Well-drained, fertile soil",
    partsUsed: ["Leaves", "Berries"],
    activeCompounds: ["Solanine", "Solasodine"],
    therapeuticProperties: ["Anti-inflammatory", "Analgesic", "Antiseptic"],
    dosageForms: ["Paste", "Juice", "Poultice"],
    ayushApplications: {
      ayurveda: "Used for skin diseases and inflammation",
      unani: "Treatment of skin disorders"
    },
    healthBenefits: [
      "Treats skin infections",
      "Reduces inflammation",
      "Soothes skin irritation"
    ],
    image: "/images/black-nightshade.jpg",
    category: "Skin Health"
  },
  "16": {
    id: "16",
    name: "Mango Ginger",
    scientificName: "Curcuma amada",
    size: "2–3 feet tall",
    nativeRegion: "South Asia",
    climate: "Tropical",
    sunlight: "Partial shade",
    soil: "Rich, well-drained soil",
    partsUsed: ["Rhizome"],
    activeCompounds: ["Curcuminoids", "Essential oils"],
    therapeuticProperties: ["Anti-inflammatory", "Antioxidant", "Antimicrobial"],
    dosageForms: ["Paste", "Powder", "Oil"],
    ayushApplications: {
      ayurveda: "Used for skin brightening and inflammation",
      unani: "Treatment of skin disorders"
    },
    healthBenefits: [
      "Brightens skin complexion",
      "Reduces inflammation",
      "Treats skin infections"
    ],
    image: "/images/mango-ginger.jpg",
    category: "Skin Health"
  },
  "17": {
    id: "17",
    name: "Indian Madder",
    scientificName: "Rubia cordifolia",
    size: "Climbing vine",
    nativeRegion: "South Asia",
    climate: "Tropical and subtropical",
    sunlight: "Full sun to partial shade",
    soil: "Well-drained soil",
    partsUsed: ["Root", "Stem"],
    activeCompounds: ["Alizarin", "Purpurin"],
    therapeuticProperties: ["Anti-inflammatory", "Antimicrobial", "Blood purifying"],
    dosageForms: ["Powder", "Decoction", "Paste"],
    ayushApplications: {
      ayurveda: "Used for skin diseases and blood purification",
      unani: "Treatment of skin disorders and blood conditions"
    },
    healthBenefits: [
      "Treats skin diseases",
      "Purifies blood",
      "Reduces inflammation"
    ],
    image: "/images/indian-madder.jpg",
    category: "Skin Health"
  },
  "18": {
    id: "18",
    name: "Mexican Poppy",
    scientificName: "Argemone mexicana",
    size: "2–4 feet tall",
    nativeRegion: "Mexico, now worldwide",
    climate: "Tropical and subtropical",
    sunlight: "Full sun",
    soil: "Sandy, well-drained soil",
    partsUsed: ["Seeds", "Leaves", "Latex"],
    activeCompounds: ["Berberine", "Protopine"],
    therapeuticProperties: ["Antimicrobial", "Anti-inflammatory", "Analgesic"],
    dosageForms: ["Oil", "Paste", "Poultice"],
    ayushApplications: {
      ayurveda: "Used for skin diseases and wounds",
      unani: "Treatment of skin infections"
    },
    healthBenefits: [
      "Treats skin infections",
      "Heals wounds",
      "Reduces inflammation"
    ],
    image: "/images/mexican-poppy.jpg",
    category: "Skin Health"
  },
  "19": {
    id: "19",
    name: "Sacred Fig",
    scientificName: "Ficus religiosa",
    size: "Large tree (50–100 feet tall)",
    nativeRegion: "Indian subcontinent",
    climate: "Tropical and subtropical",
    sunlight: "Full sun",
    soil: "Well-drained, fertile soil",
    partsUsed: ["Bark", "Leaves", "Latex"],
    activeCompounds: ["Flavonoids", "Tannins"],
    therapeuticProperties: ["Anti-inflammatory", "Antimicrobial", "Wound healing"],
    dosageForms: ["Paste", "Powder", "Decoction"],
    ayushApplications: {
      ayurveda: "Used for skin diseases and wound healing",
      unani: "Treatment of skin disorders and wounds"
    },
    healthBenefits: [
      "Heals wounds",
      "Treats skin diseases",
      "Reduces inflammation"
    ],
    image: "/images/sacred-fig.jpg",
    category: "Skin Health"
  }
} 