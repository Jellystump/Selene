// packages/astronomy/index.ts
import { MoonPhase } from 'astronomy-engine';

export const getMoonPhase = (date: Date) => {
    return MoonPhase(date); // Devuelve el ángulo de fase lunar
};