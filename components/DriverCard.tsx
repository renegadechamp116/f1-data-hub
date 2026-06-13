import Image from "next/image";
import { Driver } from "@/types/f1";
import { DRIVER_IMAGES } from "@/lib/openf1";

export default function DriverCard({ driver }: { driver: Driver }) {
  const teamColor = driver.team_colour ? `#${driver.team_colour}` : "#E8002D";

  return (
    <div className="bg-[#0d0d0d] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer">

      {/* Team color bar */}
      <div className="h-0.5 w-full" style={{ backgroundColor: teamColor }} />

      {/* Driver image area */}
      <div
        className="flex justify-center pt-8 pb-2 relative"
        style={{ background: `radial-gradient(ellipse at top, ${teamColor}15, transparent 70%)` }}
      >
        {driver.headshot_url ? (
          <Image
            src={DRIVER_IMAGES[driver.driver_number] ?? driver.headshot_url}
            alt={driver.full_name}
            width={90}
            height={90}
            className="object-contain relative z-10 w-auto h-auto"
            loading="eager"
            unoptimized
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl">
            👤
          </div>
        )}
      </div>

      {/* Driver info */}
      <div className="px-4 pb-5 text-center">
        <p className="text-gray-600 font-mono text-xs mb-1">
          #{driver.driver_number}
        </p>
        <h3 className="text-white font-bold text-base leading-tight group-hover:text-f1gold transition-colors">
          {driver.full_name}
        </h3>
        <p className="text-xs font-medium mt-1.5" style={{ color: teamColor }}>
          {driver.team_name}
        </p>
      </div>

    </div>
  );
}