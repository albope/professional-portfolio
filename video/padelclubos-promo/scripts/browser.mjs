import fs from "node:fs";
import path from "node:path";

/**
 * Chromium para renderizar. Por defecto Remotion descarga su propio
 * chrome-headless-shell; si hay uno instalado (p. ej. el de Playwright) o se
 * indica REMOTION_BROWSER_EXECUTABLE, se usa ese.
 */
export const browserExecutable = () => {
  if (process.env.REMOTION_BROWSER_EXECUTABLE) return process.env.REMOTION_BROWSER_EXECUTABLE;
  const root = "/opt/pw-browsers";
  if (fs.existsSync(root)) {
    const dir = fs.readdirSync(root).find((d) => d.startsWith("chromium_headless_shell-"));
    if (dir) {
      const exe = path.join(root, dir, "chrome-linux", "headless_shell");
      if (fs.existsSync(exe)) return exe;
    }
  }
  return null;
};
