// Blog Post 5: Checklist de limpieza
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BlogPost5: React.FC = () => {
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
 "headline": "Checklist de limpieza para comunidades: Qué debe incluir",
 "description": "Lista completa de tareas esenciales para mantener tu comunidad en perfectas condiciones.",
 "image": "https://j-barranco.web.app/images/blog/checklist-limpieza.webp",
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
 "datePublished": "2025-12-08",
 "dateModified": "2025-12-08"
 })}
 </script>
 <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
 Checklist de limpieza para comunidades: Qué debe incluir
 </h1>
 <div className="flex items-center text-gray-600 text-sm space-x-4">
 <span>📅 8 de Diciembre, 2025</span>
 <span>⏱️ 6 min de lectura</span>
 <span>✍️ J.Barranco</span>
 </div>
 </header>

 {/* Featured Image */}
 <img 
 src="/images/blog/checklist-comunidad.webp" 
 alt="Checklist de limpieza para comunidades" 
 className="w-full h-96 object-cover rounded-lg mb-10 shadow-lg"
 />

 <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-li:text-gray-700 prose-li:my-2 prose-strong:text-gray-900 prose-strong:font-semibold">
 <p className="lead mb-8 text-xl leading-relaxed">
 Un checklist completo de limpieza garantiza que no se olvide ninguna tarea importante. Descarga o imprime 
 esta guía completa para mantener tu comunidad impecable.
 </p>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Checklist diario (Lunes a Viernes)</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <h3 className="font-bold mb-4">Portal y escaleras</h3>
 <ul className="space-y-2">
 <li>☐ Barrido de portal y escaleras</li>
 <li>☐ Fregado de suelos</li>
 <li>☐ Limpieza de barandillas</li>
 <li>☐ Limpieza de buzones</li>
 <li>☐ Vaciado de papeleras</li>
 <li>☐ Limpieza de portero automático</li>
 </ul>

 <h3 className="font-bold mt-6 mb-4">Ascensores</h3>
 <ul className="space-y-2">
 <li>☐ Limpieza de espejos</li>
 <li>☐ Desinfección de botoneras</li>
 <li>☐ Fregado del suelo</li>
 <li>☐ Limpieza de paredes</li>
 </ul>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Checklist semanal</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <ul className="space-y-2">
 <li>☐ Limpieza profunda de escaleras (rincones, techos)</li>
 <li>☐ Cristales interiores del portal</li>
 <li>☐ Limpieza de puertas (interior y exterior)</li>
 <li>☐ Barrido y fregado de rellanos</li>
 <li>☐ Limpieza de interruptores</li>
 <li>☐ Revisión y limpieza de luces</li>
 </ul>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Checklist quincenal</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <ul className="space-y-2">
 <li>☐ Limpieza de garaje (barrido completo)</li>
 <li>☐ Limpieza de trasteros (pasillos)</li>
 <li>☐ Cristales exteriores del portal</li>
 <li>☐ Limpieza de felpudos</li>
 <li>☐ Desinfección profunda de ascensores</li>
 </ul>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Checklist mensual</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <ul className="space-y-2">
 <li>☐ Limpieza de patios y zonas comunes exteriores</li>
 <li>☐ Limpieza de cristales (todos)</li>
 <li>☐ Limpieza de rejillas de ventilación</li>
 <li>☐ Revisión y limpieza de canalones</li>
 <li>☐ Limpieza de plazas de garaje (manchas de aceite)</li>
 <li>☐ Desinfección de contenedores de basura</li>
 </ul>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Checklist trimestral</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <ul className="space-y-2">
 <li>☐ Limpieza de fachada (si procede)</li>
 <li>☐ Limpieza profunda de garaje</li>
 <li>☐ Revisión y limpieza de bajantes</li>
 <li>☐ Limpieza de azotea/cubierta</li>
 <li>☐ Tratamiento anti-plagas (preventivo)</li>
 </ul>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Checklist anual</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <ul className="space-y-2">
 <li>☐ Abrillantado de suelos de mármol/terrazo</li>
 <li>☐ Limpieza profunda de fachada</li>
 <li>☐ Revisión y limpieza de instalaciones</li>
 <li>☐ Pintura de zonas deterioradas</li>
 </ul>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Productos necesarios</h2>
 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Básicos</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>Fregona y cubo</li>
 <li>Escoba y recogedor</li>
 <li>Paños de microfibra</li>
 <li>Guantes de limpieza</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Productos de limpieza</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>Fregasuelos multiusos</li>
 <li>Limpiacristales</li>
 <li>Desinfectante para superficies</li>
 <li>Producto específico para mármol/terrazo</li>
 <li>Limpiador de acero inoxidable</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Consejos para optimizar la limpieza</h2>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✓ Establece un horario fijo</li>
 <li>✓ Divide tareas por días</li>
 <li>✓ Usa productos de calidad</li>
 <li>✓ Mantén el material organizado</li>
 <li>✓ Documenta incidencias</li>
 <li>✓ Revisa el trabajo regularmente</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">¿Cuánto tiempo lleva cada tarea?</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b">
 <th className="text-left py-2">Tarea</th>
 <th className="text-left py-2">Tiempo aprox.</th>
 </tr>
 </thead>
 <tbody>
 <tr className="border-b">
 <td className="py-2">Barrido portal</td>
 <td>10-15 min</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Fregado escaleras</td>
 <td>20-30 min</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Limpieza ascensores</td>
 <td>10 min</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Cristales portal</td>
 <td>15-20 min</td>
 </tr>
 <tr>
 <td className="py-2">Total diario</td>
 <td>1-1.5 horas</td>
 </tr>
 </tbody>
 </table>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Conclusión</h2>
 <p className="mb-6 leading-relaxed"> Un checklist bien estructurado es la clave para mantener una comunidad limpia de forma constante. 
 Imprime esta lista y asegúrate de que todas las tareas se completan en los plazos establecidos.
 </p>

 <div className="bg-blue-50 p-6 rounded-lg mt-8">
 <h3 className="text-xl font-bold text-gray-900 mb-4">¿Prefieres que nos encarguemos nosotros?</h3>
 <p className="text-gray-700 mb-4">
 En J.Barranco seguimos checklists profesionales para garantizar que tu comunidad esté siempre impecable.
 </p>
 <div className="flex gap-4">
 <Link to="/contact" className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
 Solicitar Presupuesto
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

export default BlogPost5;
