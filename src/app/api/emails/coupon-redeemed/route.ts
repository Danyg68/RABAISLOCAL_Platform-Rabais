import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/modules/email/service';
import { couponRedeemedTemplate } from '@/modules/email/templates/coupon-redeemed';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export async function POST(req: NextRequest) {
    const supabase = createClient();

    // 1. Vérifier authentification (Commerçant qui scanne)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { couponId } = body;

        if (!couponId) {
            return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });
        }

        // 🛡️ SECURITY FIX: Rate Limit (Anti-Spam Scan) | 1 email / 10s
        const { data: profile } = await supabase
            .from('profiles')
            .select('last_email_sent_at')
            .eq('id', user.id)
            .single();

        const lastSent = profile?.last_email_sent_at ? new Date(profile.last_email_sent_at) : null;
        const now = new Date();

        if (lastSent && (now.getTime() - lastSent.getTime() < 10000)) { // 10s
            return NextResponse.json({ error: 'Trop rapide. Veuillez attendre quelques secondes.' }, { status: 429 });
        }

        // 2. Récupérer détails coupon + offre + profil user + profil commerçant
        let query = supabase
            .from('coupons')
            .select(`
                *,
                offers (
                    title,
                    merchant_id,
                    merchants (
                        business_name
                    )
                ),
                profiles:consumer_id (
                    full_name,
                    email
                )
            `);

        // Petite détection basique: UUID vs Code Court
        if (couponId.includes('-') && couponId.length > 30) {
            query = query.eq('id', couponId);
        } else {
            query = query.eq('unique_code', couponId);
        }

        const { data: coupon, error: couponError } = await query.single();

        if (couponError || !coupon) {
            console.error('Error fetching coupon:', couponError);
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        // 🛡️ SECURITY FIX: Vérifier que l'offre du coupon appartient bien au commerçant connecté
        // @ts-ignore
        if (coupon.offers && coupon.offers.merchant_id !== user.id) {
            console.error('Security Alert: IDOR Attempt', { userId: user.id, couponId });
            return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
        }

        // Mise à jour du timestamp rate-limit avant envoi
        await supabase.from('profiles').update({ last_email_sent_at: new Date().toISOString() }).eq('id', user.id);

        const email = coupon.profiles?.email;
        if (!email) {
            return NextResponse.json({ error: 'Consumer email not found' }, { status: 404 });
        }

        const offerTitle = coupon.offers?.title || 'Offre';
        // @ts-ignore
        const merchantName = coupon.offers?.merchants?.business_name || 'Commerçant';
        const dateStr = format(new Date(), 'dd MMMM yyyy à HH:mm', { locale: fr });

        // 3. Envoyer l'email
        const html = couponRedeemedTemplate(
            offerTitle,
            merchantName,
            dateStr
        );

        const result = await emailService.sendEmail({
            to: email,
            subject: `Confirmation : Coupon utilisé chez ${merchantName}`,
            html
        });

        if (!result.success) {
            throw result.error;
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
