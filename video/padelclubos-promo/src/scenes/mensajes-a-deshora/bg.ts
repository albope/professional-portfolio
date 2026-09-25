import {color} from "../../brand/tokens";

// Fondo con el que arranca «dobles-reservas» (#1B1814 → #14120F), hecho con
// #1E1B17 al 70 % sobre #14120F para no salir de los tokens. Las dos maquetas
// lo funden encima del suyo antes del match cut: el corte no salta de fondo.
export const NEXT_BG = `radial-gradient(ellipse 70% 60% at 50% 56%, rgba(30,27,23,0.7) 0%, rgba(30,27,23,0) 100%), ${color.darkBg}`;
