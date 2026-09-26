/**
 * Script en línea que corre mientras el navegador analiza el HTML, antes del
 * primer pintado (guía de Next «preventing flash before hydration»). En el
 * servidor sale como `text/javascript` y en el cliente como `text/plain`, así
 * React no avisa de que pinta un `<script>` y en navegaciones de cliente no
 * se vuelve a ejecutar. `suppressHydrationWarning` acepta la diferencia de
 * `type` entre los dos.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
