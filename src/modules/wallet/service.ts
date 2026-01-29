import { createClient } from '@/lib/supabase/client';
import { Transaction, WalletLedgerEntry } from './types';

export const walletService = {
    /**
     * Récupère le solde de points actuel de l'utilisateur
     */
    async getBalance(userId: string): Promise<number> {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('get_wallet_balance', { user_uuid: userId });

        if (error) {
            console.error('Error fetching wallet balance:', error);
            return 0;
        }

        return data as number;
    },

    /**
     * Récupère l'historique des mouvements de points (Ledger)
     */
    async getHistory(userId: string): Promise<WalletLedgerEntry[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('wallet_ledger')
            .select('*')
            .eq('consumer_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching wallet history:', error);
            return [];
        }

        return data as WalletLedgerEntry[];
    },

    /**
     * Crée une nouvelle transaction (Action Commerçant)
     */
    async createTransaction(transactionPayload: Partial<Transaction>): Promise<{ data: Transaction | null, error: any }> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('transactions')
            .insert([transactionPayload])
            .select()
            .single();

        return { data, error };
    },

    /**
     * Récupère les coupons du consommateur
     */
    async getMyCoupons(userId: string): Promise<any[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('coupons')
            .select(`
                *,
                offer:offers (
                    title,
                    description,
                    discount_type,
                    discount_value,
                    merchant:merchants (
                        business_name
                    )
                )
            `)
            .eq('consumer_id', userId)
            .order('purchase_date', { ascending: false });

        if (error) {
            console.error('Error fetching coupons:', error);
            return [];
        }
        return data;
    }
};
