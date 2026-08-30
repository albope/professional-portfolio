import { Button } from "@/components/ui/Button";
import { SquareWord } from "@/components/ui/SquareWord";

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[75vh] flex-col items-start justify-center pt-24">
      <p className="label-mono text-ink-mute">Error 404</p>
      <h1 className="display mt-7 max-w-3xl text-display-case text-ink">
        Esta página no está en <SquareWord word="producción" />
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-ink-mute">
        La dirección no existe o ha cambiado. Lo que sí existe está en la
        portada.
      </p>
      <div className="mt-9 flex flex-wrap gap-3.5">
        <Button href="/" className="px-6 py-3.5 text-sm">
          Ir a la portada
        </Button>
        <Button href="/#proyectos" variant="outline" className="px-6 py-3.5 text-sm">
          Ver proyectos
        </Button>
      </div>
    </div>
  );
}
