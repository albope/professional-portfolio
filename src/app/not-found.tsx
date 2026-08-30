import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <p className="label-mono mb-6 flex items-center gap-3 text-ink/45">
        <span className="text-cobalt" aria-hidden>
          §404
        </span>
        <span className="h-px w-8 bg-ink/20" aria-hidden />
        Página no encontrada
      </p>
      <h1 className="max-w-2xl text-display-lg font-medium text-ink">
        Esta página{" "}
        <em className="font-display text-[1.06em] font-normal italic">
          no existe todavía.
        </em>
      </h1>
      <p className="mt-6 max-w-md text-lead text-ink/60">
        Y esta, a diferencia del software, no vamos a construirla.
      </p>
      <Link
        href="/"
        className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-cobalt"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 ease-editorial group-hover:-translate-x-1" />
        Volver al inicio
      </Link>
    </div>
  );
}
