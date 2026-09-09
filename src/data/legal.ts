import { site } from "@/data/site";

/** Public identification already present on the site. Contact email approved by the owner. */
export const legal = {
  name: "BORT PEREZ MULTI GESTION SOCIEDAD LIMITADA",
  taxId: "B98629470",
  address: "Avenida Carlos Marx, 1, 12 E, 46920 Mislata, Valencia, España",
  registry: "Registro Mercantil de Valencia, tomo 9786, libro 7068, folio 52, sección 8, hoja V-159244",
  email: site.email,
} as const;
