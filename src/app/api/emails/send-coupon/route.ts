import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/modules/email/service';
import { couponEmailTemplate } from '@/modules/email/templates/coupon';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const supabase = createClient();

    // 1. Vérifier authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { couponId } = body;

        // 🛡️ SECURITY FIX: Rate Limit (1 email / minute)
        // Vérifier le timestamp du dernier envoi
        const { data: profile } = await supabase
            .from('profiles')
            .select('last_email_sent_at')
            .eq('id', user.id)
            .single();

        const lastSent = profile?.last_email_sent_at ? new Date(profile.last_email_sent_at) : null;
        const now = new Date();

        if (lastSent && (now.getTime() - lastSent.getTime() < 60000)) { // 60s
            return NextResponse.json({ error: 'Trop de demandes. Veuillez attendre 1 minute.' }, { status: 429 });
        }

        // 2. Récupérer détails coupon
        // 🛡️ SECURITY FIX: IDOR Protection (.eq 'consumer_id', user.id)
        const { data: coupon, error: couponError } = await supabase
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
            `)
            .eq('id', couponId)
            .eq('consumer_id', user.id) // <--- Seul le proprio peut s'envoyer l'email
            .single();

        if (couponError || !coupon) {
            console.error('Error fetching coupon or Unauthorized:', couponError);
            return NextResponse.json({ error: 'Coupon introuvable ou accès refusé' }, { status: 404 });
        }

        // Mise à jour du timestamp rate-limit avant envoi (Optimistic)
        await supabase.from('profiles').update({ last_email_sent_at: new Date().toISOString() }).eq('id', user.id);

        // 3. Préparer les données pour le template
        const email = coupon.profiles?.email || user.email; // Fallback sur auth user email si pas dans profile
        const userName = coupon.profiles?.full_name || 'Membre RabaisLocal';
        const offerTitle = coupon.offers?.title || 'Offre Spéciale';
        const merchantName = coupon.offers?.merchants?.[0]?.business_name || 'le commerçant'; // Note: Supabase join returns array sometimes??
        // Correction: "merchants" est une relation One-to-Many ou Foreign Key, vérifions la structure retournée.
        // Si "merchants" est l'objet lié (grâce à la FK sur offers.merchant_id -> merchants.id)

        // 4. Envoyer l'email
        const html = couponEmailTemplate(
            userName,
            offerTitle,
            // @ts-ignore - Supabase type inference can be tricky here without deep types
            coupon.offers?.merchants?.business_name || 'Commerçant Local',
            coupon.unique_code,
            null
        );

        const result = await emailService.sendEmail({
            to: email,
            subject: `Votre coupon pour ${offerTitle}`,
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
