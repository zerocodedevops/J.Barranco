import React from "react";

const CookiesPolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-brand-blue mb-8">
          Política de Cookies
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          <strong>Última actualización:</strong> 26 de Diciembre de 2024
        </p>

        {/* Introducción */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Qué son las cookies?
          </h2>
          <p className="text-gray-700 mb-4">
            Las cookies son pequeños archivos de texto que se almacenan en tu
            dispositivo (ordenador, tablet, smartphone) cuando visitas un sitio
            web. Permiten que el sitio web recuerde tus acciones y preferencias
            durante un período de tiempo.
          </p>
          <p className="text-gray-700">
            En <strong>j-barranco.web.app</strong>{" "}
            utilizamos cookies propias y de terceros para mejorar tu experiencia
            de navegación, analizar el uso del sitio y mostrar publicidad
            personalizada (si aplica).
          </p>
        </section>

        {/* Tipos de cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tipos de Cookies que Utilizamos
          </h2>

          {/* Cookies Técnicas/Necesarias */}
          <div className="mb-6 border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ✅ 1. Cookies Técnicas o Necesarias
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>Finalidad:</strong>{" "}
              Permiten la navegación y el uso de las diferentes opciones del
              sitio web.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Titular:</strong> J.Barranco (cookies propias)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Duración:</strong> Sesión / 13 meses
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Cookies utilizadas:</strong>
            </p>
            <div className="bg-white p-3 rounded">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Nombre</th>
                    <th className="text-left py-2">Propósito</th>
                    <th className="text-left py-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">cookieConsent</td>
                    <td className="py-2">Guardar preferencias de cookies</td>
                    <td className="py-2">13 meses</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">authToken</td>
                    <td className="py-2">Sesión de usuario autenticado</td>
                    <td className="py-2">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ⚠️ <strong>Nota:</strong>{" "}
              Estas cookies son esenciales y no se pueden desactivar sin afectar
              la funcionalidad del sitio.
            </p>
          </div>

          {/* Cookies Analíticas/Rendimiento */}
          <div className="mb-6 border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📊 2. Cookies Analíticas o de Rendimiento
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>Finalidad:</strong>{" "}
              Analizar cómo los usuarios utilizan el sitio web para mejorar su
              funcionamiento.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Titular:</strong> Google LLC (cookies de terceros)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Duración:</strong> Hasta 26 meses
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Cookies utilizadas (Google Analytics 4):</strong>
            </p>
            <div className="bg-white p-3 rounded">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Nombre</th>
                    <th className="text-left py-2">Propósito</th>
                    <th className="text-left py-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">_ga</td>
                    <td className="py-2">Distinguir usuarios únicos</td>
                    <td className="py-2">2 años</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">_ga_XXXXXXXXXX</td>
                    <td className="py-2">Estado de sesión persistente</td>
                    <td className="py-2">2 años</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">_gid</td>
                    <td className="py-2">Distinguir usuarios</td>
                    <td className="py-2">24 horas</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">_gat</td>
                    <td className="py-2">Limitar tasa de peticiones</td>
                    <td className="py-2">1 minuto</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              🔒 <strong>Privacidad:</strong>{" "}
              Google Analytics está configurado con anonimización de IP
              activada.
            </p>
            <p className="text-sm text-gray-600">
              📄{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-brand-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidad de Google
              </a>
            </p>
          </div>

          {/* Cookies Funcionales */}
          <div className="mb-6 border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ⚙️ 3. Cookies Funcionales o de Personalización
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>Finalidad:</strong>{" "}
              Recordar preferencias del usuario para mejorar su experiencia.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Titular:</strong> J.Barranco (cookies propias)
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Duración:</strong> Hasta 12 meses
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Ejemplos:</strong>{" "}
              Idioma preferido, configuración de vista, preferencias de usuario.
            </p>
            <p className="text-sm text-gray-600">
              ✅ Puedes desactivar estas cookies sin afectar la navegación
              básica.
            </p>
          </div>
        </section>

        {/* Cookies de terceros */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cookies de Terceros
          </h2>
          <p className="text-gray-700 mb-4">
            Utilizamos servicios de terceros que establecen cookies en tu
            dispositivo:
          </p>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">
                Google Analytics (Google LLC)
              </h4>
              <p className="text-sm text-gray-700">
                Análisis de tráfico web y comportamiento de usuarios.
              </p>
              <a
                href="https://policies.google.com/privacy"
                className="text-sm text-brand-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Política de Privacidad →
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">
                Firebase (Google Cloud Platform)
              </h4>
              <p className="text-sm text-gray-700">
                Autenticación, almacenamiento y hosting.
              </p>
              <a
                href="https://firebase.google.com/support/privacy"
                className="text-sm text-brand-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Política de Privacidad →
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">Google reCAPTCHA</h4>
              <p className="text-sm text-gray-700">
                Prevención de spam en formularios.
              </p>
              <a
                href="https://policies.google.com/privacy"
                className="text-sm text-brand-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Política de Privacidad →
              </a>
            </div>
          </div>
        </section>

        {/* Base legal */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Base Legal para el Uso de Cookies
          </h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>
              <strong>Cookies técnicas:</strong>{" "}
              Interés legítimo (necesarias para el funcionamiento del sitio).
            </li>
            <li>
              <strong>Cookies analíticas:</strong>{" "}
              Consentimiento del usuario (a través del banner de cookies).
            </li>
            <li>
              <strong>Cookies funcionales:</strong> Consentimiento del usuario.
            </li>
          </ul>
        </section>

        {/* Cómo gestionar cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Cómo Gestionar y Desactivar las Cookies?
          </h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            1. Desde nuestro banner de cookies
          </h3>
          <p className="text-gray-700 mb-4">
            Puedes aceptar, rechazar o configurar las cookies desde el banner
            que aparece al entrar en el sitio web. Para modificar tus
            preferencias posteriormente, haz clic en el botón "Configurar
            Cookies" en el footer.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            2. Desde tu navegador
          </h3>
          <p className="text-gray-700 mb-4">
            Todos los navegadores modernos permiten gestionar las cookies. Aquí
            tienes enlaces a las guías oficiales:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Google Chrome</h4>
              <p className="text-sm text-brand-blue underline">
                Configurar cookies →
              </p>
            </a>
            <a
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Mozilla Firefox</h4>
              <p className="text-sm text-brand-blue underline">
                Configurar cookies →
              </p>
            </a>
            <a
              href="https://support.apple.com/es-es/HT201265"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">
                Safari (macOS/iOS)
              </h4>
              <p className="text-sm text-brand-blue underline">
                Configurar cookies →
              </p>
            </a>
            <a
              href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h4 className="font-semibold text-gray-900">Microsoft Edge</h4>
              <p className="text-sm text-brand-blue underline">
                Configurar cookies →
              </p>
            </a>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
            <p className="text-sm text gray-700">
              ⚠️ <strong>Importante:</strong>{" "}
              Desactivar todas las cookies puede afectar la funcionalidad del
              sitio web y tu experiencia de navegación.
            </p>
          </div>
        </section>

        {/* Opt-out analíticas */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Opt-out de Google Analytics
          </h2>
          <p className="text-gray-700 mb-4">
            Google ofrece un complemento de navegador para desactivar Google
            Analytics en todos los sitios web:
          </p>
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Descargar complemento de opt-out →
          </a>
        </section>

        {/* Actualizaciones */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Actualizaciones de esta Política
          </h2>
          <p className="text-gray-700">
            Podemos actualizar esta Política de Cookies periódicamente para
            reflejar cambios en las cookies que utilizamos o por otras razones
            operativas, legales o reglamentarias. Te recomendamos revisar esta
            página regularmente.
          </p>
        </section>

        {/* Más información */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Más Información sobre Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            Para obtener más información sobre las cookies, puedes consultar:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>
              <a
                href="https://www.aepd.es/es/guias/guia-cookies.pdf"
                className="text-brand-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Guía sobre el uso de cookies de la AEPD
              </a>
            </li>
            <li>
              <a
                href="https://www.allaboutcookies.org/es/"
                className="text-brand-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                All About Cookies (información general)
              </a>
            </li>
          </ul>
        </section>

        {/* Contacto */}
        <section className="mb-0 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📧 Contacto</h2>
          <p className="text-gray-700 mb-4">
            Si tienes dudas sobre nuestra Política de Cookies:
          </p>
          <p className="font-semibold">
            Email: administracion@jbarrancolimpieza.com
          </p>
          <p className="font-semibold">
            Teléfono: 618 507 163 / 679 958 119
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiesPolicy;
