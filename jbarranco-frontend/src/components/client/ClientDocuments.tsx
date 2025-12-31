import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function ClientDocuments() {
  const invoices = [
    { id: 'FAC-2024-001', description: 'Cuota Enero - Limpieza', date: '02/01/2024' },
    { id: 'FAC-2023-012', description: 'Cuota Diciembre - Limpieza', date: '02/12/2023' },
  ];

  const budgets = [
    { id: 'PRES-2024-001', description: 'Presupuesto Abrillantado', date: '15/01/2024' },
    { id: 'PRES-2023-003', description: 'Presupuesto Limpieza Garaje', date: '10/12/2023' },
  ];

  const handleDownload = () => {
    alert(`La descarga de documentos requiere que el administrador genere el PDF desde el panel de Documentos. En producción, estos estarían almacenados en Firestore Storage.`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Mis Documentos</h2>

      {/* Info Banner */}
      <div className="mt-4 bg-blue-50 border-l-4 border-brand-blue p-4 rounded">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Los documentos generados por el administrador estarán disponibles aquí para descarga. Actualmente mostrando datos de ejemplo.
        </p>
      </div>

      {/* Facturas */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">Facturas</h3>
        <div className="mt-4 bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <li key={invoice.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.description}</p>
                    <p className="text-sm text-gray-500">Nº: {invoice.id} - Fecha: {invoice.date}</p>
                  </div>
                  <button
                    onClick={() => handleDownload()}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Descargar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Presupuestos */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Presupuestos</h3>
        <div className="mt-4 bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {budgets.map((budget) => (
              <li key={budget.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{budget.description}</p>
                    <p className="text-sm text-gray-500">Nº: {budget.id} - Fecha: {budget.date}</p>
                  </div>
                  <button
                    onClick={() => handleDownload()}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Descargar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClientDocuments;