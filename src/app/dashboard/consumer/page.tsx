export default function ConsumerDashboard() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Mon Espace Membre</h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                    <p className="text-sm opacity-80">Mon Solde RabaisLocal</p>
                    <p className="text-4xl font-bold mt-1">0.00 $</p>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div>
                            <p className="font-semibold">Mon Code Membre</p>
                            <p className="text-xs text-gray-500">Présentez ce code aux commerçants</p>
                        </div>
                        <div className="bg-white p-2 border">
                            {/* Placeholder QR Code */}
                            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-center">QR CODE</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4">Offres à proximité</h2>
            <div className="bg-white p-8 text-center rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Aucune offre disponible pour le moment.</p>
                <button className="mt-4 text-blue-600 hover:underline">Voir le catalogue complet</button>
            </div>
        </div>
    );
}
