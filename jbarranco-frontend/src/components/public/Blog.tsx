import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { BlogListSkeleton } from '../common/skeletons/BlogSkeleton';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  slug: string;
}

const Blog: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading (in real app would be data fetching)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Cómo mantener limpia una comunidad de vecinos: Guía completa',
      excerpt: 'Descubre las mejores prácticas y consejos profesionales para mantener tu comunidad impecable todo el año.',
      date: '20 de Diciembre, 2025',
      readTime: '8 min',
      author: 'J.Barranco',
      image: '/images/blog/comunidad-limpieza.webp',
      slug: 'como-mantener-limpia-comunidad-vecinos'
    },
    {
      id: '2',
      title: '5 errores comunes al limpiar oficinas (y cómo evitarlos)',
      excerpt: 'Evita estos errores frecuentes que pueden afectar la productividad y la imagen de tu empresa.',
      date: '17 de Diciembre, 2025',
      readTime: '6 min',
      author: 'J.Barranco',
      image: '/images/blog/oficina-limpieza.webp',
      slug: 'errores-comunes-limpiar-oficinas'
    },
    {
      id: '3',
      title: 'Abrillantado de suelos: ¿Cuándo es necesario y cómo se hace?',
      excerpt: 'Todo lo que necesitas saber sobre el abrillantado profesional de suelos de mármol y terrazo.',
      date: '14 de Diciembre, 2025',
      readTime: '7 min',
      author: 'J.Barranco',
      image: '/images/blog/abrillantado-suelos.webp',
      slug: 'abrillantado-suelos-cuando-como'
    },
    {
      id: '4',
      title: 'Limpieza de cristales profesional vs. casera: Diferencias',
      excerpt: 'Conoce las técnicas y herramientas que marcan la diferencia en la limpieza de cristales.',
      date: '11 de Diciembre, 2025',
      readTime: '5 min',
      author: 'J.Barranco',
      image: '/images/blog/limpieza-cristales.webp',
      slug: 'limpieza-cristales-profesional-vs-casera'
    },
    {
      id: '5',
      title: 'Checklist de limpieza para comunidades: Qué debe incluir',
      excerpt: 'Lista completa de tareas esenciales para mantener tu comunidad en perfectas condiciones.',
      date: '8 de Diciembre, 2025',
      readTime: '6 min',
      author: 'J.Barranco',
      image: '/images/blog/checklist-limpieza.webp',
      slug: 'checklist-limpieza-comunidades'
    },
    {
      id: '6',
      title: 'Cuánto cuesta la limpieza de una comunidad en Madrid (2025)',
      excerpt: 'Guía completa de precios y factores que determinan el coste de la limpieza profesional.',
      date: '5 de Diciembre, 2025',
      readTime: '6 min',
      author: 'J.Barranco',
      image: '/images/blog/precios-limpieza.webp',
      slug: 'cuanto-cuesta-limpieza-comunidad-madrid'
    },
    {
      id: '7',
      title: 'Por qué contratar una empresa de limpieza profesional en Madrid',
      excerpt: 'Descubre las ventajas reales que aporta un servicio profesional frente a soluciones caseras.',
      date: '2 de Diciembre, 2025',
      readTime: '7 min',
      author: 'J.Barranco',
      image: '/images/blog/empresa-profesional.webp',
      slug: 'por-que-contratar-empresa-limpieza-profesional'
    }
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-brand-blue mb-4">
            Blog de Limpieza Profesional
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Consejos, guías y mejores prácticas para mantener tus espacios impecables
          </p>
        </div>

        {/* Blog Posts Grid - Show skeleton while loading */}
        {loading ? (
          <BlogListSkeleton count={6} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                aria-label={`Leer artículo: ${post.title}`}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-brand-blue to-blue-600 flex items-center justify-center">
                      <span className="text-white text-6xl" aria-hidden="true">📝</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-brand-blue transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      <time dateTime={post.date}>{post.date}</time>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Necesitas ayuda profesional?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nuestro equipo está listo para ayudarte con cualquier servicio de limpieza que necesites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue focus:outline-none"
              aria-label="Solicitar presupuesto de limpieza"
            >
              Solicitar Presupuesto
            </Link>
            <a
              href="tel:+34618507163"
              className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-brand-green focus:outline-none"
              aria-label="Llamar a J.Barranco Limpieza"
            >
              📞 Llamar Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
