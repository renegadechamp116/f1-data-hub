/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { Driver } from "@/types/f1";
import { useEffect, useState, useRef } from "react";
import { getDriverCareerStats, getDriverBestLap, DRIVER_IMAGES } from "@/lib/openf1";



interface Props {
  driver: Driver | null;
  onClose: () => void;
  lastSessionKey?: number;
}

interface CareerStats {
  wins: number;
  podiums: number;
  championships: number;
  races: number;
}

function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${mins}:${secs}`;
}

const COUNTRY_FLAGS: Record<string, string> = {
  GBR: "🇬🇧", NED: "🇳🇱", MON: "🇲🇨", ESP: "🇪🇸", GER: "🇩🇪",
  FRA: "🇫🇷", FIN: "🇫🇮", AUS: "🇦🇺", CAN: "🇨🇦", MEX: "🇲🇽",
  JPN: "🇯🇵", THA: "🇹🇭", DEN: "🇩🇰", CHN: "🇨🇳", ITA: "🇮🇹",
  USA: "🇺🇸", BRA: "🇧🇷", ARG: "🇦🇷", BEL: "🇧🇪", POL: "🇵🇱",
  NZL: "🇳🇿", AUT: "🇦🇹", POR: "🇵🇹", SUI: "🇨🇭", RUS: "🇷🇺",
};

export default function DriverModal({ driver, onClose, lastSessionKey }: Props) {
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [bestLap, setBestLap] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const prevDriverRef = useRef<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!driver) return;
    if (prevDriverRef.current === driver.driver_number) return;
    prevDriverRef.current = driver.driver_number;

    const load = async () => {
      setStats(null);
      setBestLap(null);
      setLoadingStats(true);
      const [careerStats, lapTime] = await Promise.all([
        driver.name_acronym
          ? getDriverCareerStats(driver.name_acronym)
          : Promise.resolve(null),
        lastSessionKey
          ? getDriverBestLap(driver.driver_number, lastSessionKey)
          : Promise.resolve(null),
      ]);
      setStats(careerStats);
      setBestLap(lapTime);
      setLoadingStats(false);
    };
    load();
  }, [driver]);

  if (!driver) return null;

  const teamColor = driver.team_colour ? `#${driver.team_colour}` : "#E8002D";

  const statItems = [
    { label: "Races", value: stats?.races },
    { label: "Wins", value: stats?.wins },
    { label: "Podiums", value: stats?.podiums },
    { label: "Titles", value: stats?.championships },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Team color bar */}
        <div className="h-0.5 w-full" style={{ backgroundColor: teamColor }} />

        {/* Close button */}
        <div className="flex justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {/* Photo + gradient bg */}
        <div
          className="flex justify-center py-4"
          style={{
            background: `radial-gradient(ellipse at top, ${teamColor}20, transparent 70%)`,
          }}
        >
          {driver.headshot_url ? (
            <Image
              src={DRIVER_IMAGES[driver.driver_number] ?? driver.headshot_url}
              alt={driver.full_name}
              width={140}
              height={140}
              className="object-contain w-auto h-auto"
              unoptimized
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center text-5xl">
              👤
            </div>
          )}
        </div>

        {/* Name + team */}
        <div className="text-center px-6 pb-4">
          <p className="text-gray-600 font-mono text-xs mb-1">
            #{driver.driver_number}
          </p>
          <h2 className="text-white text-2xl font-black">
            {driver.full_name}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {driver.broadcast_name}
          </p>
          <p className="text-sm font-semibold mt-1" style={{ color: teamColor }}>
            {driver.team_name}
          </p>
        </div>

        {/* Info pills */}
        <div className="flex justify-center gap-3 px-6 pb-5">
          <div className="bg-white/5 rounded-lg px-4 py-2 text-center">
            <p className="text-gray-500 text-xs mb-0.5">Acronym</p>
            <p className="text-white font-bold text-sm">{driver.name_acronym ?? "—"}</p>
          </div>
          <div className="bg-white/5 rounded-lg px-4 py-2 text-center">
            <p className="text-gray-500 text-xs mb-0.5">Country</p>
            <p className="text-white font-bold text-sm">
              {driver.country_code
                ? (COUNTRY_FLAGS[driver.country_code] ?? driver.country_code)
                : "—"}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg px-4 py-2 text-center">
            <p className="text-gray-500 text-xs mb-0.5">Best Lap</p>
            <p className="text-white font-bold text-sm">
              {bestLap ? formatLapTime(bestLap) : "—"}
            </p>
          </div>
        </div>

        {/* Career stats */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">
            Career Statistics
          </p>
          {loadingStats ? (
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 animate-pulse">
                  <div className="h-2 bg-white/10 rounded mb-2 mx-auto w-10" />
                  <div className="h-5 bg-white/10 rounded mx-auto w-8" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-4 gap-2">
              {statItems.map((item) => (
                <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                  <p
                    className="font-black text-lg"
                    style={{ color: item.value ? teamColor : "white" }}
                  >
                    {item.value ?? 0}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 text-sm text-center py-2">
              Stats unavailable
            </p>
          )}
        </div>

      </div>
    </div>
  );
}