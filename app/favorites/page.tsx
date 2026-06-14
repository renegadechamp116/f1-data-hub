"use client";

import { useState, useEffect } from "react";
import { getFavorites, type Favorite } from "@/lib/favorites";
import Link from "next/link";
import { Driver } from "@/types/f1";
import { TEAMS } from "@/data/teams";
import { getDriversClient } from "@/lib/openf1";
import DriverCard from "@/components/DriverCard";
import TeamCard from "@/components/TeamCard";
import DriverModal from "@/components/DriverModal";
import TeamModal from "@/components/TeamModal";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<typeof TEAMS[keyof typeof TEAMS] | null>(null);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFavorites(getFavorites());
      const allDrivers = await getDriversClient(2026);
      setDrivers(allDrivers);
      setLoading(false);
    };
    load();
  }, []);

  const refresh = () => setFavorites(getFavorites());

  const favoriteDrivers = drivers.filter((d) =>
    favorites.some(
      (f) => f.type === "driver" && f.id === String(d.driver_number)
    )
  );

  const favoriteTeams = Object.values(TEAMS).filter((t) =>
    favorites.some((f) => f.type === "team" && f.id === t.name)
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          My{" "}
          <span style={{
            background: "linear-gradient(135deg, #E8002D, #C89B3C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Favorites
          </span>
        </h1>
        <p className="text-gray-500">
          Your saved drivers and teams. Click ♥ on any card to add or remove.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-56 bg-[#0d0d0d] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (

        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 border border-white/5 rounded-2xl">
          <p className="text-6xl mb-6">♡</p>
          <h2 className="text-white text-xl font-bold mb-2">No favorites yet</h2>
          <p className="text-gray-500 text-sm mb-8 text-center max-w-sm">
            Browse drivers and teams and click the ♡ icon to save them here.
          </p>
          <div className="flex gap-3">
            <Link
              href="/drivers"
              className="px-6 py-2.5 bg-f1red hover:bg-[#c8001f] text-white rounded-lg font-semibold transition-colors text-sm"
            >
              Browse Drivers
            </Link>
            <Link
              href="/teams"
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              Browse Teams
            </Link>
          </div>
        </div>

      ) : (
        <div className="space-y-12">

          {/* Favorite Drivers */}
          {favoriteDrivers.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-f1red rounded-full" />
                <h2 className="text-white text-xl font-black">Drivers</h2>
                <span className="text-gray-600 text-sm">
                  {favoriteDrivers.length} saved
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {favoriteDrivers.map((driver) => (
                  <div
                    key={driver.driver_number}
                    onClick={() => setSelected(driver)}
                  >
                    <DriverCard driver={driver} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Favorite Teams */}
          {favoriteTeams.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-f1gold rounded-full" />
                <h2 className="text-white text-xl font-black">Teams</h2>
                <span className="text-gray-600 text-sm">
                  {favoriteTeams.length} saved
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteTeams.map((team) => (
                  <div
                    key={team.name}
                    onClick={() => setSelectedTeam(team)}
                  >
                    <TeamCard team={team} />
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

      {/* Driver modal */}
      <DriverModal
        driver={selected}
        onClose={() => {
          setSelected(null);
          refresh();
        }}
      />

      {/* Team modal*/}
      <TeamModal
        team={selectedTeam}
        drivers={drivers}
        onClose={() => {
          setSelectedTeam(null);
          refresh();
        }}
      />

    </main>
  );
}