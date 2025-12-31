// Blog Post 6: Cuánto cuesta la limpieza
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BlogPost6: React.FC = () => {
 return (
 <div className="bg-white py-12">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <Link to="/blog" className="inline-flex items-center text-brand-blue hover:text-blue-700 mb-8">
 <ArrowLeftIcon className="h-5 w-5 mr-2" />
 Volver al Blog
 </Link>

 <article>
 <header className="mb-8">
 <script type="application/ld+json">
 {JSON.stringify({
 "@context": "https://schema.org",
 "@type": "BlogPosting",
 "headline": "Cuánto cuesta la limpieza de una comunidad en Madrid (2025)",
 "description": "Guía completa de precios y factores que determinan el coste de la limpieza profesional.",
 "image": "https://j-barranco.web.app/images/blog/precios-limpieza.webp",
 "author": {
 "@type": "Person",
 "name": "J.Barranco"
 },
 "publisher": {
 "@type": "Organization",
 "name": "J.Barranco Limpieza",
 "logo": {
 "@type": "ImageObject",
 "url": "https://j-barranco.web.app/logo-light.png"
 }
 },
 "datePublished": "2025-12-05",
 "dateModified": "2025-12-05"
 })}
 </script>
 <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
 Cuánto cuesta la limpieza de una comunidad en Madrid (2025)
 </h1>
 <div className="flex items-center text-gray-600 text-sm space-x-4">
 <span>📅 5 de Diciembre, 2025</span>
 <span>⏱️ 6 min de lectura</span>
 <span>✍️ J.Barranco</span>
 </div>
 </header>

 {/* Featured Image */}
 <img 
 src="/images/blog/precios-madrid.webp" 
 alt="Precios de limpieza en Madrid 2024" 
 className="w-full h-96 object-cover rounded-lg mb-10 shadow-lg"
 />

 <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-li:text-gray-700 prose-li:my-2 prose-strong:text-gray-900 prose-strong:font-semibold">
 <p className="lead mb-8 text-xl leading-relaxed">
 Una de las preguntas más frecuentes que recibimos es: "¿Cuánto cuesta la limpieza de mi comunidad?" 
 En esta guía te explicamos los factores que influyen en el precio y tarifas orientativas para 2025.
 </p>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Factores que determinan el precio</h2>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">1. Tamaño de la comunidad</h3>
 <p>El factor más importante es el número de viviendas y metros cuadrados:</p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Pequeña (hasta 20 viviendas):</strong> 80-150€/mes</li>
 <li><strong>Mediana (20-50 viviendas):</strong> 150-300€/mes</li>
 <li><strong>Grande (+50 viviendas):</strong> 300-600€/mes</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">2. Frecuencia del servicio</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>2 días/semana:</strong> Precio base</li>
 <li><strong>3 días/semana:</strong> +30-40%</li>
 <li><strong>5 días/semana:</strong> +80-100%</li>
 <li><strong>Diario:</strong> +120-150%</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">3. Servicios incluidos</h3>
 <p>Servicios básicos vs. completos:</p>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <h4 className="font-bold mb-4">Servicio Básico (incluido)</h4>
 <ul className="space-y-1">
 <li>✓ Barrido y fregado de portal y escaleras</li>
 <li>✓ Limpieza de ascensores</li>
 <li>✓ Vaciado de papeleras</li>
 <li>✓ Limpieza de buzones</li>
 </ul>

 <h4 className="font-bold mt-6 mb-4">Servicios Extra (coste adicional)</h4>
 <ul className="space-y-1">
 <li>+ Cristales exteriores (+20-30€/mes)</li>
 <li>+ Garaje (+30-50€/mes)</li>
 <li>+ Jardín/patio (+25-40€/mes)</li>
 <li>+ Abrillantado suelos (+150-300€/año)</li>
 </ul>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Tarifas orientativas por tipo de comunidad</h2>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Comunidad pequeña (15 viviendas)</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Frecuencia:</strong> 2 días/semana</li>
 <li><strong>Tiempo:</strong> 1.5 horas/sesión</li>
 <li><strong>Precio:</strong> 100-130€/mes</li>
 <li><strong>Por vivienda:</strong> 6.5-8.5€/mes</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Comunidad mediana (35 viviendas)</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Frecuencia:</strong> 3 días/semana</li>
 <li><strong>Tiempo:</strong> 2.5 horas/sesión</li>
 <li><strong>Precio:</strong> 220-280€/mes</li>
 <li><strong>Por vivienda:</strong> 6.3-8€/mes</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Comunidad grande (80 viviendas)</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Frecuencia:</strong> 5 días/semana</li>
 <li><strong>Tiempo:</strong> 3 horas/sesión</li>
 <li><strong>Precio:</strong> 450-550€/mes</li>
 <li><strong>Por vivienda:</strong> 5.6-6.9€/mes</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Comparativa: Hacer vs. Contratar</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b">
 <th className="text-left py-2">Concepto</th>
 <th className="text-left py-2">Vecinos</th>
 <th className="text-left py-2">Profesional</th>
 </tr>
 </thead>
 <tbody>
 <tr className="border-b">
 <td className="py-2">Coste mensual</td>
 <td>0€ (tiempo)</td>
 <td>150€</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Calidad</td>
 <td>Variable</td>
 <td>Consistente</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Conflictos</td>
 <td>Frecuentes</td>
 <td>Ninguno</td>
 </tr>
 <tr>
 <td className="py-2">Seguro</td>
 <td>No</td>
 <td>Sí</td>
 </tr>
 </tbody>
 </table>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Qué incluye el precio</h2>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✓ Personal cualificado</li>
 <li>✓ Productos profesionales</li>
 <li>✓ Material y herramientas</li>
 <li>✓ Seguro de responsabilidad civil</li>
 <li>✓ Sustituciones por vacaciones/bajas</li>
 <li>✓ Supervisión del servicio</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Cómo ahorrar en limpieza</h2>
 <ol className="mb-12 space-y-2 list-decimal pl-6"> <li><strong>Ajusta la frecuencia:</strong> Evalúa si realmente necesitas limpieza diaria</li>
 <li><strong>Compara presupuestos:</strong> Pide al menos 3 ofertas</li>
 <li><strong>Contrato anual:</strong> Suele tener descuento vs. mensual</li>
 <li><strong>Agrupa servicios:</strong> Contratar varios servicios con la misma empresa</li>
 <li><strong>Mantenimiento preventivo:</strong> Evita limpiezas profundas costosas</li>
 </ol>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Preguntas frecuentes sobre precios</h2>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">¿Se puede negociar el precio?</h3>
 <p className="mb-6 leading-relaxed"> Sí, especialmente en contratos anuales o si contratas servicios adicionales. Las empresas serias 
 suelen tener margen para ajustar según el volumen.
 </p>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">¿Qué pasa si no estoy satisfecho?</h3>
 <p className="mb-6 leading-relaxed"> Las empresas profesionales ofrecen periodo de prueba (1-3 meses) sin permanencia. Si no estás 
 satisfecho, puedes cancelar con preaviso.
 </p>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">¿El IVA está incluido?</h3>
 <p className="mb-6 leading-relaxed"> Normalmente los precios se dan sin IVA. Añade un 21% al precio final.
 </p>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Conclusión</h2>
 <p className="mb-6 leading-relaxed"> El coste de limpieza de una comunidad en Madrid varía entre 80€ y 600€/mes según tamaño y frecuencia. 
 Aunque puede parecer un gasto, dividido entre vecinos suele ser muy asequible (5-8€/vivienda/mes) y 
 aporta tranquilidad y calidad garantizada.
 </p>

 <div className="bg-blue-50 p-6 rounded-lg mt-8">
 <h3 className="text-xl font-bold text-gray-900 mb-4">¿Quieres un presupuesto personalizado?</h3>
 <p className="text-gray-700 mb-4">
 En J.Barranco te enviamos un presupuesto detallado en menos de 24 horas. Sin compromiso.
 </p>
 <div className="flex gap-4">
 <Link to="/contact" className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
 Solicitar Presupuesto Gratis
 </Link>
 <a href="tel:+34618507163" className="bg-brand-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
 📞 Llamar
 </a>
 </div>
 </div>
 </div>
 </article>
 </div>
 </div>
 );
};

export default BlogPost6;
