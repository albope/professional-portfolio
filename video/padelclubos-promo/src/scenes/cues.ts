import type {SceneCues} from "../sfx";
import {cues as MensajesADeshora} from "./mensajes-a-deshora/cues";
import {cues as DoblesReservas} from "./dobles-reservas/cues";
import {cues as GestionFragmentada} from "./gestion-fragmentada/cues";
import {cues as SuenaFamiliar} from "./suena-familiar/cues";
import {cues as Interruptor} from "./interruptor/cues";
import {cues as ReservaMovil} from "./reserva-movil/cues";
import {cues as SinSolapamientos} from "./sin-solapamientos/cues";
import {cues as AdiosAlExcel} from "./adios-al-excel/cues";
import {cues as LigasEnDirecto} from "./ligas-en-directo/cues";
import {cues as ControlDeCobros} from "./control-de-cobros/cues";
import {cues as TodoEnUno} from "./todo-en-uno/cues";
import {cues as TuDescansas} from "./tu-descansas/cues";
import {cues as ConfiguraEn5Minutos} from "./configura-en-5-minutos/cues";
import {cues as Cta} from "./cta/cues";
import {cues as CompeticionesEnExcel} from "./competiciones-en-excel/cues";

/** Registro de cues por escena (id del storyboard → cues de cada formato). */
export const CUES: Record<string, SceneCues> = {
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
