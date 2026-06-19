// Mock data for TrendFlow - TikTok Trend & Product Intelligence App

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  sold: number;
  soldDelta: number;
  commissionPct: number;
  velocity: number;
  growthRate: number;
  imageUrl: string;
  shopName: string;
  locale: "US" | "UK";
  productUrl: string;
}

export interface Sound {
  id: string;
  title: string;
  author: string;
  rank: number;
  rankDelta: number;
  videoCount: number;
  videoCountDelta: number;
  growthRate: number;
  coverUrl: string;
  soundUrl: string;
  locale: "US" | "UK";
}

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  followers: number;
  gmvDriven: number;
  engagement: number;
  categories: string[];
  locale: "US" | "UK";
}

export interface Shop {
  id: string;
  name: string;
  logoUrl: string;
  totalProducts: number;
  totalSales: number;
  avgRating: number;
  locale: "US" | "UK";
}

export interface Video {
  id: string;
  thumbnailUrl: string;
  title: string;
  views: number;
  likes: number;
  conversions: number;
  productId: string;
  creatorName: string;
  locale: "US" | "UK";
}

export interface AlertRule {
  id: string;
  itemType: "PRODUCT" | "SOUND" | "SHOP";
  itemName: string;
  metric: string;
  threshold: number;
  channel: "email" | "push";
  active: boolean;
  createdAt: string;
}

export interface WatchlistItem {
  id: string;
  itemType: "PRODUCT" | "SOUND" | "SHOP";
  itemId: string;
  itemName: string;
  itemImage: string;
  addedAt: string;
}

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    title: "LED Ring Light with Phone Holder - 10 inch",
    category: "Electronics",
    price: 29.99,
    sold: 15420,
    soldDelta: 2340,
    commissionPct: 15,
    velocity: 312,
    growthRate: 18.2,
    imageUrl: "https://picsum.photos/seed/prod1/200",
    shopName: "TechGlow Store",
    locale: "US",
    productUrl: "#",
  },
  {
    id: "prod-2",
    title: "Portable Blender USB Rechargeable",
    category: "Home & Kitchen",
    price: 24.99,
    sold: 28750,
    soldDelta: 4120,
    commissionPct: 12,
    velocity: 548,
    growthRate: 24.5,
    imageUrl: "https://picsum.photos/seed/prod2/200",
    shopName: "BlendMaster",
    locale: "US",
    productUrl: "#",
  },
  {
    id: "prod-3",
    title: "Acne Pimple Patches - 120 Count",
    category: "Beauty",
    price: 12.99,
    sold: 45230,
    soldDelta: 5890,
    commissionPct: 20,
    velocity: 782,
    growthRate: 31.2,
    imageUrl: "https://picsum.photos/seed/prod3/200",
    shopName: "SkinCare Pro",
    locale: "US",
    productUrl: "#",
  },
  {
    id: "prod-4",
    title: "Wireless Earbuds with LED Display",
    category: "Electronics",
    price: 34.99,
    sold: 12890,
    soldDelta: 1560,
    commissionPct: 10,
    velocity: 208,
    growthRate: 14.8,
    imageUrl: "https://picsum.photos/seed/prod4/200",
    shopName: "AudioMax",
    locale: "US",
    productUrl: "#",
  },
  {
    id: "prod-5",
    title: "Sunset Lamp Projector",
    category: "Home Decor",
    price: 19.99,
    sold: 33210,
    soldDelta: 3890,
    commissionPct: 18,
    velocity: 518,
    growthRate: 22.1,
    imageUrl: "https://picsum.photos/seed/prod5/200",
    shopName: "AmbientVibes",
    locale: "US",
    productUrl: "#",
  },
  {
    id: "prod-6",
    title: "Cloud Slides Pillow Slippers",
    category: "Fashion",
    price: 16.99,
    sold: 52340,
    soldDelta: 6120,
    commissionPct: 14,
    velocity: 816,
    growthRate: 28.9,
    imageUrl: "https://picsum.photos/seed/prod6/200",
    shopName: "ComfyWear",
    locale: "US",
    productUrl: "#",
  },
  {
    id: "prod-7",
    title: "Mini Waffle Maker",
    category: "Home & Kitchen",
    price: 14.99,
    sold: 18920,
    soldDelta: 2210,
    commissionPct: 16,
    velocity: 294,
    growthRate: 16.7,
    imageUrl: "https://picsum.photos/seed/prod7/200",
    shopName: "KitchenJoy",
    locale: "UK",
    productUrl: "#",
  },
  {
    id: "prod-8",
    title: "Glass Skin Serum Set",
    category: "Beauty",
    price: 28.99,
    sold: 21450,
    soldDelta: 2890,
    commissionPct: 22,
    velocity: 385,
    growthRate: 19.4,
    imageUrl: "https://picsum.photos/seed/prod8/200",
    shopName: "K-Beauty Hub",
    locale: "UK",
    productUrl: "#",
  },
];

// Mock Sounds
export const mockSounds: Sound[] = [
  {
    id: "sound-1",
    title: "original sound - viral beat",
    author: "@beatmaker_official",
    rank: 1,
    rankDelta: 2,
    videoCount: 1250000,
    videoCountDelta: 89000,
    growthRate: 7.6,
    coverUrl: "https://picsum.photos/seed/sound1/100",
    soundUrl: "#",
    locale: "US",
  },
  {
    id: "sound-2",
    title: "Summer Vibes - Remix",
    author: "@djsunshine",
    rank: 2,
    rankDelta: -1,
    videoCount: 980000,
    videoCountDelta: 45000,
    growthRate: 4.8,
    coverUrl: "https://picsum.photos/seed/sound2/100",
    soundUrl: "#",
    locale: "US",
  },
  {
    id: "sound-3",
    title: "That One Sound",
    author: "@trendysounds",
    rank: 3,
    rankDelta: 5,
    videoCount: 750000,
    videoCountDelta: 120000,
    growthRate: 19.1,
    coverUrl: "https://picsum.photos/seed/sound3/100",
    soundUrl: "#",
    locale: "US",
  },
  {
    id: "sound-4",
    title: "Motivation Monday",
    author: "@successcoach",
    rank: 4,
    rankDelta: 0,
    videoCount: 620000,
    videoCountDelta: 32000,
    growthRate: 5.4,
    coverUrl: "https://picsum.photos/seed/sound4/100",
    soundUrl: "#",
    locale: "US",
  },
  {
    id: "sound-5",
    title: "POV: You Found It",
    author: "@storytime.queen",
    rank: 5,
    rankDelta: 3,
    videoCount: 540000,
    videoCountDelta: 68000,
    growthRate: 14.4,
    coverUrl: "https://picsum.photos/seed/sound5/100",
    soundUrl: "#",
    locale: "US",
  },
  {
    id: "sound-6",
    title: "UK Drill Beat 2024",
    author: "@ukbeats",
    rank: 1,
    rankDelta: 1,
    videoCount: 420000,
    videoCountDelta: 38000,
    growthRate: 9.9,
    coverUrl: "https://picsum.photos/seed/sound6/100",
    soundUrl: "#",
    locale: "UK",
  },
  {
    id: "sound-7",
    title: "Get Ready With Me",
    author: "@grwm.daily",
    rank: 2,
    rankDelta: 4,
    videoCount: 380000,
    videoCountDelta: 52000,
    growthRate: 15.8,
    coverUrl: "https://picsum.photos/seed/sound7/100",
    soundUrl: "#",
    locale: "UK",
  },
];

// Mock Creators
export const mockCreators: Creator[] = [
  {
    id: "creator-1",
    username: "lifestylewithlex",
    displayName: "Lex Thompson",
    avatarUrl: "https://picsum.photos/seed/creator1/100",
    followers: 2450000,
    gmvDriven: 892000,
    engagement: 8.2,
    categories: ["Fashion", "Beauty"],
    locale: "US",
  },
  {
    id: "creator-2",
    username: "techreviews.daily",
    displayName: "Marcus Chen",
    avatarUrl: "https://picsum.photos/seed/creator2/100",
    followers: 1820000,
    gmvDriven: 1245000,
    engagement: 6.8,
    categories: ["Electronics", "Tech"],
    locale: "US",
  },
  {
    id: "creator-3",
    username: "homehacks101",
    displayName: "Sarah Mitchell",
    avatarUrl: "https://picsum.photos/seed/creator3/100",
    followers: 3120000,
    gmvDriven: 2180000,
    engagement: 9.1,
    categories: ["Home & Kitchen", "Lifestyle"],
    locale: "US",
  },
  {
    id: "creator-4",
    username: "beautybyjenna",
    displayName: "Jenna Williams",
    avatarUrl: "https://picsum.photos/seed/creator4/100",
    followers: 890000,
    gmvDriven: 456000,
    engagement: 11.2,
    categories: ["Beauty", "Skincare"],
    locale: "UK",
  },
];

// Mock Shops
export const mockShops: Shop[] = [
  {
    id: "shop-1",
    name: "TechGlow Store",
    logoUrl: "https://picsum.photos/seed/shop1/100",
    totalProducts: 245,
    totalSales: 125000,
    avgRating: 4.7,
    locale: "US",
  },
  {
    id: "shop-2",
    name: "SkinCare Pro",
    logoUrl: "https://picsum.photos/seed/shop2/100",
    totalProducts: 89,
    totalSales: 312000,
    avgRating: 4.9,
    locale: "US",
  },
  {
    id: "shop-3",
    name: "ComfyWear",
    logoUrl: "https://picsum.photos/seed/shop3/100",
    totalProducts: 156,
    totalSales: 458000,
    avgRating: 4.6,
    locale: "US",
  },
  {
    id: "shop-4",
    name: "K-Beauty Hub",
    logoUrl: "https://picsum.photos/seed/shop4/100",
    totalProducts: 78,
    totalSales: 189000,
    avgRating: 4.8,
    locale: "UK",
  },
];

// Mock Videos
export const mockVideos: Video[] = [
  {
    id: "video-1",
    thumbnailUrl: "https://picsum.photos/seed/video1/320/180",
    title: "This ring light changed my content game!",
    views: 2450000,
    likes: 185000,
    conversions: 3420,
    productId: "prod-1",
    creatorName: "lifestylewithlex",
    locale: "US",
  },
  {
    id: "video-2",
    thumbnailUrl: "https://picsum.photos/seed/video2/320/180",
    title: "Morning smoothie in 30 seconds",
    views: 5820000,
    likes: 412000,
    conversions: 8950,
    productId: "prod-2",
    creatorName: "homehacks101",
    locale: "US",
  },
  {
    id: "video-3",
    thumbnailUrl: "https://picsum.photos/seed/video3/320/180",
    title: "POV: You finally clear your skin",
    views: 8120000,
    likes: 624000,
    conversions: 12400,
    productId: "prod-3",
    creatorName: "beautybyjenna",
    locale: "US",
  },
];

// Mock Watchlist
export const mockWatchlist: WatchlistItem[] = [
  {
    id: "watch-1",
    itemType: "PRODUCT",
    itemId: "prod-1",
    itemName: "LED Ring Light with Phone Holder",
    itemImage: "https://picsum.photos/seed/prod1/100",
    addedAt: "2026-06-15",
  },
  {
    id: "watch-2",
    itemType: "SOUND",
    itemId: "sound-3",
    itemName: "That One Sound",
    itemImage: "https://picsum.photos/seed/sound3/100",
    addedAt: "2026-06-14",
  },
  {
    id: "watch-3",
    itemType: "SHOP",
    itemId: "shop-2",
    itemName: "SkinCare Pro",
    itemImage: "https://picsum.photos/seed/shop2/100",
    addedAt: "2026-06-12",
  },
];

// Mock Alerts
export const mockAlerts: AlertRule[] = [
  {
    id: "alert-1",
    itemType: "PRODUCT",
    itemName: "LED Ring Light",
    metric: "velocity",
    threshold: 500,
    channel: "email",
    active: true,
    createdAt: "2026-06-10",
  },
  {
    id: "alert-2",
    itemType: "SOUND",
    itemName: "That One Sound",
    metric: "rank_delta",
    threshold: 10,
    channel: "push",
    active: true,
    createdAt: "2026-06-08",
  },
  {
    id: "alert-3",
    itemType: "PRODUCT",
    itemName: "Acne Pimple Patches",
    metric: "growth_rate",
    threshold: 20,
    channel: "email",
    active: false,
    createdAt: "2026-06-05",
  },
];

// Chart data for history
export const generateChartData = (days: number = 30) => {
  const data = [];
  const baseValue = Math.floor(Math.random() * 10000) + 5000;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variance = Math.floor(Math.random() * 2000) - 500;
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.max(0, baseValue + (days - i) * 150 + variance),
    });
  }

  return data;
};

// Categories for filters
export const categories = [
  "All Categories",
  "Electronics",
  "Beauty",
  "Fashion",
  "Home & Kitchen",
  "Home Decor",
  "Sports & Outdoors",
  "Health & Wellness",
  "Baby & Kids",
  "Pet Supplies",
];

// Predictions mock data
export interface Prediction {
  id: string;
  itemType: "PRODUCT" | "SOUND";
  itemName: string;
  itemImage: string;
  confidenceScore: number;
  predictedPeakDate: string;
  currentValue: number;
  predictedPeakValue: number;
  accelerationScore: number;
  signals: string[];
}

export const mockPredictions: Prediction[] = [
  {
    id: "pred-1",
    itemType: "PRODUCT",
    itemName: "UV Sanitizer Box",
    itemImage: "https://picsum.photos/seed/pred1/100",
    confidenceScore: 87,
    predictedPeakDate: "2026-07-15",
    currentValue: 1240,
    predictedPeakValue: 8500,
    accelerationScore: 42,
    signals: ["48h velocity spike", "Rising search volume", "Influencer pickup detected"],
  },
  {
    id: "pred-2",
    itemType: "SOUND",
    itemName: "That New Beat Drop",
    itemImage: "https://picsum.photos/seed/pred2/100",
    confidenceScore: 92,
    predictedPeakDate: "2026-07-12",
    currentValue: 45000,
    predictedPeakValue: 850000,
    accelerationScore: 68,
    signals: ["Exponential growth pattern", "Multiple viral remixes", "Cross-platform spread"],
  },
  {
    id: "pred-3",
    itemType: "PRODUCT",
    itemName: "Magnetic Eyelashes Set",
    itemImage: "https://picsum.photos/seed/pred3/100",
    confidenceScore: 78,
    predictedPeakDate: "2026-07-18",
    currentValue: 3200,
    predictedPeakValue: 12000,
    accelerationScore: 35,
    signals: ["Category trending up", "Commission rate increased", "Tutorial videos surging"],
  },
];
