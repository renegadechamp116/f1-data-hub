import { Driver, Race } from "@/types/f1";

const BASE_URL = "https://api.openf1.org/v1";

// 2025 Constructors Championship order
export const TEAM_ORDER: Record<string, number> = {
  "McLaren": 1,
  "Ferrari": 2,
  "Red Bull Racing": 3,
  "Mercedes": 4,
  "Aston Martin": 5,
  "Alpine": 6,
  "Haas F1 Team": 7,
  "Racing Bulls": 8,
  "Williams": 9,
  "Kick Sauber": 10,
  "Audi": 11,
  "Cadillac": 12,
};

// Driver image overrides — local images take priority over API images
export const DRIVER_IMAGES: Record<number, string> = {
  1:  "/drivers/1.png",
  3:  "/drivers/3.png",
  5:  "/drivers/5.png",
  6:  "/drivers/6.png",
  7:  "/drivers/7.png",
  10: "/drivers/10.png",
  11: "/drivers/11.png",
  12: "/drivers/12.png",
  14: "/drivers/14.png",
  16: "/drivers/16.png",
  18: "/drivers/18.png",
  22: "/drivers/22.png",
  23: "/drivers/23.png",
  27: "/drivers/27.png",
  30: "/drivers/30.png",
  31: "/drivers/31.png",
  38: "/drivers/38.png",
  41: "/drivers/41.png",
  43: "/drivers/43.png",
  44: "/drivers/44.png",
  55: "/drivers/55.png",
  63: "/drivers/63.png",
  77: "/drivers/77.png",
  81: "/drivers/81.png",
  87: "/drivers/87.png",
  94: "/drivers/94.png",
};

// Waits a given number of milliseconds
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));



// Server-side driver fetch (uses Next.js cache)
export async function getDrivers(year: number = 2026): Promise<Driver[]> {
  try {
    const sessionsRes = await fetch(
      `${BASE_URL}/sessions?year=${year}&session_type=Race`,
      { next: { revalidate: 3600 } }
    );
    if (!sessionsRes.ok) return [];

    const sessions: Race[] = await sessionsRes.json();
    if (sessions.length === 0) return [];

    const lastSession = sessions[sessions.length - 1];

    const driversRes = await fetch(
      `${BASE_URL}/drivers?session_key=${lastSession.session_key}`,
      { next: { revalidate: 3600 } }
    );
    if (!driversRes.ok) return [];

    const data: Driver[] = await driversRes.json();
    const seen = new Set<number>();
    return data.filter((driver) => {
      if (!driver.driver_number) return false;
      if (seen.has(driver.driver_number)) return false;
      seen.add(driver.driver_number);
      return true;
    });
  } catch {
    return [];
  }
}

// Client-safe version — no Next.js cache options
// Client-safe version — routes through our proxy to avoid CORS
export async function getDriversClient(year: number = 2026): Promise<Driver[]> {
  try {
    const sessionsRes = await fetch(
      `/api/openf1?path=sessions&year=${year}&session_type=Race`
    );
    if (!sessionsRes.ok) return [];

    const sessions: Race[] = await sessionsRes.json();
    if (sessions.length === 0) return [];

    const lastSession = sessions[sessions.length - 1];

    await sleep(300);

    const driversRes = await fetch(
      `/api/openf1?path=drivers&session_key=${lastSession.session_key}`
    );
    if (!driversRes.ok) return [];

    return await driversRes.json();
  } catch {
    return [];
  }
}

export async function getDriverByNumber(
  driverNumber: number
): Promise<Driver | null> {
  try {
    const sessionsRes = await fetch(
      `${BASE_URL}/sessions?year=2026&session_type=Race`,
      { next: { revalidate: 3600 } }
    );
    if (!sessionsRes.ok) return null;

    const sessions: Race[] = await sessionsRes.json();
    if (sessions.length === 0) return null;

    const lastSession = sessions[sessions.length - 1];

    const res = await fetch(
      `${BASE_URL}/drivers?driver_number=${driverNumber}&session_key=${lastSession.session_key}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data: Driver[] = await res.json();
    return data[0] ?? null;
  } catch {
    return null;
  }
}

export async function getRaces(year: number = 2026): Promise<Race[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/sessions?year=${year}&session_type=Race`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getRacesClient(year: number = 2026): Promise<Race[]> {
  try {
    const res = await fetch(
      `/api/openf1?path=sessions&year=${year}&session_type=Race`
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getDriverBestLap(
  driverNumber: number,
  sessionKey: number
): Promise<number | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/laps?session_key=${sessionKey}&driver_number=${driverNumber}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const laps: { lap_duration: number | null; is_pit_out_lap: boolean }[] =
      await res.json();

    const valid = laps
      .filter((l) => l.lap_duration !== null && !l.is_pit_out_lap)
      .map((l) => l.lap_duration as number);

    if (valid.length === 0) return null;
    return Math.min(...valid);
  } catch {
    return null;
  }
}

export async function getDriverCareerStats(nameAcronym: string): Promise<{
  wins: number;
  podiums: number;
  championships: number;
  races: number;
} | null> {
  try {
    const res = await fetch(`/api/career/${nameAcronym}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getSeasonRaces(year: number): Promise<{
  round: string;
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: { country: string; locality: string };
  };
  date: string;
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/races.json?limit=100`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races ?? [];
  } catch {
    return [];
  }
}

export async function getRaceResults(
  year: number,
  round: string
): Promise<{
  position: string;
  Driver: { givenName: string; familyName: string; nationality: string };
  Constructor: { name: string };
  Time?: { time: string };
  FastestLap?: { rank: string; Time: { time: string } };
  grid: string;
  points: string;
  status: string;
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races?.[0]?.Results ?? [];
  } catch {
    return [];
  }
}

export async function getDriverStandings(year: number): Promise<{
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    permanentNumber?: string;
  };
  Constructors: { name: string; constructorId: string }[];
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/driverstandings.json?limit=100`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
  } catch {
    return [];
  }
}

export async function getConstructorStandings(year: number): Promise<{
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/constructorstandings.json?limit=100`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
  } catch {
    return [];
  }
}

export async function getQualifyingResults(
  year: number,
  round: string
): Promise<{
  position: string;
  Driver: { givenName: string; familyName: string; nationality: string };
  Constructor: { name: string };
  Q1: string;
  Q2: string;
  Q3: string;
}[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying.json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults ?? [];
  } catch {
    return [];
  }
}