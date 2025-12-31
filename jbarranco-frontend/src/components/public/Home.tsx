import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useCMS } from "../../hooks/useCMS";

function Home() {
  const navigate = useNavigate();
  const { content, loading } = useCMS();

  if (loading) return null; // Or a simple skeleton

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-blue to-blue-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {content?.homeTitle || "Empresa de Limpieza Profesional en Madrid"}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {content?.homeDescription ||
              "Servicios de limpieza de comunidades de vecinos y oficinas con un equipo experimentado. Empresa joven, equipo profesional, resultados garantizados."}
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="bg-white text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Solicitar Presupuesto Gratis
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-brand-blue mb-4">
            {content?.servicesTitle || "Servicios de Limpieza en Madrid"}
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-1xl mx-auto">
            {content?.servicesDescription ||
              "Ofrecemos servicios de limpieza profesional adaptados a las necesidades de comunidades de vecinos y oficinas."}
            <br />
            <Link
              to="/services"
              className="text-brand-blue hover:underline font-semibold"
            >
              Ver todos nuestros servicios →
            </Link>
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cards estáticas por ahora, o podrían venir de services también si quisiéramos mostrarlos todos */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <div className="text-brand-blue mb-4">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Limpieza de Comunidades
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Servicios completos de limpieza para comunidades de vecinos.
              </p>
              <Link
                to="/services"
                className="text-brand-blue hover:underline text-sm font-medium mt-auto"
              >
                Más información →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <div className="text-brand-blue mb-4">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Limpieza de Oficinas
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Limpieza profesional de espacios de trabajo para un entorno
                saludable y productivo. Limpieza diaria, semanal o mensual.
              </p>
              <Link
                to="/services"
                className="text-brand-blue hover:underline text-sm font-medium mt-auto"
              >
                Más información →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <div className="text-brand-blue mb-4">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Servicios Especializados
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                Limpieza de cristales, abrillantado de suelos y limpieza fin de
                obra. Servicios de limpieza profunda a medida.
              </p>
              <Link
                to="/services"
                className="text-brand-blue hover:underline text-sm font-medium mt-auto"
              >
                Más información →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-brand-blue mb-4">
            ¿Por qué Elegir J.Barranco?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Somos una empresa de limpieza en Madrid con experiencia en el
            sector.
            <br />Conoce las ventajas de trabajar con nosotros.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Personal Cualificado
                </h3>
                <p className="text-gray-600">
                  Equipo profesional con formación continua y amplia experiencia
                  en limpieza de comunidades y oficinas en Madrid.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Protocolos de Higiene Rigurosos
                </h3>
                <p className="text-gray-600">
                  Procedimientos exigentes que garantizan una limpieza efectiva
                  y segura en todos nuestros servicios.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Respuesta en 24h
                </h3>
                <p className="text-gray-600">
                  Respondemos rápidamente a todas tus consultas y presupuestos
                  en menos de 24 horas laborables.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-brand-green" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Garantía de Calidad
                </h3>
                <p className="text-gray-600">
                  Nos esforzamos en cada servicio de limpieza para superar tus
                  expectativas y garantizar tu satisfacción.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Link Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-brand-blue mb-4">
            Conoce más sobre J.Barranco
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Somos una empresa de limpieza profesional en Madrid comprometida con
            la excelencia. Descubre nuestra historia, valores y compromiso con
            nuestros clientes.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-brand-blue hover:text-blue-700 font-semibold"
          >
            Conoce Nuestra Historia
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-blue to-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-1xl mb-8">
            Contáctanos hoy y descubre cómo podemos ayudarte con tus necesidades
            de limpieza en Madrid.
            <br />Presupuesto sin compromiso en menos de 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-brand-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Contactar Ahora
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            <a
              href="https://wa.me/34618507163"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="tel:+34618507163"
              className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              📞 Llamar: 618 507 163
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
