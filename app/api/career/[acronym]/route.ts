import { NextResponse } from "next/server";

const DRIVER_ID_MAP: Record<string, string> = {
  NOR: "norris",
  VER: "max_verstappen",
  HAM: "hamilton",
  LEC: "leclerc",
  SAI: "sainz",
  RUS: "russell",
  PIA: "piastri",
  ALO: "alonso",
  STR: "stroll",
  OCO: "ocon",
  GAS: "gasly",
  ALB: "albon",
  BOT: "bottas",
  ZHO: "zhou",
  MAG: "kevin_magnussen",
  HUL: "hulkenberg",
  TSU: "tsunoda",
  RIC: "ricciardo",
  LAW: "lawson",
  BEA: "bearman",
  ANT: "antonelli",
  BOR: "bortoleto",
  HAD: "hadjar",
  DOO: "doohan",
  COL: "colapinto",
  LIN: "lindblad",
};

const CHAMPIONSHIPS: Record<string, number> = {
  hamilton: 7,
  max_verstappen: 4,
  alonso: 2,
  norris: 1,
  leclerc: 0,
  russell: 0,
  sainz: 0,
  piastri: 0,
  ricciardo: 0,
  bottas: 0,
  hulkenberg: 0,
  gasly: 0,
  ocon: 0,
  albon: 0,
  stroll: 0,
  tsunoda: 0,
  zhou: 0,
  kevin_magnussen: 0,
  lawson: 0,
  bearman: 0,
  antonelli: 0,
  bortoleto: 0,
  hadjar: 0,
  doohan: 0,
  colapinto: 0,
  lindblad: 0,
};

// Fetches all pages from a Jolpica endpoint and returns every Race object
async function fetchAllRaces(url: string): Promise<{ Results: { position: string }[] }[]> {
  const limit = 100;
  let offset = 0;
  let total = Infinity;
  const allRaces: { Results: { position: string }[] }[] = [];

  while (offset < total) {
    const res = await fetch(`${url}&limit=${limit}&offset=${offset}`);
    if (!res.ok) break;

    const data = await res.json();
    total = parseInt(data?.MRData?.total ?? "0");
    const races = data?.MRData?.RaceTable?.Races ?? [];
    allRaces.push(...races);
    offset += limit;

    // Safety valve — never fetch more than 10 pages (1000 races)
    if (offset >= 1000) break;
  }

  return allRaces;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ acronym: string }> }
) {
  const { acronym } = await params;
  const driverId = DRIVER_ID_MAP[acronym.toUpperCase()];

  if (!driverId) {
    return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  }

  const base = "https://api.jolpi.ca/ergast/f1";

  try {
    // Fetch wins total and all races (paginated)
    const [winsRes, allRaces] = await Promise.all([
      fetch(`${base}/drivers/${driverId}/results/1.json?limit=1`),
      fetchAllRaces(`${base}/drivers/${driverId}/results.json?`),
    ]);

    if (!winsRes.ok) {
      return NextResponse.json({ error: "Jolpica fetch failed" }, { status: 500 });
    }

    const winsData = await winsRes.json();
    const wins = parseInt(winsData?.MRData?.total ?? "0");
    const races = allRaces.length;

    const podiums = allRaces.filter((race) => {
      const pos = parseInt(race?.Results?.[0]?.position ?? "99");
      return pos >= 1 && pos <= 3;
    }).length;

    const championships = CHAMPIONSHIPS[driverId] ?? 0;

    console.log(`${driverId}: races=${races}, wins=${wins}, podiums=${podiums}`);

    return NextResponse.json({ wins, podiums, championships, races });
  } catch (err) {
    console.error("Career route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}