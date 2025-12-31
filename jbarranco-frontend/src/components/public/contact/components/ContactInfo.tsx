import { EnvelopeIcon } from "@heroicons/react/24/outline";

export function ContactInfo() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-brand-blue">
                    Información de Contacto
                </h3>
                <p className="mt-2 text-gray-600">
                    Puedes contactarnos a través de cualquiera de los siguientes
                    medios:
                </p>
            </div>
            <div className="space-y-4">
                <div>
                    <p>
                        <strong className="text-brand-blue">Teléfono:</strong>
                        {" "}
                        618 507 163 / 679 958 119
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        📞 Horario de atención: Lunes a Viernes, 9:00 - 17:00
                    </p>
                </div>
                <div>
                    <a
                        href="mailto:administracion@jbarrancolimpieza.com"
                        className="flex items-center text-gray-700 hover:text-brand-blue transition-colors"
                    >
                        <EnvelopeIcon className="h-5 w-5 mr-2 text-brand-blue" />
                        administracion@jbarrancolimpieza.com
                    </a>
                </div>
                <a
                    href="https://wa.me/34618507163"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mt-1 focus:ring-2 focus:ring-offset-2 focus:ring-green-600 focus:outline-none rounded"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Contactar por WhatsApp
                </a>
                <p>
                    <strong className="text-brand-blue">Dirección:</strong>{" "}
                    Calle Calahorra 34, 28032 Madrid, España
                </p>
            </div>
            {/* Mapa de Google Maps */}
            <div className="bg-gray-200 rounded-lg h-64 overflow-hidden shadow-md">
                <iframe
                    title="Ubicación J-Barranco"
                    width="100%"
                    height="100%"
                    src="https://maps.google.com/maps?width=100%25&height=100%25&hl=es&q=Calle+Calahorra+34,+28032+Madrid&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                >
                </iframe>
            </div>
        </div>
    );
}
