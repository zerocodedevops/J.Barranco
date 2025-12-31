import React from "react";
import { Link } from "react-router-dom";

const LegalNotice: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-brand-blue mb-8">
          Aviso Legal
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          <strong>Última actualización:</strong> 5 de Diciembre de 2024
        </p>

        {/* 1. Datos Identificativos */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            1. Datos Identificativos del Titular
          </h2>
          <div className="bg-blue-50 p-6 rounded-lg space-y-2">
            <p>
              <strong>Titular:</strong> Julián Barranco Hermoso
            </p>
            <p>
              <strong>Nombre Comercial:</strong> J.Barranco Limpieza
            </p>
            <p>
              <strong>NIF/CIF:</strong> 51671755-R
            </p>
            <p>
              <strong>Domicilio Social:</strong>{" "}
              Calle Calahorra 34, 28032 Madrid, España
            </p>
            <p>
              <strong>Email de contacto:</strong>{" "}
              administracion@jbarrancolimpieza.com
            </p>
            <p>
              <strong>Teléfonos:</strong> 618507163 / 679958119
            </p>
            <p>
              <strong>Sitio Web:</strong> https://jbarrancolimpieza.com
            </p>
          </div>
        </section>

        {/* 2. Objeto */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Objeto</h2>
          <p className="text-gray-700 mb-4">
            El presente Aviso Legal regula el uso y utilización del sitio web
            {" "}
            <strong>https://jbarrancolimpieza.com</strong>, del que es titular
            J.Barranco Limpieza.
          </p>
          <p className="text-gray-700">
            La navegación por el sitio web atribuye la condición de usuario del
            mismo e implica la aceptación plena y sin reservas de todas y cada
            una de las disposiciones incluidas en este Aviso Legal.
          </p>
        </section>

        {/* 3. Actividad */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. Actividad Empresarial
          </h2>
          <p className="text-gray-700 mb-4">
            J.Barranco es una empresa especializada en servicios profesionales
            de limpieza, que ofrece:
          </p>
          <ul className="list-disc ml-6 text-gray-700space-y-2">
            <li>Limpieza de comunidades de vecinos</li>
            <li>Limpieza de oficinas y locales comerciales</li>
            <li>Limpieza de cristales y ventanas</li>
            <li>Abrillantado de suelos</li>
            <li>Limpieza de fin de obra</li>
            <li>Limpiezas puntuales y profundas</li>
          </ul>
        </section>

        {/* 4. Condiciones de Uso */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            4. Condiciones de Uso del Sitio Web
          </h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            4.1. Uso permitido
          </h3>
          <p className="text-gray-700 mb-4">
            El usuario se compromete a utilizar el sitio web, sus contenidos y
            servicios de conformidad con la ley, el presente Aviso Legal, las
            buenas costumbres y el orden público.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            4.2. Uso prohibido
          </h3>
          <p className="text-gray-700 mb-2">El usuario se compromete a NO:</p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Utilizar el sitio web conines ilícitos o prohibidos</li>
            <li>
              Realizar actividades que puedan dañar, inutilizar o sobrecargar el
              sitio web
            </li>
            <li>
              Introducir o difundir virus informáticos o cualquier sistema que
              pueda causar daños
            </li>
            <li>Intentar acceder a áreas restringidas sin autorización</li>
            <li>
              Reproducir, copiar o distribuir contenidos sin autorización
              expresa
            </li>
            <li>Suplantar la identidad de otros usuarios o personas</li>
          </ul>
        </section>

        {/* 5. Propiedad Intelectual e Industrial */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            5. Propiedad Intelectual e Industrial
          </h2>
          <p className="text-gray-700 mb-4">
            Todos los contenidos del sitio web (textos, fotografías, gráficos,
            imágenes, tecnología, software, links, contenidos, diseño gráfico,
            código fuente, etc.), así como las marcas y demás signos
            distintivos, son propiedad de J.Barranco o de terceros, siendo
            titulares de los correspondientes derechos de explotación.
          </p>
          <p className="text-gray-700 mb-4">
            Quedan expresamente prohibidas la reproducción, distribución,
            comunicación pública, transformación o cualquier otra forma de
            explotación sin el consentimiento previo y por escrito del titular.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-gray-700">
              ⚠️ <strong>Importante:</strong>{" "}
              El acceso al sitio web NO implica la concesión de ningún tipo de
              licencia de uso sobre los derechos de propiedad intelectual e
              industrial.
            </p>
          </div>
        </section>

        {/* 6. Responsabilidad */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            6. Limitación de Responsabilidad
          </h2>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            6.1. Contenidos
          </h3>
          <p className="text-gray-700 mb-4">
            J.Barranco no garantiza la ausencia de errores en el acceso al sitio
            web, en su contenido, ni que éste se encuentre actualizado. No
            obstante, se compromete a subsanar con la mayor celeridad posible
            los errores detectados.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            6.2. Disponibilidad
          </h3>
          <p className="text-gray-700 mb-4">
            J.Barranco no garantiza la disponibilidad y continuidad del
            funcionamiento del sitio web, quedando exonerada de cualquier
            responsabilidad por daños y perjuicios causados por la falta de
            disponibilidad o de continuidad.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
            6.3. Enlaces externos
          </h3>
          <p className="text-gray-700">
            El sitio web puede contener enlaces a sitios web de terceros.
            J.Barranco no asume ninguna responsabilidad por el contenido,
            información o servicios que pudieran aparecer en dichos sitios.
          </p>
        </section>

        {/* 7. Protección de Datos */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            7. Protección de Datos Personales
          </h2>
          <p className="text-gray-700 mb-4">
            El tratamiento de los datos personales de los usuarios se realizará
            conforme a lo establecido en la normativa vigente sobre protección
            de datos (RGPD y LOPDGDD).
          </p>
          <p className="text-gray-700">
            Para más información, consulta nuestra{" "}
            <Link
              to="/privacy-policy"
              className="text-brand-blue underline font-semibold"
            >
              Política de Privacidad
            </Link>.
          </p>
        </section>

        {/* 8. Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            8. Política de Cookies
          </h2>
          <p className="text-gray-700">
            El sitio web utiliza cookies propias y de terceros para mejorar la
            experiencia de navegación. Para más información, consulta nuestra
            {" "}
            <Link
              to="/cookies-policy"
              className="text-brand-blue underline font-semibold"
            >
              Política de Cookies
            </Link>.
          </p>
        </section>

        {/* 9. Modificaciones */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            9. Modificaciones
          </h2>
          <p className="text-gray-700">
            J.Barranco se reserva el derecho de efectuar sin previo aviso las
            modificaciones que considere oportunas en su sitio web, pudiendo
            cambiar, suprimir o añadir tanto los contenidos y servicios que
            presta como la forma en que estos aparezcan presentados o
            localizados.
          </p>
        </section>

        {/* 10. Legislación */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            10. Legislación Aplicable y Jurisdicción
          </h2>
          <p className="text-gray-700 mb-4">
            Las presentes condiciones se rigen por la legislación española
            vigente.
          </p>
          <p className="text-gray-700">
            Para la resolución de cualquier controversia que pudiera derivarse
            del acceso o uso del sitio web, las partes se someten expresamente a
            los Juzgados y Tribunales de{" "}
            <strong>Madrid (España)</strong>, con renuncia expresa a cualquier
            otro fuero que pudiera corresponderles.
          </p>
        </section>

        {/* Contacto */}
        <section className="mb-0 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📧 Contacto</h2>
          <p className="text-gray-700 mb-4">
            Para cualquier cuestión relacionada con este Aviso Legal:
          </p>
          <p className="font-semibold">
            Email: administracion@jbarrancolimpieza.com
          </p>
          <p className="font-semibold">
            Teléfono: 618507163 / 679958119
          </p>
          <p className="font-semibold">
            Dirección: Calle Calahorra 34, 28032 Madrid, España
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalNotice;
