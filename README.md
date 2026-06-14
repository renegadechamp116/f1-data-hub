# F1 Data Hub 🏎️

A Formula 1 data website built with Next.js, TypeScript, and Tailwind CSS. Explore drivers, teams, race results, and championship standings from every F1 season since 1950.

## Live Site
Coming soon on Vercel.

## Features

- **Drivers** — Browse the 2026 F1 grid, view career stats, wins, podiums, and championships
- **Teams** — All 11 constructors with team info, principals, and driver lineups
- **Race Archive** — Full race results from every Grand Prix since 1950
- **Standings** — Driver and Constructor championship standings for every season
- **Compare** — Head-to-head career stat comparison between any two drivers

## Tech Stack

- [Next.js 16](https://nextjs.org/) — Framework
- [TypeScript](https://www.typescriptlang.org/) — Language
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [OpenF1 API](https://openf1.org/) — Live 2026 driver and session data
- [Jolpica/Ergast API](https://api.jolpi.ca/) — Historical race results and standings

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sdprojects12/f1-data-hub
cd f1-data-hub
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
f1-data-hub/
├── app/                    # Pages and API routes
│   ├── page.tsx            # Home page
│   ├── drivers/            # Drivers page
│   ├── teams/              # Teams page
│   ├── races/              # Race archive
│   ├── standings/          # Championship standings
│   ├── compare/            # Driver comparison
│   └── api/career/         # Career stats API route
├── components/             # Reusable UI components
├── lib/openf1.ts           # All API functions
├── types/f1.ts             # TypeScript type definitions
├── data/teams.ts           # Local team data
└── public/                 # Static images

## Data Sources

- **OpenF1 API** — Free, no API key required. Provides live session and driver data from 2023 onwards.
- **Jolpica/Ergast API** — Free, no API key required. Provides complete F1 historical data from 1950 to present.

## Notes

- Constructor standings are only available from 1958 onwards (when they were introduced).
- Driver images are sourced from the OpenF1 API and may not always reflect the latest season.
- Best lap times are only available for sessions with OpenF1 data (2023+).

## License
MIT
