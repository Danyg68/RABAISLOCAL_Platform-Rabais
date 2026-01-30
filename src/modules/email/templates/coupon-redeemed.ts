export const couponRedeemedTemplate = (
    offerTitle: string,
    merchantName: string,
    validationDate: string
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recu de transaction - RabaisLocal</title>
    <style>
        body { font-family: sans-serif; background-color: #f3f4f6; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #059669; color: #ffffff; padding: 20px; text-align: center; }
        .content { padding: 30px; text-align: center; }
        .details { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: left; }
        .footer { background-color: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; }
        .check { width: 50px; height: 50px; background-color: #ffffff; color: #059669; line-height: 50px; text-align: center; border-radius: 50%; font-size: 24px; margin: 0 auto 10px auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="check">✓</div>
            <h1>Coupon Confirmé !</h1>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Votre coupon a été validé avec succès par le commerçant.</p>
            
            <div class="details">
                <p><strong>Commerçant :</strong> ${merchantName}</p>
                <p><strong>Offre :</strong> ${offerTitle}</p>
                <p><strong>Date :</strong> ${validationDate}</p>
                <p><strong>Statut :</strong> ✅ UTILISÉ</p>
            </div>

            <p style="color: #6b7280; font-size: 14px;">Merci de soutenir l'économie locale !</p>
        </div>
        <div class="footer">
            <p>RabaisLocal - Économisez localement.</p>
        </div>
    </div>
</body>
</html>
`;
