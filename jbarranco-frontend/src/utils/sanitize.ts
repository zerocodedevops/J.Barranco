import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitiza contenido HTML para prevenir XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
        ALLOWED_ATTR: ["href", "target", "rel"],
    });
};

/**
 * Sanitiza texto plano (elimina todos los tags HTML)
 */
export const sanitizeText = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
};

/**
 * Sanitiza input de usuario para formularios
 * Permite tags básicos de formato pero elimina scripts y enlaces
 */
export const sanitizeUserInput = (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
        ALLOWED_ATTR: [],
    });
};
