import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-brand-blue mb-8">
          Política de Privacidad
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          <strong>Última actualización:</strong> 26 de Diciembre de 2025
        </p>

        {/* 1. Responsable */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            1. Responsable del Tratamiento
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="mb-2">
              <strong>Identidad:</strong> J.Barranco Limpieza
            </p>
            <p className="mb-2">
              <strong>Dirección:</strong>{" "}
              Calle Calahorra 34, 28032 Madrid, España
            </p>
            <p className="mb-2">
              <strong>Email:</strong> administracion@jbarrancolimpieza.com
            </p>
            <p className="mb-2">
              <strong>Teléfono:</strong> 618507163 / 679958119
            </p>
          </div>
        </section>

        {/* 2. Datos que recopilamos */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2. Datos Personales que Recopilamos
          </h2>
          <p className="text-gray-700 mb-4">
            Recopilamos los siguientes datos personales según la interacción que
            tengas con nuestro sitio web:
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-brand-blue pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                📝 Formulario de Contacto
              </h3>
              <ul className="list-disc ml-6 text-gray-700">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono (opcional)</li>
                <li>Mensaje o consulta</li>
              </ul>
            </div>

            <div className="border-l-4 border-brand-blue pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                👤 Registro de Usuario (Empleados/Clientes)
              </h3>
              <ul className="list-disc ml-6 text-gray-700">
                <li>Nombre y apellidos</li>
                <li>DNI / NIE / NIF</li>
                <li>Email y contraseña (encriptada)</li>
                <li>Teléfono</li>
                <li>Dirección (solo clientes)</li>
                <li>Información del servicio contratado</li>
              </ul>
            </div>

            <div className="border-l-4 border-brand-blue pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                📊 Datos de Navegación (Google Analytics)
              </h3>
              <ul className="list-disc ml-6 text-gray-700">
                <li>Dirección IP (anonimizada)</li>
                <li>Tipo y versión del navegador</li>
                <li>Sistema operativo</li>
                <li>Páginas visitadas y tiempo de permanencia</li>
                <li>Fecha y hora de acceso</li>
                <li>Fuente de referencia</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Finalidad */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. Finalidad del Tratamiento
          </h2>
          <p className="text-gray-700 mb-4">
            Utilizamos tus datos personales para:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>
              <strong>Gestionar consultas:</strong>{" "}
              Responder a tus preguntas y solicitudes a través del formulario de
              contacto.
            </li>
            <li>
              <strong>Prestación de servicios:</strong>{" "}
              Gestionar la contratación y prestación de servicios de limpieza.
            </li>
            <li>
              <strong>Comunicaciones comerciales:</strong>{" "}
              Enviarte información sobre nuestros servicios (solo si has dado tu
              consentimiento).
            </li>
            <li>
              <strong>Mejora del sitio web:</strong>{" "}
              Analizar el uso del sitio para mejorar la experiencia del usuario.
            </li>
            <li>
              <strong>Cumplimiento legal:</strong>{" "}
              Cumplir con obligaciones legales y fiscales.
            </li>
          </ul>
        </section>

        {/* 4. Legitimación */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            4. Base Jurídica del Tratamiento
          </h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>
              <strong>Consentimiento explícito:</strong>{" "}
              Para el formulario de contacto y cookies no esenciales.
            </li>
            <li>
              <strong>Ejecución de contrato:</strong>{" "}
              Para la gestión de servicios contratados.
            </li>
            <li>
              <strong>Interés legítimo:</strong>{" "}
              Para análisis de navegación y mejora del sitio.
            </li>
            <li>
              <strong>Obligación legal:</strong>{" "}
              Para cumplimiento de normativa fiscal y contable.
            </li>
          </ul>
        </section>

        {/* 5. Conservación */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            5. Periodo de Conservación
          </h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>
              <strong>Formulario contacto:</strong>{" "}
              1 año desde la última comunicación (salvo que contrates
              servicios).
            </li>
            <li>
              <strong>Clientes activos:</strong>{" "}
              Mientras dure la relación contractual + 6 años (obligaciones
              fiscales).
            </li>
            <li>
              <strong>Clientes inactivos:</strong>{" "}
              2 años desde la última interacción.
            </li>
            <li>
              <strong>Empleados:</strong>{" "}
              Durante la relación laboral + 4 años (obligaciones laborales).
            </li>
            <li>
              <strong>Google Analytics:</strong>{" "}
              26 meses desde la última actividad.
            </li>
          </ul>
        </section>

        {/* 6. Destinatarios */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            6. Destinatarios de los Datos
          </h2>
          <p className="text-gray-700 mb-4">
            Tus datos personales pueden ser compartidos con:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>
              <strong>Google Analytics (Google LLC):</strong>{" "}
              Para análisis de tráfico web.{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-brand-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidad de Google
              </a>
            </li>
            <li>
              <strong>Firebase (Google Cloud):</strong>{" "}
              Para almacenamiento de datos y autenticación. Servidores en Europa
              (cumple GDPR).
            </li>
            <li>
              <strong>EmailJS:</strong> Para envío de formularios de contacto.
            </li>
            <li>
              <strong>Zoho Mail:</strong>{" "}
              Proveedor de servicio de correo electrónico corporativo.
            </li>
            <li>
              <strong>Supabase:</strong>{" "}
              Para almacenamiento seguro de documentos y archivos adjuntos.
            </li>
            <li>
              <strong>Upstash:</strong>{" "}
              Servicio de caché y base de datos en memoria para optimizar el
              rendimiento.
            </li>
            <li>
              <strong>Sentry (Functional Software, Inc.):</strong>{" "}
              Para la monitorización técnica de errores y estabilidad de la
              plataforma (EE.UU).
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            <strong>No cedemos ni vendemos tus datos a terceros</strong>{" "}
            con fines comerciales.
          </p>
        </section>

        {/* 7. Transferencias Internacionales */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            7. Transferencias Internacionales
          </h2>
          <p className="text-gray-700 mb-4">
            Algunos de nuestros proveedores de servicios se encuentran en
            Estados Unidos (Google, Firebase). Estas transferencias se realizan
            bajo las siguientes garantías:
          </p>
          <ul className="list-disc ml-6 text-gray-700">
            <li>
              Cláusulas contractuales tipo aprobadas por la Comisión Europea
            </li>
            <li>Certificación Privacy Shield (Google)</li>
            <li>Medidas de seguridad técnicas y organizativas apropiadas</li>
          </ul>
        </section>

        {/* 8. Derechos */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            8. Tus Derechos (ARCO+)
          </h2>
          <p className="text-gray-700 mb-4">
            Tienes derecho a:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50  p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">✅ Acceso</h4>
              <p className="text-sm text-gray-700">
                Obtener información sobre qué datos tuyos estamos tratando.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                ✏️ Rectificación
              </h4>
              <p className="text-sm text-gray-700">
                Corregir datos inexactos o incompletos.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">🗑️ Supresión</h4>
              <p className="text-sm text-gray-700">
                Solicitar la eliminación de tus datos personales.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">⛔ Oposición</h4>
              <p className="text-sm text-gray-700">
                Oponerte al tratamiento de tus datos.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                ⏸️ Limitación
              </h4>
              <p className="text-sm text-gray-700">
                Solicitar la limitación del tratamiento.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                📦 Portabilidad
              </h4>
              <p className="text-sm text-gray-700">
                Recibir tus datos en formato estructurado y transferible.
              </p>
            </div>
          </div>

          <div className="bg-brand-blue/10 p-6 rounded-lg mt-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              ¿Cómo ejercer tus derechos?
            </h4>
            <p className="text-gray-700 mb-2">
              Puedes ejercer cualquiera de estos derechos enviando un email a:
            </p>
            <p className="font-semibold text-brand-blue">
              administracion@jbarrancolimpieza.com
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Incluye tu nombre completo, copia de DNI y el derecho que deseas
              ejercer. Responderemos en un plazo máximo de{" "}
              <strong>15 días</strong>.
            </p>
          </div>
        </section>

        {/* 9. Seguridad */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            9. Seguridad de los Datos
          </h2>
          <p className="text-gray-700 mb-4">
            Implementamos medidas técnicas y organizativas apropiadas para
            proteger tus datos personales:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>✅ Conexión HTTPS cifrada (SSL/TLS)</li>
            <li>✅ Contraseñas encriptadas con bcrypt</li>
            <li>✅ Firebase Authentication con 2FA opcional</li>
            <li>✅ Firestore Security Rules configuradas</li>
            <li>✅ reCAPTCHA v3 anti-spam</li>
            <li>✅ Backups automáticos diarios</li>
            <li>✅ Monitorización 24/7 con Sentry</li>
          </ul>
        </section>

        {/* 10. Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            10. Política de Cookies
          </h2>
          <p className="text-gray-700 mb-4">
            Este sitio web utiliza cookies propias y de terceros. Para más
            información, consulta nuestra{" "}
            <Link
              to="/cookies-policy"
              className="text-brand-blue underline font-semibold"
            >
              Política de Cookies
            </Link>.
          </p>
        </section>

        {/* 11. Menores */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            11. Menores de Edad
          </h2>
          <p className="text-gray-700">
            Este sitio web no está dirigido a menores de 14 años. No recopilamos
            conscientemente datos personales de menores. Si eres padre/madre y
            crees que tu hijo nos ha proporcionado datos, contáctanos para
            eliminarlos.
          </p>
        </section>

        {/* 12. Actualizaciones */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            12. Actualizaciones de esta Política
          </h2>
          <p className="text-gray-700">
            Nos reservamos el derecho a modificar esta Política de Privacidad en
            cualquier momento. Las modificaciones entrarán en vigor el día de su
            publicación. Te recomendamos revisar periódicamente esta página.
          </p>
        </section>

        {/* 13. Reclamaciones */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            13. Autoridad de Control
          </h2>
          <p className="text-gray-700 mb-4">
            Si consideras que el tratamiento de tus datos personales vulnera la
            normativa vigente, tienes derecho a presentar una reclamación ante
            la Agencia Española de Protección de Datos (AEPD):
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-1">
              <strong>Agencia Española de Protección de Datos</strong>
            </p>
            <p className="text-sm">C/ Jorge Juan, 6, 28001 Madrid</p>
            <p className="text-sm">
              Web:{" "}
              <a
                href="https://www.aepd.es"
                className="text-brand-blue underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.aepd.es
              </a>
            </p>
            <p className="text-sm">Tel: 901 100 099 / 912 663 517</p>
          </div>
        </section>

        {/* Contacto */}
        <section className="mb-0 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📧 Contacto</h2>
          <p className="text-gray-700 mb-4">
            Para cualquier cuestión relacionada con esta Política de Privacidad
            o el tratamiento de tus datos personales:
          </p>
          <p className="font-semibold">
            Email: administracion@jbarrancolimpieza.com
          </p>
          <p className="font-semibold">
            Teléfono: 618507163 / 679958119
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
