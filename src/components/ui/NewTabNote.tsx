import { copyEs } from "@/data/copy";
import { NEW_TAB_NOTE_ID } from "@/components/ui/BaseLink";

/**
 * Aviso «(se abre en otra pestaña)», una sola vez por página. Va oculto y
 * los enlaces externos lo leen por `aria-describedby`, que también anuncia
 * contenido oculto. Lo monta el layout raíz.
 */
export function NewTabNote() {
  return (
    <span id={NEW_TAB_NOTE_ID} hidden>
      {copyEs.comun.nueva_pestana}
    </span>
  );
}
