/**
 * Logger Utility
 * 
 * Development-only logging utility as specified in Context.txt.
 * Logs are only shown in local development mode, suppressed in production.
 */

const isLocal = import.meta.env.DEV;

export const logger = {
    info: (message: string, ...args: any[]) => {
        if (isLocal) console.log(`[INFO]: ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
        if (isLocal) console.error(`[ERROR]: ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
        if (isLocal) console.warn(`[WARN]: ${message}`, ...args);
    },
    debug: (message: string, ...args: any[]) => {
        if (isLocal) console.debug(`[DEBUG]: ${message}`, ...args);
    },
};

export default logger;
