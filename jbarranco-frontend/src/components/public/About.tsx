import { Link } from 'react-router-dom';
import { UserGroupIcon, LightBulbIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useCMS } from '../../hooks/useCMS';

function About() {
  const { content, loading } = useCMS();
  
  if (loading) return null;

  return (
    <>
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-brand-blue">
              {content?.aboutTitle || "Quiénes Somos"}
            </h2>
          </div>
          
          <div className="mt-8 prose prose-lg text-gray-500 mx-auto max-w-1xl whitespace-pre-line">
            {content?.aboutDescription ? (
              <p>{content.aboutDescription}</p>
            ) : (
             <>
              <p>
                En J.Barranco Limpieza de Comunidades, somos una empresa joven con una misión clara: cuidar la imagen y el bienestar de tu comunidad y tu espacio de trabajo.
              </p>
              <p className="mt-4">
                Aunque nuestra marca es reciente, nuestro equipo acumula años de experiencia en empresas líderes del sector, lo que nos permite ofrecer un servicio profesional desde el primer día.
              </p>
              <p className="mt-4">
                Estamos motivados por el reto de crecer, afianzar relaciones duraderas con nuestros clientes y convertirnos en un referente de calidad en la zona.
              </p>
             </>
            )}
          </div>

          {/* Misión */}
          <div className="mt-12 bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-brand-blue text-center">Nuestra Misión</h3>
            <p className="mt-4 text-gray-600 text-center max-w-1xl mx-auto">
              Ofrecer servicios de limpieza para comunidades de vecinos y oficinas que transmitan confianza, profesionalidad y tranquilidad.
              <br/>Queremos que nuestros clientes disfruten de sus espacios comunes y laborales sin preocupaciones, sabiendo que están en buenas manos.
            </p>
          </div>

          {/* Valores con iconos */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-brand-blue text-center mb-8">Nuestros Valores</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Profesionalidad */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-4">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Profesionalidad</h4>
                <p className="text-gray-600 text-sm">
                  Nuestro equipo está formado por especialistas con experiencia contrastada y compromiso con la excelencia.
                </p>
              </div>

              {/* Transparencia */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-4">
                  <LightBulbIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Transparencia</h4>
                <p className="text-gray-600 text-sm">
                  Mantenemos una comunicación clara y directa, sin letra pequeña.
                </p>
              </div>

              {/* Respeto */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Respeto</h4>
                <p className="text-gray-600 text-sm">
                  Tratamos cada comunidad y oficina como si fuera la nuestra, cuidando cada detalle.
                </p>
              </div>

              {/* Compromiso */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue rounded-full mb-4">
                  <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Impulso y Compromiso</h4>
                <p className="text-gray-600 text-sm">
                  Como empresa emergente, trabajamos con energía y dedicación para superar expectativas y construir una reputación sólida.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Quieres conocer nuestros servicios?</h3>
            <p className="text-gray-600 mb-6">
              Descubre cómo podemos ayudarte a mantener tus espacios impecables
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ver Servicios
              </Link>
              <Link
                to="/contact"
                className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Solicitar Presupuesto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;