// Blog Post 4: Limpieza de cristales
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BlogPost4: React.FC = () => {
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
 "headline": "Limpieza de cristales profesional vs. casera: Diferencias",
 "description": "Conoce las técnicas y herramientas que marcan la diferencia en la limpieza de cristales.",
 "image": "https://j-barranco.web.app/images/blog/limpieza-cristales.webp",
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
 "datePublished": "2025-12-11",
 "dateModified": "2025-12-11"
 })}
 </script>
 <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
 Limpieza de cristales profesional vs. casera: Diferencias
 </h1>
 <div className="flex items-center text-gray-600 text-sm space-x-4">
 <span>📅 11 de Diciembre, 2025</span>
 <span>⏱️ 5 min de lectura</span>
 <span>✍️ J.Barranco</span>
 </div>
 </header>  {/* Featured Image */}
  <img 
    src="/images/blog/limpieza-cristales.webp" 
    alt="Cristales limpios y brillantes" 
    className="w-full h-96 object-cover rounded-lg mb-10 shadow-lg"
  />

 <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-li:text-gray-700 prose-li:my-2 prose-strong:text-gray-900 prose-strong:font-semibold">
 <p className="lead mb-8 text-xl leading-relaxed">
 Los cristales limpios transforman cualquier espacio, pero ¿cuál es la diferencia entre hacerlo tú mismo 
 y contratar un profesional? Descubre las técnicas, herramientas y resultados de cada opción.
 </p>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Limpieza casera de cristales</h2>
 
 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Herramientas típicas</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>Papel de periódico o paños de microfibra</li>
 <li>Limpiacristales comercial o mezcla casera (vinagre + agua)</li>
 <li>Escobilla de goma básica</li>
 <li>Escalera doméstica</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Ventajas</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✓ Coste bajo (productos económicos)</li>
 <li>✓ Flexibilidad horaria (cuando quieras)</li>
 <li>✓ Adecuado para mantenimiento regular</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Desventajas</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✗ Resultado con rayas y marcas</li>
 <li>✗ Difícil acceso a cristales altos</li>
 <li>✗ Consume mucho tiempo</li>
 <li>✗ Riesgo de accidentes en alturas</li>
 <li>✗ No elimina suciedad incrustada</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Limpieza profesional de cristales</h2>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Equipamiento profesional</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Pértigas telescópicas:</strong> Alcance hasta 15 metros</li>
 <li><strong>Escobillas profesionales:</strong> Goma de alta calidad</li>
 <li><strong>Productos específicos:</strong> Sin amoníaco, no dejan residuos</li>
 <li><strong>Sistemas de agua pura:</strong> Sin cal ni minerales</li>
 <li><strong>Arneses y EPIs:</strong> Seguridad en trabajos en altura</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Técnicas profesionales</h3>
 
 <h4>1. Método de escobilla (squeegee)</h4>
 <p className="mb-6 leading-relaxed"> Técnica profesional que elimina el agua sin dejar marcas:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>Aplicación uniforme de producto</li>
 <li>Pasadas verticales u horizontales continuas</li>
 <li>Limpieza de bordes con paño</li>
 <li>Resultado sin rayas ni gotas</li>
 </ul>

 <h4>2. Sistema de agua pura (WFP)</h4>
 <p className="mb-6 leading-relaxed"> Tecnología avanzada para cristales exteriores:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>Agua desmineralizada (0 TDS)</li>
 <li>Cepillos especiales en pértigas</li>
 <li>No requiere secado (agua pura no deja marcas)</li>
 <li>Seguro (trabajo desde el suelo)</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Comparativa detallada</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b">
 <th className="text-left py-2">Aspecto</th>
 <th className="text-left py-2">Casera</th>
 <th className="text-left py-2">Profesional</th>
 </tr>
 </thead>
 <tbody>
 <tr className="border-b">
 <td className="py-2">Resultado</td>
 <td>Aceptable</td>
 <td>Impecable</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Tiempo</td>
 <td>2-4 horas</td>
 <td>30-60 min</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Seguridad</td>
 <td>Riesgo medio</td>
 <td>Máxima</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Coste</td>
 <td>5-10€</td>
 <td>40-80€</td>
 </tr>
 <tr>
 <td className="py-2">Frecuencia</td>
 <td>Mensual</td>
 <td>Trimestral</td>
 </tr>
 </tbody>
 </table>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">¿Cuándo contratar un profesional?</h2>
 <p className="mb-6 leading-relaxed"> Es recomendable contratar limpieza profesional en estos casos:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✓ Cristales exteriores de pisos altos</li>
 <li>✓ Grandes superficies acristaladas</li>
 <li>✓ Edificios comerciales u oficinas</li>
 <li>✓ Limpieza post-obra (manchas de cemento, pintura)</li>
 <li>✓ Cristales con suciedad muy incrustada</li>
 <li>✓ Falta de tiempo o movilidad reducida</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Errores comunes en limpieza casera</h2>
 <ol className="mb-12 space-y-2 list-decimal pl-6"> <li><strong>Limpiar con sol directo:</strong> El producto se seca rápido y deja marcas</li>
 <li><strong>Usar papel de periódico:</strong> Puede dejar tinta y no es ecológico</li>
 <li><strong>Productos con amoníaco:</strong> Dañan marcos de aluminio</li>
 <li><strong>Paños sucios:</strong> Rayan el cristal y dejan pelusas</li>
 <li><strong>Demasiado producto:</strong> Más difícil de eliminar</li>
 </ol>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Consejos para mejores resultados caseros</h2>
 <p className="mb-6 leading-relaxed"> Si decides limpiar tú mismo, sigue estos consejos:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✓ Limpia en días nublados o por la tarde</li>
 <li>✓ Usa paños de microfibra limpios</li>
 <li>✓ Mezcla: 1 parte vinagre + 4 partes agua</li>
 <li>✓ Limpia marcos primero, cristal después</li>
 <li>✓ Seca con movimientos en "S"</li>
 <li>✓ Cambia el agua frecuentemente</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Precios de limpieza profesional</h2>
 <p className="mb-6 leading-relaxed"> Tarifas orientativas en Madrid (2025):
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Piso estándar (3 hab):</strong> 40-60€</li>
 <li><strong>Oficina pequeña:</strong> 50-80€</li>
 <li><strong>Comunidad (portales):</strong> 30-50€/mes</li>
 <li><strong>Escaparates comerciales:</strong> 25-40€/mes</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Conclusión</h2>
 <p className="mb-6 leading-relaxed"> Aunque la limpieza casera es válida para mantenimiento regular, la limpieza profesional ofrece resultados 
 superiores, mayor seguridad y ahorro de tiempo. Para cristales exteriores o grandes superficies, la 
 inversión en un servicio profesional siempre merece la pena.
 </p>

 <div className="bg-blue-50 p-6 rounded-lg mt-8">
 <h3 className="text-xl font-bold text-gray-900 mb-4">¿Necesitas limpieza profesional de cristales?</h3>
 <p className="text-gray-700 mb-4">
 En J.Barranco limpiamos cristales de comunidades, oficinas y comercios. Resultados impecables garantizados.
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

export default BlogPost4;
