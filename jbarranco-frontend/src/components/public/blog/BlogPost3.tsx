// Blog Post 3: Abrillantado de suelos
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const BlogPost3: React.FC = () => {
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
 "headline": "Abrillantado de suelos: ¿Cuándo es necesario y cómo se hace?",
 "description": "Todo lo que necesitas saber sobre el abrillantado profesional de suelos de mármol y terrazo.",
 "image": "https://j-barranco.web.app/images/blog/abrillantado-suelos.webp",
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
 "datePublished": "2025-12-14",
 "dateModified": "2025-12-14"
 })}
 </script>
 <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
 Abrillantado de suelos: ¿Cuándo es necesario y cómo se hace?
 </h1>
 <div className="flex items-center text-gray-600 text-sm space-x-4">
 <span>📅 14 de Diciembre, 2025</span>
 <span>⏱️ 7 min de lectura</span>
 <span>✍️ J.Barranco</span>
 </div>
 </header>

 {/* Featured Image */}
 <img 
 src="/images/blog/abrillantado-suelos.webp" 
 alt="Suelo de mármol brillante y profesional" 
 className="w-full h-96 object-cover rounded-lg mb-10 shadow-lg"
 />

 <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-li:text-gray-700 prose-li:my-2 prose-strong:text-gray-900 prose-strong:font-semibold">
 <p className="lead mb-8 text-xl leading-relaxed">
 El abrillantado de suelos es un proceso profesional que devuelve el brillo y protege superficies de 
 mármol, terrazo y granito. Descubre cuándo es necesario y cómo se realiza correctamente.
 </p>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">¿Qué es el abrillantado de suelos?</h2>
 <p className="mb-6 leading-relaxed"> El abrillantado es un tratamiento profesional que consiste en pulir y cristalizar la superficie del suelo 
 para devolverle su brillo original y crear una capa protectora. Es especialmente efectivo en:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>Mármol</li>
 <li>Terrazo</li>
 <li>Granito</li>
 <li>Piedra natural</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">¿Cuándo es necesario abrillantar los suelos?</h2>
 
 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Señales de que necesitas abrillantado</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✗ El suelo ha perdido brillo y se ve opaco</li>
 <li>✗ Aparecen manchas que no se quitan con limpieza normal</li>
 <li>✗ La superficie está rayada o desgastada</li>
 <li>✗ El suelo absorbe líquidos (ha perdido impermeabilización)</li>
 <li>✗ Han pasado más de 2-3 años desde el último abrillantado</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">Frecuencia recomendada</h3>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Zonas de alto tráfico:</strong> Cada 1-2 años</li>
 <li><strong>Zonas de tráfico medio:</strong> Cada 2-3 años</li>
 <li><strong>Zonas de bajo tráfico:</strong> Cada 3-5 años</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Proceso profesional de abrillantado</h2>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">1. Limpieza profunda inicial</h3>
 <p className="mb-6 leading-relaxed"> Antes de abrillantar, es fundamental eliminar toda la suciedad acumulada:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>Barrido y aspirado completo</li>
 <li>Fregado con productos específicos</li>
 <li>Eliminación de ceras y tratamientos antiguos</li>
 <li>Secado completo de la superficie</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">2. Pulido mecánico</h3>
 <p className="mb-6 leading-relaxed"> Se utilizan máquinas rotativas profesionales con discos abrasivos de diferentes granos:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Grano grueso (100-200):</strong> Elimina rayones profundos</li>
 <li><strong>Grano medio (400-800):</strong> Suaviza la superficie</li>
 <li><strong>Grano fino (1500-3000):</strong> Prepara para el brillo final</li>
 </ul>

 <h3 className="font-bold text-2xl text-gray-900 mb-6 mt-8">3. Cristalizado</h3>
 <p className="mb-6 leading-relaxed"> El paso final que proporciona el brillo espejo:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>Aplicación de productos cristalizadores</li>
 <li>Pulido con máquina rotativa y lana de acero</li>
 <li>Reacción química que endurece la superficie</li>
 <li>Creación de capa protectora brillante</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Diferencia entre abrillantado y vitrificado</h2>
 <div className="bg-gray-50 p-6 rounded-lg my-6">
 <h4 className="font-bold mb-4">Comparativa</h4>
 <table className="w-full">
 <thead>
 <tr className="border-b">
 <th className="text-left py-2">Característica</th>
 <th className="text-left py-2">Abrillantado</th>
 <th className="text-left py-2">Vitrificado</th>
 </tr>
 </thead>
 <tbody>
 <tr className="border-b">
 <td className="py-2">Duración</td>
 <td>1-2 años</td>
 <td>3-5 años</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Precio</td>
 <td>Moderado</td>
 <td>Alto</td>
 </tr>
 <tr className="border-b">
 <td className="py-2">Mantenimiento</td>
 <td>Fácil</td>
 <td>Muy fácil</td>
 </tr>
 <tr>
 <td className="py-2">Mejor para</td>
 <td>Uso residencial</td>
 <td>Uso comercial</td>
 </tr>
 </tbody>
 </table>
 </div>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Mantenimiento después del abrillantado</h2>
 <p className="mb-6 leading-relaxed"> Para prolongar los resultados del abrillantado:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✓ Barre o aspira diariamente</li>
 <li>✓ Friega con productos pH neutro</li>
 <li>✓ Evita productos ácidos (vinagre, limón)</li>
 <li>✓ Limpia derrames inmediatamente</li>
 <li>✓ Usa felpudos en entradas</li>
 <li>✓ Coloca protectores bajo muebles</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">¿Cuánto cuesta el abrillantado de suelos?</h2>
 <p className="mb-6 leading-relaxed"> El precio varía según varios factores:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li><strong>Tamaño del espacio:</strong> 8-15€/m²</li>
 <li><strong>Estado del suelo:</strong> +20-30% si está muy deteriorado</li>
 <li><strong>Tipo de material:</strong> Mármol más caro que terrazo</li>
 <li><strong>Accesibilidad:</strong> Pisos altos sin ascensor +10%</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">¿Por qué contratar un profesional?</h2>
 <p className="mb-6 leading-relaxed"> El abrillantado requiere experiencia y equipamiento especializado:
 </p>
 <ul className="mb-12 space-y-2 list-disc pl-6"> <li>✅ Máquinas profesionales de alto rendimiento</li>
 <li>✅ Productos específicos de calidad profesional</li>
 <li>✅ Conocimiento de cada tipo de material</li>
 <li>✅ Técnica correcta para evitar daños</li>
 <li>✅ Resultado uniforme y duradero</li>
 <li>✅ Garantía del trabajo realizado</li>
 </ul>

 <h2 className="font-extrabold text-3xl text-gray-900 mb-8">Conclusión</h2>
 <p className="mb-6 leading-relaxed"> El abrillantado profesional de suelos es una inversión que protege y embellece tus superficies de piedra natural. 
 Con el mantenimiento adecuado, los resultados pueden durar años, manteniendo tus suelos como nuevos.
 </p>

 <div className="bg-blue-50 p-6 rounded-lg mt-8">
 <h3 className="text-xl font-bold text-gray-900 mb-4">¿Necesitas abrillantar tus suelos?</h3>
 <p className="text-gray-700 mb-4">
 En J.Barranco somos especialistas en abrillantado de mármol y terrazo. Presupuesto gratis sin compromiso.
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

export default BlogPost3;
