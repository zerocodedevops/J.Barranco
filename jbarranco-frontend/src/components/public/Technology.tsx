import { useNavigate } from "react-router-dom";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

function Technology() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-brand-blue text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white mb-6 animate-fade-in-up">
            No te contamos lo que hacemos.
            <br />
            <span className="text-white">Te lo enseñamos.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-1xl mx-auto mb-10 leading-relaxed">
            La limpieza es el resultado final.
            <br />
            La magia ocurre antes: organización milimétrica, transparencia total
            y control en tiempo real.
            <br />Descubre el software que nos diferencia del resto.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="bg-brand-green hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105"
            >
              Solicitar Información
            </button>
          </div>
        </div>
      </section>

      {/* Feature 1: Cliente (Tablet) */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative max-w-full mx-auto">
              <img
                src="/showcase/client_tablet_hands.png"
                alt="Portal del Cliente J.Barranco"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-center gap-3 text-brand-blue font-bold text-lg uppercase tracking-wider">
              <CalendarDaysIcon className="h-6 w-6" />
              Portal del Presidente
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Olvídate de perseguir al administrador.
            </h2>
            <p className="text-lg text-gray-600">
              ¿Cuándo toca limpieza? ¿Ha venido el cristalero?
              <br />
              Con nuestro Portal de Cliente, tienes el control total desde tu
              sofá.
            </p>
            <ul className="space-y-4">
              {[
                "Calendario de visitas compartido en tiempo real.",
                "Canal para notificar incidencias, solicitar trabajos extras, etc.",
                "Historial de presupuestos, facturas y partes de trabajo.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-brand-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature 2: Empleado (Mobile) */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-brand-orange font-bold text-lg uppercase tracking-wider">
              <DevicePhoneMobileIcon className="h-6 w-6" />
              App del Empleado
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Profesionales equipados, no improvisados.
            </h2>
            <p className="text-lg text-gray-600">
              Nuestros empleados no usan papel y boli.
              <br />
              Usan una App dedicada que les guía paso a paso en cada comunidad.
            </p>
            <ul className="space-y-4">
              {[
                "Ruta optimizada con GPS: saben exactamente dónde ir.",
                "Checklist digital: nada se pasa por alto.",
                "Reporte de incidencias instantáneo al supervisor.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-brand-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="relative max-w-xs mx-auto">
              <img
                src="/showcase/employee.png?v=7"
                alt="App de Empleado"
                className="w-full h-auto drop-shadow-2xl rounded-[2rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Admin (Desktop) */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative max-w-full mx-auto">
              <img
                src="/showcase/admin_mac.png"
                alt="Panel de Control Administración en Mac"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-center gap-3 text-blue-600 font-bold text-lg uppercase tracking-wider">
              <ComputerDesktopIcon className="h-6 w-6" />
              Control Central
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Supervisión 360º para tu tranquilidad.
            </h2>
            <p className="text-lg text-gray-600">
              Desde nuestra central monitorizamos todas las comunidades.
            </p>
            <ul className="space-y-4">
              {[
                "Dashboard de control global en tiempo real.",
                "Gestión inmediata de bajas y sustituciones.",
                "Auditoría de calidad y valoraciones de clientes.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircleIcon className="h-6 w-6 text-brand-green flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-brand-blue text-white py-10 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          ¿Quieres ver cómo funcionaría en tu comunidad?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-1xl mx-auto">
          Solicita una demostración sin compromiso y descubre por qué somos
          diferentes.
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="bg-white text-brand-blue font-bold py-4 px-10 rounded-lg shadow hover:bg-gray-100 transition-colors"
        >
          Contactar Ahora
        </button>
      </section>
    </div>
  );
}

export default Technology;
