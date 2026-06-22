// packages/astronomy/index.ts
import { MoonPhase, Illumination, Body } from 'astronomy-engine';

export const getMoonPhase = (date: Date) => {
    return MoonPhase(date); // Devuelve el ángulo de fase lunar
};

export const getMoonIllumination = (date: Date) => {
    const illum = Illumination(Body.Moon, date);
    return Math.round((illum.phase_fraction + Number.EPSILON) * 10000)/100;
};