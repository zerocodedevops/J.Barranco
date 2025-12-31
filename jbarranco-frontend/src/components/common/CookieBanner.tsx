import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface WindowWithAnalytics extends Window {
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Siempre true, no se puede desactivar
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const saved = JSON.parse(consent);
      setPreferences(saved.preferences);
      loadAnalytics(saved.preferences.analytics);
    }
  }, []);

  const loadAnalytics = (enabled: boolean) => {
    const w = window as unknown as WindowWithAnalytics;
    if (enabled && !w.gtag) {
      // Cargar Google Analytics solo si hay consentimiento
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-4HKVSDPJF2`;
      script.async = true;
      document.head.appendChild(script);

      w.dataLayer = w.dataLayer || [];
      w.gtag = function (...args: unknown[]) {
        w.dataLayer.push(args);
      };
      w.gtag("js", new Date());
      w.gtag("config", "G-4HKVSDPJF2", {
        anonymize_ip: true,
        cookie_flags: "SameSite=None;Secure",
      });
    }
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const consent = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    loadAnalytics(prefs.analytics);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!showSettings
          ? (
            // Banner simple
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🍪 Este sitio usa cookies
                </h3>
                <p className="text-sm text-gray-600">
                  Utilizamos cookies propias y de terceros para mejorar tu
                  experiencia de navegación y analizar el tráfico del sitio.
                  Puedes aceptar todas las cookies, rechazarlas o configurarlas
                  según tus preferencias.{" "}
                  <Link
                    to="/cookies-policy"
                    className="text-brand-blue underline hover:text-blue-700"
                  >
                    Más información
                  </Link>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue inline-flex items-center justify-center"
                >
                  <Cog6ToothIcon className="h-4 w-4 mr-2" />
                  Configurar
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                >
                  Rechazar todo
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                >
                  Aceptar todo
                </button>
              </div>
            </div>
          )
          : (
            // Panel de configuración
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Configuración de Cookies
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Cookies Necesarias */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      Cookies Necesarias
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Estas cookies son esenciales para el funcionamiento del
                      sitio web y no se pueden desactivar.
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="text-sm font-medium text-gray-500">
                      Siempre activas
                    </span>
                  </div>
                </div>

                {/* Cookies Analíticas */}
                <div className="flex items-start justify-between pb-4 border-b">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      Cookies Analíticas
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Nos permiten contar visitas y fuentes de tráfico para
                      medir y mejorar el rendimiento del sitio (Google
                      Analytics).
                    </p>
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <span className="sr-only">Activar analíticas</span>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            analytics: e.target.checked,
                          })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue">
                      </div>
                    </label>
                  </div>
                </div>

                {/* Cookies Funcionales */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      Cookies Funcionales
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Permiten funcionalidades mejoradas y personalización
                      (preferencias de usuario, idioma, etc.).
                    </p>
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <span className="sr-only">Activar funcionales</span>
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            functional: e.target.checked,
                          })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue">
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                >
                  Rechazar todo
                </button>
                <button
                  onClick={savePreferences}
                  className="px-6 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                >
                  Guardar preferencias
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default CookieBanner;
