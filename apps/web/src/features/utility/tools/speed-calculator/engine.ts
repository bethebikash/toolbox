export type SpeedUnit = 'mps' | 'kph' | 'mph' | 'knot' | 'fps' | 'mach';
export type DistanceUnit = 'meters' | 'km' | 'miles' | 'feet' | 'nautical-miles';
export type TimeUnit = 'seconds' | 'minutes' | 'hours';

export const SPEED_LABELS: Record<SpeedUnit, string> = {
  mps: 'm/s', kph: 'km/h', mph: 'mph', knot: 'knots', fps: 'ft/s', mach: 'Mach',
};

const TO_MPS: Record<SpeedUnit, number> = {
  mps: 1, kph: 1/3.6, mph: 0.44704, knot: 0.514444, fps: 0.3048, mach: 343,
};

const TO_METERS: Record<DistanceUnit, number> = {
  meters: 1, km: 1000, miles: 1609.344, feet: 0.3048, 'nautical-miles': 1852,
};

const TO_SECONDS: Record<TimeUnit, number> = {
  seconds: 1, minutes: 60, hours: 3600,
};

export interface SpeedResult {
  speed:    number;
  distance: number;
  time:     number;
  allSpeeds: Record<SpeedUnit, number>;
}

export function calcSpeed(distanceM: number, timeSec: number): SpeedResult {
  const speedMps = timeSec > 0 ? distanceM / timeSec : 0;
  const allSpeeds = Object.fromEntries(
    Object.entries(TO_MPS).map(([unit, factor]) => [unit, speedMps / factor])
  ) as Record<SpeedUnit, number>;
  return { speed: speedMps, distance: distanceM, time: timeSec, allSpeeds };
}

export function calcDistance(speedMps: number, timeSec: number): number {
  return speedMps * timeSec;
}

export function calcTime(distanceM: number, speedMps: number): number {
  return speedMps > 0 ? distanceM / speedMps : 0;
}

export function convertSpeed(value: number, from: SpeedUnit, to: SpeedUnit): number {
  return value * TO_MPS[from] / TO_MPS[to];
}

export function toMeters(value: number, unit: DistanceUnit): number {
  return value * TO_METERS[unit];
}

export function toSeconds(value: number, unit: TimeUnit): number {
  return value * TO_SECONDS[unit];
}

export const meta = { ready: true };
