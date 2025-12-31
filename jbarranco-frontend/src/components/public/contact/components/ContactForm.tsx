import { Link } from "react-router-dom";
import { ContactFormData } from "../hooks/useContactForm";

interface ContactFormProps {
    readonly formData: ContactFormData;
    readonly sending: boolean;
    readonly onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    readonly onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function ContactForm({
    formData,
    sending,
    onChange,
    onCheckboxChange,
    onSubmit,
}: ContactFormProps) {
    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-y-6">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Nombre *
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue focus:ring-2 focus:ring-offset-2 focus:outline-none p-2 border"
                />
            </div>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email *
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue focus:ring-2 focus:ring-offset-2 focus:outline-none p-2 border"
                />
            </div>
            <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                >
                    Teléfono
                </label>
                <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={onChange}
                    placeholder="+34 XXX XXX XXX"
                    pattern="[+]?[0-9\s]+"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue focus:ring-2 focus:ring-offset-2 focus:outline-none p-2 border"
                />
            </div>
            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                >
                    Mensaje *
                </label>
                <textarea
                    rows={4}
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={onChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue focus:ring-2 focus:ring-offset-2 focus:outline-none p-2 border"
                >
                </textarea>
            </div>

            {/* Consentimiento GDPR */}
            <div className="space-y-3">
                <label className="flex items-start cursor-pointer">
                    <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={onCheckboxChange}
                        required
                        className="mt-1 mr-3 h-4 w-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
                    />
                    <span className="text-sm text-gray-700">
                        He leído y acepto la{" "}
                        <Link
                            to="/privacy-policy"
                            className="text-brand-blue underline hover:text-blue-700"
                            target="_blank"
                        >
                            Política de Privacidad
                        </Link>{" "}
                        y el{" "}
                        <Link
                            to="/legal-notice"
                            className="text-brand-blue underline hover:text-blue-700"
                            target="_blank"
                        >
                            Aviso Legal
                        </Link>{" "}
                        *
                    </span>
                </label>

                {/* Información básica protección de datos */}
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                    <strong className="block mb-1">
                        Información básica sobre Protección de Datos:
                    </strong>
                    <ul className="list-disc ml-4 space-y-1">
                        <li>
                            <strong>Responsable:</strong> J.Barranco Limpieza
                        </li>
                        <li>
                            <strong>Finalidad:</strong>{" "}
                            Gestionar tu consulta y contactarte
                        </li>
                        <li>
                            <strong>Legitimación:</strong>{" "}
                            Consentimiento del interesado
                        </li>
                        <li>
                            <strong>Destinatarios:</strong>{" "}
                            No se cederán datos a terceros
                        </li>
                        <li>
                            <strong>Derechos:</strong>{" "}
                            Acceder, rectificar y suprimir los datos, así como
                            otros derechos explicados en la{" "}
                            <Link
                                to="/privacy-policy"
                                className="text-brand-blue underline"
                            >
                                Política de Privacidad
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* reCAPTCHA v3 badge (invisible) */}
            <div className="text-xs text-gray-600">
                Este sitio está protegido por reCAPTCHA y se aplican la{" "}
                <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:underline"
                >
                    Política de Privacidad
                </a>{" "}
                y los{" "}
                <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:underline"
                >
                    Términos de Servicio
                </a>{" "}
                de Google.
            </div>

            <div>
                <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-brand-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue focus:outline-none"
                >
                    {sending ? "Enviando..." : "Enviar Mensaje"}
                </button>
            </div>
        </form>
    );
}
