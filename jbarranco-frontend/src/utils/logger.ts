/**
 * Logger utility para J-Barranco
 * Controla los logs según el entorno (desarrollo/producción)
 */

const isDev = import.meta.env.DEV;
const isTest = import.meta.env.MODE === "test";

interface Timer {
    end: () => void;
}

type LogFn = (...args: unknown[]) => void;

interface Logger {
    log: LogFn;
    info: LogFn;
    warn: LogFn;
    error: LogFn;
    debug: LogFn;
    table: (data: unknown) => void;
    group: (label: string) => void;
    groupEnd: () => void;
    time: (label: string) => Timer;
}

/**
 * Logger que solo muestra logs en desarrollo
 * En producción solo muestra errores críticos
 */
const logger: Logger = {
    /**
     * Log informativo - solo en desarrollo
     */
    log: (...args: unknown[]) => {
        if (isDev && !isTest) {
            console.log(...args);
        }
    },

    /**
     * Log de información - solo en desarrollo
     */
    info: (...args: unknown[]) => {
        if (isDev && !isTest) {
            console.info(...args);
        }
    },

    /**
     * Advertencias - siempre se muestran
     */
    warn: (...args: unknown[]) => {
        if (!isTest) {
            console.warn(...args);
        }
    },

    /**
     * Errores - siempre se muestran
     */
    error: (...args: unknown[]) => {
        console.error(...args);

        // Aquí podrías añadir integración con servicios de tracking
        // como Sentry, LogRocket, etc.
        // if (import.meta.env.PROD) {
        //   Sentry.captureException(args[0]);
        // }
    },

    /**
     * Debug detallado - solo en desarrollo
     */
    debug: (...args: unknown[]) => {
        if (isDev && !isTest) {
            console.debug(...args);
        }
    },

    /**
     * Tabla - solo en desarrollo
     */
    table: (data: unknown) => {
        if (isDev && !isTest) {
            console.table(data);
        }
    },

    /**
     * Grupo de logs - solo en desarrollo
     */
    group: (label: string) => {
        if (isDev && !isTest) {
            console.group(label);
        }
    },

    groupEnd: () => {
        if (isDev && !isTest) {
            console.groupEnd();
        }
    },

    /**
     * Helper para cronometrar operaciones
     * Uso:
     *   const timer = logger.time('operacion');
     *   // ... código
     *   timer.end(); // Muestra tiempo transcurrido
     */
    time: (label: string): Timer => {
        const start = performance.now();

        return {
            end: () => {
                const duration = performance.now() - start;
                logger.debug(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
            },
        };
    },
};

export { logger };
export default logger;
