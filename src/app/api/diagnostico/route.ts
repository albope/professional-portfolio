import { createDiagnosticoHandler } from "@/lib/diagnostico-server";

export const runtime = "nodejs";
export const POST = createDiagnosticoHandler({
  // Solo resultado o código de error y modelo: el texto del visitante no se registra.
  onEvent: (entry) => {
    console.info(JSON.stringify({ stream: "bpm-diagnostico", ...entry }));
  },
});
