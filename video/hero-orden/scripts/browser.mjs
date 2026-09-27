/**
 * Chromium para renderizar. Por defecto Remotion descarga su propio
 * chrome-headless-shell; con REMOTION_BROWSER_EXECUTABLE se usa otro.
 */
export const browserExecutable = () => process.env.REMOTION_BROWSER_EXECUTABLE || null;
