import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "¿Qué servicios de limpieza ofrecéis?",
      answer: "Ofrecemos servicios de limpieza para comunidades de vecinos (portales, escaleras, ascensores) y oficinas. También realizamos servicios especiales como abrillantado de suelos, limpieza de cristales y limpiezas puntuales o profundas. Todos nuestros servicios pueden contratarse de forma periódica o puntual según tus necesidades."
    },
    {
      question: "¿Cómo funciona la contratación de servicios?",
      answer: "Es muy sencillo: contacta con nosotros por teléfono, email o WhatsApp, cuéntanos tus necesidades y te enviaremos un presupuesto personalizado sin compromiso en menos de 24 horas. Si te convence, firmamos el contrato y empezamos cuando tú decidas. No hay permanencia mínima."
    },
    {
      question: "¿Cuánto cuesta el servicio de limpieza?",
      answer: "El precio depende de varios factores: tamaño del espacio, frecuencia del servicio (diario, semanal, mensual), tipo de limpieza requerida y ubicación. Por eso ofrecemos presupuestos personalizados gratuitos."    },
    {
      question: "¿Tenéis disponibilidad inmediata?",
      answer: "Sí, en la mayoría de casos podemos empezar en menos de una semana. Somos una empresa joven con capacidad de respuesta rápida. Para servicios urgentes o puntuales, consúltanos y haremos lo posible por adaptarnos a tu calendario."
    },
    {
      question: "¿Qué pasa si no estoy satisfecho con el servicio?",
      answer: "Tu satisfacción es nuestra prioridad. Si algo no cumple tus expectativas, lo solucionamos inmediatamente sin coste adicional. Además, no exigimos permanencia mínima: si decides cancelar el servicio, puedes hacerlo con un simple preaviso de 1 mes"
    },
    {
      question: "¿Proporcionáis los productos y materiales de limpieza?",
      answer: "Sí, incluimos todos los productos profesionales y materiales necesarios en el precio del servicio. Utilizamos productos de calidad. Si prefieres que usemos productos específicos, podemos adaptarnos sin problema."
    },
  ];

  const toggleFAQ = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-blue mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-gray-600 max-w-1xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestros servicios de limpieza.
            <br/>Si no encuentras lo que buscas, no dudes en contactarnos.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-brand-blue transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue focus:outline-none"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-6 w-6 text-brand-blue flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-gray-400 flex-shrink-0" aria-hidden="true" />
                )}
              </button>
              
              {openIndex === index && (
                <div 
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                >
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Aún tienes dudas?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contacta con nosotros y resolveremos todas tus preguntas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue focus:outline-none"
            >
              Contactar
            </a>
            <a
              href="tel:+34618507163"
              className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-brand-green focus:outline-none"
            >
              📞 Llamar Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
