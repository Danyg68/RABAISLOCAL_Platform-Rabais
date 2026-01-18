export default function MerchantDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Tableau de Bord Commerçant</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Ventes du jour</h3>
                    <p className="text-3xl font-bold mt-2">0 $</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-gray-500 text-sm font-medium">Rabais utilisés</h3>
                    <p className="text-3xl font-bold mt-2">0</p>
                </div>

                {/* Action Card */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex items-center justify-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + Créer une nouvelle Offre
                    </button>
                </div>
            </div>
        </div>
    );
}
