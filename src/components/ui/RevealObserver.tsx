"use client";

import { useLayoutEffect } from "react";
import { isOnScreen } from "@/lib/useInView";

const SELECTOR = "[data-reveal]";

/**
 * Observador único de la aparición al hacer scroll (4.9). Lo monta el layout
 * una vez y vigila todos los `[data-reveal]` de la página, también los que
 * aparezcan después (cambio de ruta, estados del formulario).
 *
 * Orden de las cosas, para que nada parpadee ni se quede oculto:
 * 1. Repone `.js` en `<html>`: en desarrollo, el remontaje de Strict Mode
 *    limpia la clase que puso el script en línea (guía «preventing flash
 *    before hydration»). En producción no cambia nada.
 * 2. Marca en el acto con `data-revealed` los bloques que ya están en
 *    pantalla, antes de pintar, y observa el resto.
 * 3. Solo entonces pone `.reveal-ready`, que es lo que permite a la CSS
 *    ocultar los bloques pendientes. Si este JS no llega a ejecutarse, nada
 *    se oculta.
 *
 * `data-revealed` no lo pinta React, así que ningún re-render lo borra.
 * Umbral 0,08 y margen inferior de -6 %, como el prototipo.
 */
export function RevealObserver() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    if (typeof IntersectionObserver === "undefined" || typeof MutationObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );

    const arm = (element: Element) => {
      if (element.hasAttribute("data-revealed")) return;
      if (isOnScreen(element)) {
        element.setAttribute("data-revealed", "");
        return;
      }
      observer.observe(element);
    };

    const scan = (node: ParentNode) => {
      if (node instanceof Element && node.matches(SELECTOR)) arm(node);
      node.querySelectorAll(SELECTOR).forEach(arm);
    };

    scan(document);
    root.classList.add("reveal-ready");

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) scan(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
