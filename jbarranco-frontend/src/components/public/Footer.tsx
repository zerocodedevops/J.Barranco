import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Izquierda: Links + Copyright */}
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-600">
                            <Link
                                to="/privacy-policy"
                                className="hover:text-brand-blue transition-colors"
                            >
                                Política de Privacidad
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link
                                to="/cookies-policy"
                                className="hover:text-brand-blue transition-colors"
                            >
                                Política de Cookies
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link
                                to="/legal-notice"
                                className="hover:text-brand-blue transition-colors"
                            >
                                Aviso Legal
                            </Link>
                            <span className="text-gray-300">|</span>
                            <Link
                                to="/contact"
                                className="hover:text-brand-blue transition-colors"
                            >
                                Contacto
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 text-center md:text-left">
                            &copy; {new Date().getFullYear()}{" "}
                            J.Barranco Limpieza. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-gray-400 text-center md:text-left mt-2">
                            Este sitio está protegido por reCAPTCHA y se aplican
                            la{" "}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-brand-blue"
                            >
                                Política de Privacidad
                            </a>{" "}
                            y los{" "}
                            <a
                                href="https://policies.google.com/terms"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-brand-blue"
                            >
                                Términos de Servicio
                            </a>{" "}
                            de Google.
                        </p>
                    </div>

                    {/* Derecha: Sello Personal */}
                    <div className="flex flex-col items-center md:items-end md:mr-12">
                        <div className="flex items-center gap-2 group">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium group-hover:text-brand-blue transition-colors">
                                Desarrollado por
                            </span>
                            <img
                                src="/images/zerocode_seal.jpeg"
                                alt="David G. ZeroCode DevOps"
                                className="h-12 w-auto object-contain shadow-sm group-hover:scale-105 transition-all duration-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
