export interface AgeResult {
  years:        number;
  months:       number;
  days:         number;
  totalDays:    number;
  totalWeeks:   number;
  totalHours:   number;
  totalMinutes: number;
  nextBirthday: { date: string; daysUntil: number };
  dayOfWeek:    string;
  zodiac:       string;
  chineseZodiac:string;
}

const DAYS_OF_WEEK = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const ZODIAC = [
  { sign: 'Capricorn', end: [1, 19] },
  { sign: 'Aquarius',  end: [2, 18] },
  { sign: 'Pisces',    end: [3, 20] },
  { sign: 'Aries',     end: [4, 19] },
  { sign: 'Taurus',    end: [5, 20] },
  { sign: 'Gemini',    end: [6, 20] },
  { sign: 'Cancer',    end: [7, 22] },
  { sign: 'Leo',       end: [8, 22] },
  { sign: 'Virgo',     end: [9, 22] },
  { sign: 'Libra',     end: [10,22] },
  { sign: 'Scorpio',   end: [11,21] },
  { sign: 'Sagittarius',end:[12,21] },
  { sign: 'Capricorn', end: [12,31] },
];

const CHINESE = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];

export function calculateAge(birthDateStr: string, toDateStr?: string): AgeResult {
  const birth  = new Date(birthDateStr);
  const to     = toDateStr ? new Date(toDateStr) : new Date();

  const diffMs    = to.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let years  = to.getFullYear() - birth.getFullYear();
  let months = to.getMonth() - birth.getMonth();
  let days   = to.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }

  // Next birthday
  const nextBD = new Date(to.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBD <= to) nextBD.setFullYear(nextBD.getFullYear() + 1);
  const daysUntil = Math.ceil((nextBD.getTime() - to.getTime()) / (1000 * 60 * 60 * 24));

  // Zodiac
  const m = birth.getMonth() + 1;
  const d = birth.getDate();
  const zodiac = ZODIAC.find(z => m < z.end[0]! || (m === z.end[0] && d <= z.end[1]!))?.sign ?? 'Capricorn';

  // Chinese zodiac
  const chineseZodiac = CHINESE[(birth.getFullYear() - 1900) % 12]!;

  return {
    years, months, days,
    totalDays,
    totalWeeks:   Math.floor(totalDays / 7),
    totalHours:   Math.floor(diffMs / (1000 * 60 * 60)),
    totalMinutes: Math.floor(diffMs / (1000 * 60)),
    nextBirthday: {
      date:       nextBD.toISOString().split('T')[0]!,
      daysUntil,
    },
    dayOfWeek:    DAYS_OF_WEEK[birth.getDay()]!,
    zodiac,
    chineseZodiac,
  };
}

export const meta = { ready: true };
