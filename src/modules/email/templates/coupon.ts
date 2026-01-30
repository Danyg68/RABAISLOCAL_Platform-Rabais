export const couponEmailTemplate = (
    userName: string,
    offerTitle: string,
    merchantName: string,
    uniqueCode: string,
    qrCodeUrl: string | null // Optionnel si on génère une image plus tard, pour l'instant textuel
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Votre Coupon RabaisLocal</title>
    <style>
        body { font-family: sans-serif; background-color: #f3f4f6; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #2563ea; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 30px; text-align: center; }
        .code-box { background-color: #f9fafb; border: 2px dashed #d1d5db; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .code { font-size: 24px; font-weight: bold; color: #111827; letter-spacing: 2px; }
        .footer { background-color: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; }
        .btn { display: inline-block; background-color: #2563ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px; font-weight: bold;}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Félicitations ! 🎉</h1>
        </div>
        <div class="content">
            <p>Bonjour <strong>${userName}</strong>,</p>
            <p>Vous avez réclamé avec succès l'offre suivante :</p>
            
            <h2 style="color: #1f2937; margin-top: 20px;">${offerTitle}</h2>
            <p style="color: #4b5563;">chez <strong>${merchantName}</strong></p>
            
            <div class="code-box">
                <p style="margin-bottom: 10px; font-size: 14px; color: #6b7280;">Votre Code Unique :</p>
                <div class="code">${uniqueCode}</div>
                <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">Présentez ce code au commerçant pour profiter du rabais.</p>
            </div>

            <p>Ce coupon est maintenant enregistré dans votre portefeuille.</p>
            
            <a href="https://rabaislocal-plateforme.vercel.app/dashboard/consumer" class="btn">Voir mon portefeuille</a>
        </div>
        <div class="footer">
            <p>RabaisLocal - Économisez localement.</p>
        </div>
    </div>
</body>
</html>
`;
