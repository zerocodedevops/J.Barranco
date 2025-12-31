import { Link } from 'react-router-dom';
import { SparklesIcon, WindowIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useCMS } from '../../hooks/useCMS';

function Services() {
  const { content, services, loading } = useCMS();

  if (loading) return null;

  return (
    <>
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-brand-blue">
                {content?.servicesTitle || "Nuestros Servicios"}
            </h2>
            <p className="mt-4 text-gray-600 max-w-1xl mx-auto">
              <span className="whitespace-pre-line">
                {content?.servicesDescription || 
                 "En J.Barranco ofrecemos soluciones de limpieza adaptadas a comunidades de vecinos y oficinas, con la flexibilidad y el compromiso que caracterizan a una empresa joven con personal altamente experimentado."
                }
              </span>
            </p>
          </div>

          {/* Listado de Servicios Dinámico (CMS) */}
          <div className="mt-12 space-y-12">
            {services.length > 0 ? (
                services.map((service, index) => (
                    <div key={service.id} className="bg-gray-light p-8 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold text-brand-blue">{service.titulo}</h3>
                        <p className="mt-4 text-gray-600 whitespace-pre-line">
                            {service.descripcion}
                        </p>
                        </div>
                         {/* Imagen Placeholder Alternando */}
                        <div className="h-64 md:h-80 md:col-span-1">
                            <img 
                                src={index % 2 === 0 ? "/images/comunidad.png" : "/images/oficina.png"} 
                                alt={service.titulo} 
                                className="w-full h-full object-cover rounded-lg shadow-md"
                            />
                        </div>
                    </div>
                ))
            ) : (
                // Fallback (Estático Original) si no hay servicios en CMS
                <>
                <div className="bg-gray-light p-8 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-brand-blue">Limpieza Estándar para Comunidades</h3>
                    <p className="mt-4 text-gray-600">
                        Nuestro servicio integral para el mantenimiento de las zonas comunes.
                    </p>
                     <ul className="mt-6 list-disc list-inside text-gray-600 space-y-2">
                        <li>Barrido y fregado de portales y rellanos.</li>
                        <li>Limpieza y desinfección de ascensores.</li>
                        <li>Limpieza de buzones y zonas de entrada.</li>
                        <li>Retirada de basura de papeleras comunitarias.</li>
                    </ul>
                    </div>
                    <div className="h-64 md:h-80 md:col-span-1">
                    <img 
                        src="/images/comunidad.png" 
                        alt="Limpieza de comunidad" 
                        className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                    </div>
                </div>

                <div className="bg-gray-light p-8 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                    <h3 className="text-2xl font-bold text-brand-blue">Limpieza de Oficinas</h3>
                    <p className="mt-4 text-gray-600">
                        Mantenimiento de espacios de trabajo para garantizar un entorno limpio, saludable y profesional.
                    </p>
                    <ul className="mt-6 list-disc list-inside text-gray-600 space-y-2">
                        <li>Limpieza de escritorios, salas de reuniones y zonas comunes.</li>
                        <li>Desinfección de superficies de contacto frecuente.</li>
                        <li>Vaciado de papeleras y reposición de suministros básicos.</li>
                        <li>Adaptación a horarios y necesidades específicas de cada cliente.</li>
                    </ul>
                    </div>
                    <div className="h-64 md:h-80 md:col-span-1">
                    <img 
                        src="/images/oficina.png" 
                        alt="Limpieza de oficinas" 
                        className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                    </div>
                </div>
                </>
            )}
          </div>

          {/* Servicios Especiales con iconos */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-brand-blue text-center">Servicios Especiales</h3>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-light p-6 rounded-lg shadow text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-4">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-medium text-brand-blue">Abrillantado de Suelos</h4>
                <p className="mt-2 text-gray-500">Devolvemos el brillo original a tus suelos.</p>
              </div>
              <div className="bg-gray-light p-6 rounded-lg shadow text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-4">
                  <WindowIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-medium text-brand-blue">Limpieza de Cristales</h4>
                <p className="mt-2 text-gray-500">Servicio profesional para ventanas, fachadas acristaladas y cerramientos.</p>
              </div>
              <div className="bg-gray-light p-6 rounded-lg shadow text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-4">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-medium text-brand-blue">Limpieza Puntual o Profunda</h4>
                <p className="mt-2 text-gray-500">
                  Ideal para cambios de estación, reformas o eventos especiales. Adaptamos el servicio a tus necesidades.
                </p>
              </div>
            </div>
          </div>

          {/* Nota Final */}
          <div className="mt-12 text-center bg-blue-50 p-6 rounded-lg">
            <p className="text-brand-blue font-medium max-w-1xl mx-auto">
              📌 Todos nuestros servicios pueden contratarse de forma periódica o puntual, según tus necesidades. 
              <br/>Nuestro equipo está preparado para ofrecer resultados desde el primer día.
            </p>
          </div>

          {/* CTA Final */}
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas un presupuesto personalizado?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Contáctanos y te enviaremos un presupuesto sin compromiso en menos de 24 horas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                Solicitar Presupuesto Gratis
              </Link>
              <a
              href="https://wa.me/34618507163"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href="tel:+34618507163"
              className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
            >
                📞 Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;