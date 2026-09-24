import type React from "react";
import {Scene as MensajesADeshora} from "./mensajes-a-deshora";
import {Scene as DoblesReservas} from "./dobles-reservas";
import {Scene as GestionFragmentada} from "./gestion-fragmentada";
import {Scene as SuenaFamiliar} from "./suena-familiar";
import {Scene as Interruptor} from "./interruptor";
import {Scene as ReservaMovil} from "./reserva-movil";
import {Scene as SinSolapamientos} from "./sin-solapamientos";
import {Scene as AdiosAlExcel} from "./adios-al-excel";
import {Scene as LigasEnDirecto} from "./ligas-en-directo";
import {Scene as ControlDeCobros} from "./control-de-cobros";
import {Scene as TodoEnUno} from "./todo-en-uno";
import {Scene as TuDescansas} from "./tu-descansas";
import {Scene as ConfiguraEn5Minutos} from "./configura-en-5-minutos";
import {Scene as Cta} from "./cta";
import {Scene as CompeticionesEnExcel} from "./competiciones-en-excel";

/**
 * Registro de escenas: id del storyboard → componente. Cada escena lee su
 * formato con useFormat() y trabaja en frames relativos a su inicio.
 */
export const SCENES: Record<string, React.FC> = {
  "mensajes-a-deshora": MensajesADeshora,
  "dobles-reservas": DoblesReservas,
  "gestion-fragmentada": GestionFragmentada,
  "suena-familiar": SuenaFamiliar,
  "interruptor": Interruptor,
  "reserva-movil": ReservaMovil,
  "sin-solapamientos": SinSolapamientos,
  "adios-al-excel": AdiosAlExcel,
  "ligas-en-directo": LigasEnDirecto,
  "control-de-cobros": ControlDeCobros,
  "todo-en-uno": TodoEnUno,
  "tu-descansas": TuDescansas,
  "configura-en-5-minutos": ConfiguraEn5Minutos,
  "cta": Cta,
  "competiciones-en-excel": CompeticionesEnExcel,
};
