import apiClient from '../utils/apiClient';
import type { HeroBanner, Product, ApiResponse } from '../types/landing';

export const getHeroBanners = async (): Promise<ApiResponse<HeroBanner[]>> => {
    const response = await apiClient.get<ApiResponse<HeroBanner[]>>('/api/cms/hero-banners');
    return response.data;
};

export const getFeaturedProducts = async (): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/public/products?is_featured=true');
    return response.data;
};

export const getProductBySlug = async (slug: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/public/products/${slug}`);
    return response.data;
};

export interface SpotlightItem {
    id: number;
    image_url: string;
    quote: string;
    person_name: string;
    bg_color: string;
    sort_order: number;
    is_active: boolean;
}

export const getSpotlights = async (): Promise<ApiResponse<SpotlightItem[]>> => {
    const response = await apiClient.get<ApiResponse<SpotlightItem[]>>('/public/spotlights');
    return response.data;
};

export interface PopularSectionProduct {
    id: number;
    name: string;
    slug: string;
    primary_image: string;
    secondary_image?: string;
    price: string;
    discounted_price?: string;
}

export interface PopularSectionItem {
    id: number;
    category: string;
    title: string;
    subtitle?: string;
    cta_text: string;
    cta_url: string;
    product_1: PopularSectionProduct | null;
    product_2: PopularSectionProduct | null;
    sort_order: number;
    is_active: boolean;
}

export const getPopularSections = async (): Promise<ApiResponse<PopularSectionItem[]>> => {
    const response = await apiClient.get<ApiResponse<PopularSectionItem[]>>('/public/popular-sections');
    return response.data;
};

export interface ShowcaseTeaTag {
    id: number;
    name: string;
    sort_order: number;
}

export interface ShowcaseTeaProduct {
    id: number;
    name: string;
    image_url: string;
    tag_id: number;
    product_id: number;
    sort_order: number;
    slug: string | null;
}

export interface ShowcaseTeaData {
    tags: ShowcaseTeaTag[];
    products: ShowcaseTeaProduct[];
}

export const getShowcaseTea = async (): Promise<ApiResponse<ShowcaseTeaData>> => {
    const response = await apiClient.get<ApiResponse<ShowcaseTeaData>>('/public/showcase-tea');
    return response.data;
};

export interface TestimonialItem {
    id: number;
    quote: string;
    person_name: string;
    designation: string | null;
    sort_order: number;
    avatar_url: string | null;
}

export const getTestimonials = async (): Promise<ApiResponse<TestimonialItem[]>> => {
    const response = await apiClient.get<ApiResponse<TestimonialItem[]>>('/public/happy-customers');
    return response.data;
};

export interface ProductQueryParams {
    search?: string;
    category?: string;
    sub_category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    tags?: string[];
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
    limit?: number;
    offset?: number;
}

export interface ProductsResponse {
    success: boolean;
    data?: Product[];
    total?: number;
    limit?: number;
    offset?: number;
}

export const getProducts = async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.sub_category) query.set('sub_category', params.sub_category);
    if (params.brand) query.set('brand', params.brand);
    if (params.min_price !== undefined) query.set('min_price', String(params.min_price));
    if (params.max_price !== undefined) query.set('max_price', String(params.max_price));
    if (params.tags?.length) query.set('tags', params.tags.join(','));
    if (params.sort) query.set('sort', params.sort);
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.offset !== undefined) query.set('offset', String(params.offset));
    const response = await apiClient.get<ProductsResponse>(`/public/products?${query.toString()}`);
    return response.data;
};

export const getSimilarProducts = async (params: {
    category: string;
    sub_category?: string;
    tags?: string[];
    excludeSlug: string;
}): Promise<ApiResponse<Product[]>> => {
    const query = new URLSearchParams({ category: params.category });
    if (params.sub_category) query.set('sub_category', params.sub_category);
    if (params.tags?.length) query.set('tags', params.tags.join(','));
    const response = await apiClient.get<ApiResponse<Product[]>>(`/public/products?${query.toString()}&limit=8`);
    const filtered = (response.data.data || []).filter(p => p.slug !== params.excludeSlug);
    return { ...response.data, data: filtered };
};
