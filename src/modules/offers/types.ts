export type Category = {
    id: string;
    slug: string;
    name: string;
    description?: string;
    icon_name?: string;
    display_order: number;
};

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BOGO' | 'SPECIAL';

export type Offer = {
    id: string;
    merchant_id: string;
    category_id?: string;
    title: string;
    description?: string;
    conditions?: string;
    discount_type: DiscountType;
    discount_value?: number;
    start_date?: string; // ISO String
    end_date?: string; // ISO String
    image_url?: string;
    credit_cost: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type CreateOfferDTO = {
    merchant_id: string;
    category_id?: string;
    title: string;
    description?: string;
    conditions?: string;
    discount_type: DiscountType;
    discount_value?: number;
    start_date?: string;
    end_date?: string;
    image_url?: string;
    is_active?: boolean;
};
