export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type TransactionType = 'EARN' | 'REDEEM' | 'BOTH';

export interface Transaction {
    id: string;
    merchant_id: string;
    consumer_id: string;
    offer_id?: string;
    transaction_date: string;
    bill_amount_cents: number;
    points_earned: number;
    points_redeemed: number;
    status: TransactionStatus;
    type: TransactionType;
    created_at: string;
    // Joined (optional)
    merchant?: {
        business_name: string;
    }
}

export interface WalletLedgerEntry {
    id: string;
    consumer_id: string;
    transaction_id?: string;
    amount: number;
    entry_type: 'EARN' | 'REDEEM' | 'BONUS' | 'EXPIRE' | 'ADJUSTMENT';
    description?: string;
    created_at: string;
}

export type CouponStatus = 'ACTIVE' | 'USED' | 'EXPIRED';

export interface Coupon {
    id: string;
    offer_id: string;
    consumer_id: string;
    unique_code: string;
    status: CouponStatus;
    redeemed_at?: string;
    purchase_date: string;
    valid_until?: string;

    // Joined fields (optional)
    offer?: {
        title: string;
        description: string;
        discount_type: string;
        discount_value: number;
        merchant?: {
            business_name: string;
        }
    };
}
