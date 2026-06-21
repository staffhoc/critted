/**
 * TikHub API Client
 * Handles all interactions with TikHub.io API for TikTok Shop data
 */

const TIKHUB_BASE_URL = "https://api.tikhub.io";

interface TikHubConfig {
  apiKey: string;
}

// TikHub API can return different response formats depending on the endpoint
interface TikHubResponse<T> {
  code?: number;
  message?: string;
  data?: T;
  // Some endpoints return data directly
  [key: string]: unknown;
}

// ============================================================================
// TYPES - TikTok Shop Products
// ============================================================================

export interface TikHubProduct {
  product_id: string;
  title: string;
  description?: string;
  cover_image?: string;
  price: number;
  original_price?: number;
  currency: string;
  commission_rate?: number;
  category_id?: string;
  category_name?: string;
  shop_id?: string;
  shop_name?: string;
  sold_count: number;
  rating?: number;
  review_count?: number;
  video_count?: number;
}

export interface TikHubProductList {
  products: TikHubProduct[];
  total: number;
  has_more: boolean;
  cursor?: string;
}

// Response types for /api/v1/tiktok/ads/get_top_products
// This endpoint returns TikTok Ads Creative Center data - trending ad products
interface TikHubTopProductsResponse {
  list: TikHubTopProductItem[];
  pagination?: {
    page: number;
    size: number;
    total: number;
    has_more: boolean;
  };
}

interface TikHubEcomCategory {
  id?: string;
  label?: string;
  value?: string;
  parent_id?: string;
}

interface TikHubTopProductItem {
  // Product identification
  url_title?: string;
  cover_url?: string | null;

  // Category hierarchy (objects, not strings)
  first_ecom_category?: TikHubEcomCategory;
  second_ecom_category?: TikHubEcomCategory;
  third_ecom_category?: TikHubEcomCategory;

  // Engagement metrics
  comment?: number;
  like?: number;
  share?: number;

  // Performance metrics
  ctr?: number;  // Click-through rate
  cvr?: number;  // Conversion rate
  cpa?: number;  // Cost per acquisition
  cost?: number;

  // Posting volume (this is the "viral" indicator)
  post?: number;        // Number of posts/videos featuring this product
  post_change?: number; // Change in post count

  // Reach metrics
  impression?: number;
  play_six_rate?: number;
}

// Response types for Douyin music endpoints
interface TikHubDouyinMusicListResponse {
  music_list?: TikHubDouyinMusic[];
  musics?: TikHubDouyinMusic[];
  has_more?: boolean;
  cursor?: string;
}

interface TikHubDouyinMusic {
  id?: string;
  mid?: string;
  music_id?: string;
  title?: string;
  music_name?: string;
  author?: string;
  author_name?: string;
  duration?: number;
  cover?: {
    url_list?: string[];
  };
  cover_url?: string;
  play_url?: {
    url_list?: string[];
  };
  play_url_str?: string;
  user_count?: number;
  video_count?: number;
  is_original?: boolean;
}

// ============================================================================
// TYPES - TikTok Sounds/Music
// ============================================================================

export interface TikHubSound {
  music_id: string;
  title: string;
  author_name?: string;
  duration: number;
  cover_url?: string;
  play_url?: string;
  video_count: number;
  is_original?: boolean;
}

export interface TikHubSoundList {
  sounds: TikHubSound[];
  total: number;
  has_more: boolean;
  cursor?: string;
}

// ============================================================================
// TYPES - TikTok Shops
// ============================================================================

export interface TikHubShop {
  shop_id: string;
  shop_name: string;
  logo_url?: string;
  description?: string;
  product_count: number;
  sold_count: number;
  rating?: number;
  review_count?: number;
  follower_count?: number;
  is_verified?: boolean;
}

export interface TikHubShopList {
  shops: TikHubShop[];
  total: number;
  has_more: boolean;
  cursor?: string;
}

// ============================================================================
// TYPES - TikTok Creators
// ============================================================================

export interface TikHubCreator {
  user_id: string;
  unique_id: string; // username
  nickname: string;
  avatar_url?: string;
  bio?: string;
  follower_count: number;
  following_count: number;
  video_count: number;
  like_count: number;
  is_verified?: boolean;
}

// ============================================================================
// TYPES - TikTok Videos
// ============================================================================

export interface TikHubVideo {
  video_id: string;
  description?: string;
  cover_url?: string;
  play_url?: string;
  duration: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  create_time: number;
  author?: TikHubCreator;
  music?: TikHubSound;
}

// ============================================================================
// TYPES - Trending Data
// ============================================================================

export interface TikHubTrendingProducts {
  products: TikHubProduct[];
  region: string;
  updated_at: string;
}

export interface TikHubTrendingSounds {
  sounds: TikHubSound[];
  region: string;
  updated_at: string;
}

// ============================================================================
// API CLIENT
// ============================================================================

class TikHubClient {
  private apiKey: string;

  constructor(config: TikHubConfig) {
    this.apiKey = config.apiKey;
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ): Promise<T> {
    const url = new URL(`${TIKHUB_BASE_URL}${endpoint}`);

    // Add query params
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log(`[TikHub] Requesting: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[TikHub] HTTP Error: ${response.status} - ${error}`);
      throw new Error(`TikHub API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log(`[TikHub] Response keys:`, Object.keys(result));
    console.log(`[TikHub] Full response (first 2000 chars):`, JSON.stringify(result, null, 2).slice(0, 2000));

    // Handle different response formats
    // TikHub API returns code: 200 for success (not 0)
    // Some endpoints return { code: 200, data: ... }
    // Some endpoints return data directly
    if (result.code !== undefined) {
      // Success codes: 0 or 200
      if (result.code !== 0 && result.code !== 200) {
        console.error(`[TikHub] API Error: ${result.code} - ${result.message}`);
        throw new Error(`TikHub API error: ${result.code} - ${result.message}`);
      }
      console.log(`[TikHub] Success - code: ${result.code}`);
      console.log(`[TikHub] data field type:`, typeof result.data);
      console.log(`[TikHub] data field keys:`, result.data ? Object.keys(result.data) : "null/undefined");
      return result.data as T;
    }

    // Return the result directly if no code field
    return result as T;
  }

  // ==========================================================================
  // SHOP ENDPOINTS
  // ==========================================================================

  /**
   * Get trending/top products from TikTok Shop Ads API
   * @see https://docs.tikhub.io/308858140e0
   */
  async getTopProducts(options: {
    region?: string;
    category_id?: string;
    sort_by?: "post" | "ctr" | "cvr";
    limit?: number;
    page?: number;
    last?: number; // Number of recent days (7, 30)
  } = {}): Promise<TikHubProductList> {
    const result = await this.request<TikHubTopProductsResponse>(
      "/api/v1/tiktok/ads/get_top_products",
      {
        country_code: options.region || "US",
        first_ecom_category_id: options.category_id,
        order_by: options.sort_by || "post",
        order_type: "desc",
        limit: options.limit || 50,
        page: options.page || 1,
        last: options.last || 7,
        period_type: "last",
        ecom_type: "l3",
      }
    );

    // Debug: Log the actual response structure
    console.log(`[TikHub] getTopProducts result type:`, typeof result);
    console.log(`[TikHub] getTopProducts result keys:`, result ? Object.keys(result) : "null");
    console.log(`[TikHub] getTopProducts list length:`, result?.list?.length ?? "undefined");
    console.log(`[TikHub] getTopProducts full result:`, JSON.stringify(result, null, 2).slice(0, 1000));

    // Transform the response to our standard format
    // API returns 'list' field, not 'materials'
    const items = result?.list || [];
    return {
      products: items.map(this.transformTopProduct),
      total: result?.pagination?.total || items.length,
      has_more: result?.pagination?.has_more || false,
      cursor: undefined,
    };
  }

  /**
   * Transform TikHub Ads top products response to our standard format
   * Note: This endpoint returns ad performance data, not actual product details
   * We use 'post' count as a proxy for sales velocity (virality indicator)
   */
  private transformTopProduct(item: TikHubTopProductItem): TikHubProduct {
    // Generate a unique ID from url_title (the product title/name from ads)
    const title = item.url_title || "";
    const productId = title ? Buffer.from(title).toString("base64").slice(0, 32) : `product-${Date.now()}`;

    // Get category from the nested object
    const categoryName = item.third_ecom_category?.label
      || item.second_ecom_category?.label
      || item.first_ecom_category?.label
      || undefined;

    const categoryId = item.third_ecom_category?.id
      || item.second_ecom_category?.id
      || item.first_ecom_category?.id
      || undefined;

    return {
      product_id: productId,
      title: title,
      description: undefined, // Not available from ads endpoint
      cover_image: item.cover_url || undefined,
      price: 0, // Not available from ads endpoint
      original_price: 0,
      currency: "USD",
      commission_rate: undefined, // Not available
      category_id: categoryId,
      category_name: categoryName,
      shop_id: undefined, // Not available from ads endpoint
      shop_name: undefined,
      // Use 'post' count as a proxy for popularity/virality
      sold_count: item.post || 0,
      rating: undefined,
      review_count: undefined,
      video_count: item.post || 0,
    };
  }

  /**
   * Search products
   */
  async searchProducts(options: {
    keyword: string;
    region?: string;
    sort_by?: "relevance" | "sold" | "price_asc" | "price_desc";
    limit?: number;
    cursor?: string;
  }): Promise<TikHubProductList> {
    return this.request<TikHubProductList>("/api/v1/shop/web/products/search", {
      keyword: options.keyword,
      region: options.region || "US",
      sort_by: options.sort_by || "sold",
      count: options.limit || 50,
      cursor: options.cursor,
    });
  }

  /**
   * Get product details
   */
  async getProductDetails(productId: string, region?: string): Promise<TikHubProduct> {
    return this.request<TikHubProduct>("/api/v1/shop/web/product/details", {
      product_id: productId,
      region: region || "US",
    });
  }

  /**
   * Get shop details
   */
  async getShopDetails(shopId: string, region?: string): Promise<TikHubShop> {
    return this.request<TikHubShop>("/api/v1/shop/web/shop/details", {
      shop_id: shopId,
      region: region || "US",
    });
  }

  /**
   * Get top shops - Note: TikHub doesn't have a direct "top shops" endpoint
   * We'll use the top products endpoint and extract unique shops from them
   */
  async getTopShops(options: {
    region?: string;
    category_id?: string;
    limit?: number;
    cursor?: string;
  } = {}): Promise<TikHubShopList> {
    try {
      // Fetch top products and extract shop information
      const products = await this.getTopProducts({
        region: options.region,
        category_id: options.category_id,
        limit: 100, // Get more products to extract unique shops
      });

      // Extract unique shops from products
      const shopMap = new Map<string, TikHubShop>();
      for (const product of products.products) {
        if (product.shop_id && !shopMap.has(product.shop_id)) {
          shopMap.set(product.shop_id, {
            shop_id: product.shop_id,
            shop_name: product.shop_name || "Unknown Shop",
            product_count: 1,
            sold_count: product.sold_count,
          });
        } else if (product.shop_id) {
          const shop = shopMap.get(product.shop_id)!;
          shop.product_count = (shop.product_count || 0) + 1;
          shop.sold_count = (shop.sold_count || 0) + product.sold_count;
        }
      }

      const shops = Array.from(shopMap.values()).slice(0, options.limit || 50);

      return {
        shops,
        total: shops.length,
        has_more: false,
      };
    } catch {
      console.log("[TikHub] Failed to extract shops from products");
      return {
        shops: [],
        total: 0,
        has_more: false,
      };
    }
  }

  // ==========================================================================
  // SOUNDS/MUSIC ENDPOINTS
  // ==========================================================================

  /**
   * Get trending sounds/music from TikTok
   * Uses the music search with trending keywords as a workaround
   * since there's no direct trending music endpoint for TikTok (only Douyin)
   */
  async getTrendingSounds(options: {
    region?: string;
    limit?: number;
    cursor?: string;
  } = {}): Promise<TikHubSoundList> {
    try {
      // Try fetching Douyin music hot search list and adapt it
      const result = await this.request<TikHubDouyinMusicListResponse>(
        "/api/v1/douyin/app/v3/fetch_music_hot_search_list",
        {
          chart_type: "hot",
          cursor: options.cursor || "0",
        }
      );

      return {
        sounds: (result.music_list || result.musics || []).map(this.transformDouyinMusic),
        total: result.music_list?.length || result.musics?.length || 0,
        has_more: result.has_more || false,
        cursor: result.cursor,
      };
    } catch {
      // Fallback: return empty list if Douyin endpoint fails
      console.log("[TikHub] Douyin music endpoint not available, returning empty list");
      return {
        sounds: [],
        total: 0,
        has_more: false,
      };
    }
  }

  /**
   * Transform Douyin music to our standard format
   */
  private transformDouyinMusic(music: TikHubDouyinMusic): TikHubSound {
    return {
      music_id: music.id || music.mid || music.music_id || "",
      title: music.title || music.music_name || "",
      author_name: music.author || music.author_name,
      duration: music.duration || 0,
      cover_url: music.cover?.url_list?.[0] || music.cover_url,
      play_url: music.play_url?.url_list?.[0] || music.play_url_str,
      video_count: music.user_count || music.video_count || 0,
      is_original: music.is_original,
    };
  }

  /**
   * Get sound details
   */
  async getSoundDetails(musicId: string): Promise<TikHubSound> {
    return this.request<TikHubSound>("/api/v1/app/v3/music/details", {
      music_id: musicId,
    });
  }

  /**
   * Search sounds
   */
  async searchSounds(options: {
    keyword: string;
    limit?: number;
    cursor?: string;
  }): Promise<TikHubSoundList> {
    return this.request<TikHubSoundList>("/api/v1/app/v3/search/music", {
      keyword: options.keyword,
      count: options.limit || 50,
      cursor: options.cursor,
    });
  }

  // ==========================================================================
  // USER/CREATOR ENDPOINTS
  // ==========================================================================

  /**
   * Get user profile
   */
  async getUserProfile(username: string): Promise<TikHubCreator> {
    return this.request<TikHubCreator>("/api/v1/app/v3/user/profile", {
      unique_id: username,
    });
  }

  /**
   * Get user videos
   */
  async getUserVideos(options: {
    user_id?: string;
    unique_id?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ videos: TikHubVideo[]; has_more: boolean; cursor?: string }> {
    return this.request("/api/v1/app/v3/user/posts", {
      user_id: options.user_id,
      unique_id: options.unique_id,
      count: options.limit || 30,
      cursor: options.cursor,
    });
  }

  // ==========================================================================
  // VIDEO ENDPOINTS
  // ==========================================================================

  /**
   * Get video details
   */
  async getVideoDetails(videoId: string): Promise<TikHubVideo> {
    return this.request<TikHubVideo>("/api/v1/app/v3/video/details", {
      video_id: videoId,
    });
  }

  /**
   * Get videos using a sound
   */
  async getVideosBySound(options: {
    music_id: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ videos: TikHubVideo[]; has_more: boolean; cursor?: string }> {
    return this.request("/api/v1/app/v3/music/videos", {
      music_id: options.music_id,
      count: options.limit || 30,
      cursor: options.cursor,
    });
  }

  // ==========================================================================
  // TRENDING ENDPOINTS
  // ==========================================================================

  /**
   * Get daily trending posts
   */
  async getTrendingPosts(options: {
    region?: string;
    limit?: number;
  } = {}): Promise<{ videos: TikHubVideo[] }> {
    return this.request("/api/v1/app/v3/explore/trending", {
      region: options.region || "US",
      count: options.limit || 50,
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let tikHubInstance: TikHubClient | null = null;

export function getTikHub(): TikHubClient {
  if (!tikHubInstance) {
    const apiKey = process.env.TIKHUB_API_KEY;
    if (!apiKey) {
      throw new Error("TIKHUB_API_KEY environment variable is not set");
    }
    tikHubInstance = new TikHubClient({ apiKey });
  }
  return tikHubInstance;
}

// ============================================================================
// REGION MAPPING
// ============================================================================

export const LOCALE_TO_REGION: Record<string, string> = {
  US: "US",
  UK: "GB",
  ID: "ID",
  MY: "MY",
  TH: "TH",
  VN: "VN",
  PH: "PH",
  NG: "NG",
  KE: "KE",
  DE: "DE",
  CA: "CA",
  UG: "UG",
};

export function localeToRegion(locale: string): string {
  return LOCALE_TO_REGION[locale] || "US";
}
