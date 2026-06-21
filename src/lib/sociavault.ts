/**
 * SociaVault API Client
 *
 * API Documentation: https://docs.sociavault.com
 * Base URL: https://api.sociavault.com
 * Authentication: X-API-Key header
 */

const BASE_URL = "https://api.sociavault.com";

// =============================================================================
// Response Types
// =============================================================================

// Shop Search Response
export interface SociaVaultShopSearchProduct {
  product_id: string;
  title: string;
  image?: {
    url_list?: string[];
  };
  product_price_info?: {
    currency_name?: string;
    currency_symbol?: string;
    sale_price_decimal?: string;
    origin_price_decimal?: string;
    sale_price_format?: string;
  };
  rate_info?: {
    score?: number;
    review_count?: number;
  };
  sold_info?: {
    sold_count?: string; // e.g., "15.2k" or "15"
  };
  seller_info?: {
    seller_id?: string;
    shop_name?: string;
    shop_logo?: {
      url_list?: string[];
    };
  };
  seo_url?: {
    canonical_url?: string;
    slug?: string;
  };
}

export interface SociaVaultShopSearchResponse {
  success: boolean;
  products?: SociaVaultShopSearchProduct[];
  page?: number;
  has_more?: boolean;
  credits_used?: number;
}

// Shop Products Response (all products from a shop)
export interface SociaVaultShopInfo {
  seller_id?: string;
  shop_name?: string;
  shop_rating?: number;
  shop_link?: string;
  sold_count?: string;
  followers_count?: number;
  video_count?: number;
  review_count?: number;
  on_sell_product_count?: number;
  shop_logo?: {
    url_list?: string[];
  };
}

export interface SociaVaultShopProductsResponse {
  success: boolean;
  shopInfo?: SociaVaultShopInfo;
  products?: SociaVaultShopSearchProduct[];
  cursor?: string;
  has_more?: boolean;
  credits_used?: number;
}

// Product Details Response
export interface SociaVaultProductDetails {
  product_id: string;
  title: string;
  images?: Array<{ url_list?: string[] }>;
  description?: string;
  specifications?: Record<string, string>;
  category_name?: string;
  category_id?: string;
  stock_quantity?: number;
  price_info?: {
    currency?: string;
    sale_price?: string;
    origin_price?: string;
    discount_percentage?: number;
  };
  sold_count?: string;
  rating?: number;
  review_count?: number;
  seller?: {
    shop_name?: string;
    shop_avatar?: string;
    product_count?: number;
    response_rate?: number;
    on_time_shipping?: number;
    total_reviews?: number;
    followers?: number;
  };
  related_videos?: Array<{
    video_id?: string;
    cover_url?: string;
    play_count?: number;
  }>;
}

export interface SociaVaultProductDetailsResponse {
  success: boolean;
  data?: SociaVaultProductDetails;
  credits_used?: number;
}

// Popular Music Response
export interface SociaVaultPopularSound {
  song_id?: string;
  clip_id?: string;
  title: string;
  author: string;
  cover?: string;
  link?: string;
  rank: number;
  rank_diff?: number;
  duration?: number;
  if_cml?: boolean; // commercial license
  promoted?: boolean;
  trend?: Array<{
    time: number;
    value: number;
  }>;
  related_items?: Array<{
    item_id?: string;
    cover?: string;
  }>;
}

export interface SociaVaultPopularMusicResponse {
  success: boolean;
  sound_list?: SociaVaultPopularSound[];
  pagination?: {
    page: number;
    size: number;
    total: number;
    has_more: boolean;
  };
  credits_used?: number;
}

// Music Details Response
export interface SociaVaultMusicDetails {
  music_info?: {
    id_str?: string;
    title?: string;
    author?: string;
    album?: string;
    duration?: number;
    user_count?: number;
    create_time?: number;
    is_original?: boolean;
    is_commerce_music?: boolean;
    cover_large?: {
      url_list?: string[];
    };
    play_url?: {
      url_list?: string[];
    };
  };
}

export interface SociaVaultMusicDetailsResponse {
  success: boolean;
  data?: SociaVaultMusicDetails;
  credits_used?: number;
}

// Search Music Response
export interface SociaVaultSearchMusicItem {
  id?: string;
  id_str?: string;
  title?: string;
  author?: string;
  album?: string;
  duration?: number;
  user_count?: number;
  cover_large?: {
    url_list?: string[];
  };
  play_url?: {
    url_list?: string[];
  };
}

export interface SociaVaultSearchMusicResponse {
  success: boolean;
  music_list?: SociaVaultSearchMusicItem[];
  has_more?: number; // 0 or 1
  cursor?: number;
  credits_used?: number;
}

// Popular Creators Response
export interface SociaVaultCreator {
  tcm_id?: string;
  user_id?: string;
  nick_name?: string;
  avatar_url?: string;
  country_code?: string;
  follower_cnt?: number;
  liked_cnt?: number;
  tt_link?: string;
  items?: Array<{
    item_id?: string;
    cover_url?: string;
    vv?: number; // views
    liked_cnt?: number;
    create_time?: number;
  }>;
}

export interface SociaVaultPopularCreatorsResponse {
  success: boolean;
  data?: {
    creators?: SociaVaultCreator[];
    pagination?: {
      page: number;
      per_page: number;
      total_pages: number;
      has_more: boolean;
    };
  };
  credits_used?: number;
}

// Trending Feed Response
export interface SociaVaultTrendingVideo {
  aweme_id?: string;
  desc?: string;
  create_time?: number;
  statistics?: {
    play_count?: number;
    digg_count?: number;
    comment_count?: number;
    share_count?: number;
    collect_count?: number;
  };
  video?: {
    play_addr?: { url_list?: string[] };
    cover?: { url_list?: string[] };
    duration?: number;
    height?: number;
    width?: number;
  };
  author?: {
    unique_id?: string;
    nickname?: string;
    sec_uid?: string;
    avatar_medium?: { url_list?: string[] };
  };
  music?: {
    title?: string;
    author?: string;
    play_url?: { url_list?: string[] };
    duration?: number;
    is_commerce_music?: boolean;
  };
}

export interface SociaVaultTrendingFeedResponse {
  success: boolean;
  aweme_list?: SociaVaultTrendingVideo[];
  credits_used?: number;
}

// Popular Hashtags Response
export interface SociaVaultPopularHashtag {
  hashtag_id?: string;
  hashtag_name: string;
  video_count?: number;
  view_count?: number;
  rank: number;
  rank_change?: number;
  is_stable?: boolean;
  country_code?: string;
  industry?: string;
  trend?: Array<{
    time: number;
    value: number;
  }>;
}

export interface SociaVaultPopularHashtagsResponse {
  success: boolean;
  hashtags?: SociaVaultPopularHashtag[];
  pagination?: {
    page: number;
    total: number;
    has_more: boolean;
  };
  credits_used?: number;
}

// Popular Videos Response
export interface SociaVaultPopularVideo {
  video_id?: string;
  aweme_id?: string;
  item_id?: string;
  desc?: string;
  thumbnail_url?: string;
  duration?: number;
  link?: string;
  country_code?: string;
  region_name?: string;
  statistics?: {
    play_count?: number;
    digg_count?: number;
    comment_count?: number;
    share_count?: number;
    collect_count?: number;
  };
}

export interface SociaVaultPopularVideosResponse {
  success: boolean;
  videos?: SociaVaultPopularVideo[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
  credits_used?: number;
}

// =============================================================================
// Normalized Types (for internal use)
// =============================================================================

export interface NormalizedProduct {
  product_id: string;
  title: string;
  description?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  currency: string;
  sold_count: number;
  rating?: number;
  review_count?: number;
  shop_id?: string;
  shop_name?: string;
  shop_logo?: string;
  canonical_url?: string;
}

export interface NormalizedShop {
  shop_id: string;
  name: string;
  logo_url?: string;
  rating?: number;
  sold_count: number;
  followers_count?: number;
  product_count?: number;
  review_count?: number;
}

export interface NormalizedSound {
  sound_id: string;
  clip_id?: string;
  title: string;
  author: string;
  cover_url?: string;
  link?: string;
  rank: number;
  rank_change?: number;
  duration?: number;
  video_count?: number;
  is_commercial?: boolean;
  trend_data?: Array<{ time: number; value: number }>;
}

export interface NormalizedHashtag {
  hashtag_id: string;
  name: string;
  video_count: number;
  view_count: number;
  rank: number;
  rank_change?: number;
  country_code?: string;
  trend_data?: Array<{ time: number; value: number }>;
}

export interface NormalizedVideo {
  video_id: string;
  description?: string;
  thumbnail_url?: string;
  duration?: number;
  link?: string;
  country_code?: string;
  play_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  collect_count: number;
}

// =============================================================================
// SociaVault Client Class
// =============================================================================

class SociaVaultClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SOCIAVAULT_API_KEY || "";
    if (!this.apiKey) {
      console.warn("[SociaVault] No API key provided. Set SOCIAVAULT_API_KEY environment variable.");
    }
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);

    // Add query params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });

    console.log(`[SociaVault] Request: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[SociaVault] HTTP Error: ${response.status} - ${error}`);
      throw new Error(`SociaVault API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log(`[SociaVault] Response keys:`, Object.keys(result));
    // Log first 500 chars of response for debugging
    console.log(`[SociaVault] Response preview:`, JSON.stringify(result).slice(0, 500));

    if (result.success === false) {
      console.error(`[SociaVault] API Error:`, result);
      throw new Error(`SociaVault API error: ${JSON.stringify(result)}`);
    }

    return result as T;
  }

  // ===========================================================================
  // TikTok Shop Endpoints
  // ===========================================================================

  /**
   * Search TikTok Shop products by keyword
   * Returns 30 products per page
   */
  async searchProducts(options: {
    query: string;
    page?: number;
    region?: string;
  }): Promise<{ products: NormalizedProduct[]; hasMore: boolean }> {
    const response = await this.request<SociaVaultShopSearchResponse>(
      "/v1/scrape/tiktok-shop/search",
      {
        query: options.query,
        page: options.page || 1,
        region: options.region || "US",
      }
    );

    const products = (response.products || []).map(this.normalizeProduct);

    return {
      products,
      hasMore: response.has_more || false,
    };
  }

  /**
   * Get all products from a specific TikTok Shop
   */
  async getShopProducts(options: {
    shopUrl: string;
    cursor?: string;
    region?: string;
  }): Promise<{ shop: NormalizedShop | null; products: NormalizedProduct[]; cursor?: string; hasMore: boolean }> {
    const response = await this.request<SociaVaultShopProductsResponse>(
      "/v1/scrape/tiktok-shop/products",
      {
        url: options.shopUrl,
        cursor: options.cursor,
        region: options.region || "US",
      }
    );

    const shop = response.shopInfo ? this.normalizeShopInfo(response.shopInfo) : null;
    const products = (response.products || []).map(this.normalizeProduct);

    return {
      shop,
      products,
      cursor: response.cursor,
      hasMore: response.has_more || false,
    };
  }

  /**
   * Get detailed information about a specific product
   */
  async getProductDetails(options: {
    productUrl: string;
    getRelatedVideos?: boolean;
    region?: string;
  }): Promise<SociaVaultProductDetails | null> {
    const response = await this.request<SociaVaultProductDetailsResponse>(
      "/v1/scrape/tiktok-shop/product-details",
      {
        url: options.productUrl,
        get_related_videos: options.getRelatedVideos,
        region: options.region || "US",
      }
    );

    return response.data || null;
  }

  // ===========================================================================
  // TikTok Music/Sounds Endpoints
  // ===========================================================================

  /**
   * Get popular/trending sounds from TikTok
   * Note: This endpoint can take up to 30 seconds to respond
   */
  async getPopularSounds(options: {
    page?: number;
    timePeriod?: "7" | "30" | "130";
    rankType?: "popular" | "surging";
    newOnBoard?: boolean;
    commercialMusic?: boolean;
    countryCode?: string;
  } = {}): Promise<{ sounds: NormalizedSound[]; hasMore: boolean; total: number }> {
    const response = await this.request<SociaVaultPopularMusicResponse>(
      "/v1/scrape/tiktok/music/popular",
      {
        page: options.page || 1,
        timePeriod: options.timePeriod || "7",
        rankType: options.rankType || "popular",
        newOnBoard: options.newOnBoard,
        commercialMusic: options.commercialMusic,
        countryCode: options.countryCode || "US",
      }
    );

    const sounds = (response.sound_list || []).map(this.normalizeSound);

    return {
      sounds,
      hasMore: response.pagination?.has_more || false,
      total: response.pagination?.total || sounds.length,
    };
  }

  /**
   * Get details for a specific sound/music clip
   */
  async getSoundDetails(clipId: string): Promise<SociaVaultMusicDetails | null> {
    const response = await this.request<SociaVaultMusicDetailsResponse>(
      "/v1/scrape/tiktok/music/details",
      { clipId }
    );

    return response.data || null;
  }

  /**
   * Search for music/sounds by keyword
   * Use this as a fallback when the popular music endpoint is down
   */
  async searchSounds(options: {
    keyword: string;
    region?: string;
    sortType?: "0" | "1" | "2" | "3" | "4"; // 0=relevance, 1=most used, 2=most recent
    offset?: number;
  }): Promise<{ sounds: NormalizedSound[]; hasMore: boolean; cursor?: number }> {
    const response = await this.request<SociaVaultSearchMusicResponse>(
      "/v1/scrape/tiktok/search/music",
      {
        keyword: options.keyword,
        region: options.region || "US",
        sort_type: options.sortType || "1", // Most used by default
        offset: options.offset,
      }
    );

    const sounds = (response.music_list || []).map((music, index) =>
      this.normalizeSearchMusic(music, index + 1 + (options.offset || 0))
    );

    return {
      sounds,
      hasMore: response.has_more === 1,
      cursor: response.cursor,
    };
  }

  // ===========================================================================
  // TikTok Trending/Popular Endpoints
  // ===========================================================================

  /**
   * Get trending feed videos
   */
  async getTrendingFeed(options: {
    region?: string;
    trim?: boolean;
  } = {}): Promise<SociaVaultTrendingVideo[]> {
    const response = await this.request<SociaVaultTrendingFeedResponse>(
      "/v1/scrape/tiktok/trending",
      {
        region: options.region || "US",
        trim: options.trim,
      }
    );

    return response.aweme_list || [];
  }

  /**
   * Get popular creators
   */
  async getPopularCreators(options: {
    page?: number;
    sortBy?: "engagement" | "follower" | "avg_views";
    followerCount?: "10K-100K" | "100K-1M" | "1M-10M" | "10M+";
    creatorCountry?: string;
    audienceCountry?: string;
  } = {}): Promise<{ creators: SociaVaultCreator[]; hasMore: boolean }> {
    const response = await this.request<SociaVaultPopularCreatorsResponse>(
      "/v1/scrape/tiktok/creators/popular",
      {
        page: options.page || 1,
        sortBy: options.sortBy,
        followerCount: options.followerCount,
        creatorCountry: options.creatorCountry,
        audienceCountry: options.audienceCountry,
      }
    );

    return {
      creators: response.data?.creators || [],
      hasMore: response.data?.pagination?.has_more || false,
    };
  }

  /**
   * Get popular hashtags
   */
  async getPopularHashtags(options: {
    page?: number;
    period?: 7 | 30 | 120;
    countryCode?: string;
    newOnBoard?: boolean;
  } = {}): Promise<{ hashtags: NormalizedHashtag[]; hasMore: boolean; total: number }> {
    const response = await this.request<SociaVaultPopularHashtagsResponse>(
      "/v1/scrape/tiktok/hashtags/popular",
      {
        page: options.page || 1,
        period: options.period || 7,
        countryCode: options.countryCode || "US",
        newOnBoard: options.newOnBoard,
      }
    );

    const hashtags = (response.hashtags || []).map(this.normalizeHashtag);

    return {
      hashtags,
      hasMore: response.pagination?.has_more || false,
      total: response.pagination?.total || hashtags.length,
    };
  }

  /**
   * Get popular videos
   */
  async getPopularVideos(options: {
    page?: number;
    period?: 7 | 30;
    orderBy?: "like" | "hot" | "comment" | "repost";
    countryCode?: string;
  } = {}): Promise<{ videos: NormalizedVideo[]; hasMore: boolean; total: number }> {
    const response = await this.request<SociaVaultPopularVideosResponse>(
      "/v1/scrape/tiktok/videos/popular",
      {
        page: options.page || 1,
        period: options.period || 7,
        orderBy: options.orderBy || "like",
        countryCode: options.countryCode || "US",
      }
    );

    const videos = (response.videos || []).map(this.normalizeVideo);

    return {
      videos,
      hasMore: response.pagination?.has_more || false,
      total: response.pagination?.total || videos.length,
    };
  }

  // ===========================================================================
  // Normalization Helpers
  // ===========================================================================

  private normalizeProduct(product: SociaVaultShopSearchProduct): NormalizedProduct {
    // Parse sold count (can be "15.2k", "1.5M", or plain number)
    const soldCountStr = product.sold_info?.sold_count || "0";
    let soldCount = 0;
    if (typeof soldCountStr === "string") {
      const lower = soldCountStr.toLowerCase();
      if (lower.includes("k")) {
        soldCount = parseFloat(lower.replace("k", "")) * 1000;
      } else if (lower.includes("m")) {
        soldCount = parseFloat(lower.replace("m", "")) * 1000000;
      } else {
        soldCount = parseInt(soldCountStr, 10) || 0;
      }
    }

    // Parse price
    const priceStr = product.product_price_info?.sale_price_decimal || "0";
    const price = parseFloat(priceStr) || 0;

    const originalPriceStr = product.product_price_info?.origin_price_decimal || priceStr;
    const originalPrice = parseFloat(originalPriceStr) || price;

    return {
      product_id: product.product_id,
      title: product.title,
      image_url: product.image?.url_list?.[0],
      price,
      original_price: originalPrice,
      currency: product.product_price_info?.currency_name || "USD",
      sold_count: soldCount,
      rating: product.rate_info?.score,
      review_count: product.rate_info?.review_count,
      shop_id: product.seller_info?.seller_id,
      shop_name: product.seller_info?.shop_name,
      shop_logo: product.seller_info?.shop_logo?.url_list?.[0],
      canonical_url: product.seo_url?.canonical_url,
    };
  }

  private normalizeShopInfo(shop: SociaVaultShopInfo): NormalizedShop {
    // Parse sold count
    const soldCountStr = shop.sold_count || "0";
    let soldCount = 0;
    if (typeof soldCountStr === "string") {
      const lower = soldCountStr.toLowerCase();
      if (lower.includes("k")) {
        soldCount = parseFloat(lower.replace("k", "")) * 1000;
      } else if (lower.includes("m")) {
        soldCount = parseFloat(lower.replace("m", "")) * 1000000;
      } else {
        soldCount = parseInt(soldCountStr, 10) || 0;
      }
    }

    return {
      shop_id: shop.seller_id || "",
      name: shop.shop_name || "Unknown Shop",
      logo_url: shop.shop_logo?.url_list?.[0],
      rating: shop.shop_rating,
      sold_count: soldCount,
      followers_count: shop.followers_count,
      product_count: shop.on_sell_product_count,
      review_count: shop.review_count,
    };
  }

  private normalizeSound(sound: SociaVaultPopularSound): NormalizedSound {
    return {
      sound_id: sound.song_id || sound.clip_id || "",
      clip_id: sound.clip_id,
      title: sound.title,
      author: sound.author,
      cover_url: sound.cover,
      link: sound.link,
      rank: sound.rank,
      rank_change: sound.rank_diff,
      duration: sound.duration,
      is_commercial: sound.if_cml,
      trend_data: sound.trend,
    };
  }

  private normalizeSearchMusic(music: SociaVaultSearchMusicItem, rank: number): NormalizedSound {
    return {
      sound_id: music.id_str || music.id || "",
      clip_id: music.id_str || music.id,
      title: music.title || "Unknown",
      author: music.author || "Unknown",
      cover_url: music.cover_large?.url_list?.[0],
      link: undefined,
      rank,
      rank_change: undefined,
      duration: music.duration,
      video_count: music.user_count,
      is_commercial: undefined,
      trend_data: undefined,
    };
  }

  private normalizeHashtag(hashtag: SociaVaultPopularHashtag): NormalizedHashtag {
    return {
      hashtag_id: hashtag.hashtag_id || hashtag.hashtag_name,
      name: hashtag.hashtag_name,
      video_count: hashtag.video_count || 0,
      view_count: hashtag.view_count || 0,
      rank: hashtag.rank,
      rank_change: hashtag.rank_change,
      country_code: hashtag.country_code,
      trend_data: hashtag.trend,
    };
  }

  private normalizeVideo(video: SociaVaultPopularVideo): NormalizedVideo {
    return {
      video_id: video.video_id || video.aweme_id || video.item_id || "",
      description: video.desc,
      thumbnail_url: video.thumbnail_url,
      duration: video.duration,
      link: video.link,
      country_code: video.country_code,
      play_count: video.statistics?.play_count || 0,
      like_count: video.statistics?.digg_count || 0,
      comment_count: video.statistics?.comment_count || 0,
      share_count: video.statistics?.share_count || 0,
      collect_count: video.statistics?.collect_count || 0,
    };
  }
}

// =============================================================================
// Exports
// =============================================================================

let sociaVaultInstance: SociaVaultClient | null = null;

export function getSociaVault(): SociaVaultClient {
  if (!sociaVaultInstance) {
    sociaVaultInstance = new SociaVaultClient();
  }
  return sociaVaultInstance;
}

export { SociaVaultClient };
