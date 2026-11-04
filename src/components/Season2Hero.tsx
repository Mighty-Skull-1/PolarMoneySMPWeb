import React from 'react';
import { Snowflake, Sparkles, Lock } from 'lucide-react';
import { SEASON2_CHANGES, SEASON2_TIERS, SEASON2_TIER_ORDER, type Season2Tier } from '../data/season2';

const TIER_COLOR: Record<Season2Tier, string> = {
  S: '#fbbf24',
  A: '#f43f5e',
  B: '#a78bfa',
  C: '#34d399',
  D: '#5fd3ff',
};

const LOCAL_SKINS = new Set(['LwkLucky', 'osama_343', 'Slimeprince_', '0ensar', 'galexyworld', 'Myn0x_', 'NaudxNeo', 'itzghuly']);

const SkinFigure: React.FC<{ name: string; color: string }> = ({ name, color }) => (
  <figure className="flex flex-col items-center gap-2 min-w-0">
    <div className="relative h-36 sm:h-44 flex items-end justify-center">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-5 rounded-[50%] blur-md opacity-70"
        style={{ background: color }}
        aria-hidden
      />
      <img
        src={LOCAL_SKINS.has(name) ? `./skins/${name}.png` : `https://mc-heads.net/body/${encodeURIComponent(name)}/120`}
        alt={`${name}'s Minecraft skin`}
        loading="lazy"
        className="relative h-full w-auto object-contain drop-shadow-[0_0_14px_rgba(95,211,255,0.45)]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
    <figcaption className="text-xs sm:text-sm font-bold text-white truncate max-w-full px-2 py-1 rounded-md bg-[#0a1a2e] border border-sky-400/30">
      {name}
    </figcaption>
  </figure>
);

export const Season2Hero: React.FC = () => {
  const revealed = SEASON2_TIER_ORDER.filter((t) => SEASON2_TIERS[t].length > 0);
  // Tiers are revealed from D upwards, so the newest reveal is the best tier with players.
  const latest = revealed[0];

  return (
    <section
      aria-labelledby="season2-heading"
      className="relative overflow-hidden rounded-3xl border border-sky-400/20 mb-10 bg-[#050b18]"
    >
      {/* aurora */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 -left-20 w-[60%] h-64 rounded-full bg-emerald-400/20 blur-3xl aurora-a" />
        <div className="absolute -top-16 right-0 w-[55%] h-56 rounded-full bg-indigo-500/25 blur-3xl aurora-b" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-sky-900/30 to-transparent" />
        <div className="snow absolute inset-0" />
      </div>

      <div className="relative px-5 sm:px-10 pt-10 pb-8 sm:pt-14">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase bg-sky-400/10 text-sky-300 border border-sky-400/30">
            <Snowflake className="w-3.5 h-3.5" /> Coming soon
          </span>
          <h2 id="season2-heading" className="mt-4 text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_24px_rgba(56,170,255,0.55)]">
            POLAR <span className="text-amber-400">MONEY</span> SMP
          </h2>
          <p className="mt-2 text-lg sm:text-2xl font-black tracking-[0.5em] text-sky-300 pl-[0.5em]">SEASON 2</p>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            Season 1 is over and <strong className="text-purple-300">Team Purple</strong> took the crown. Season 2 brings a new name, a new tier
            list and a new draft. The tiers are being revealed one at a time.
          </p>
        </div>

        {/* What's new */}
        <ul className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {SEASON2_CHANGES.map((c) => (
            <li key={c.title} className="p-3 sm:p-4 rounded-xl bg-[#0a1628]/80 border border-sky-400/15">
              <div className="text-sm font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-300 flex-none" /> {c.title}
              </div>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{c.detail}</p>
            </li>
          ))}
        </ul>

        {/* Tier reveals */}
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
            <h3 className="text-lg sm:text-xl font-black text-white">SEASON 2 DRAFT TIERS</h3>
            {latest && (
              <span className="text-xs font-bold text-sky-300">
                Latest reveal: Tier {latest} · {revealed.length} of {SEASON2_TIER_ORDER.length} revealed
              </span>
            )}
          </div>

          <div className="space-y-3">
            {SEASON2_TIER_ORDER.map((tier) => {
              const players = SEASON2_TIERS[tier];
              const color = TIER_COLOR[tier];
              return (
                <div
                  key={tier}
                  className="flex items-stretch gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#08111f]/90 border"
                  style={{ borderColor: players.length ? `${color}55` : 'rgba(51,65,85,0.6)' }}
                >
                  <div
                    className="flex-none w-12 sm:w-16 rounded-xl flex items-center justify-center text-2xl sm:text-4xl font-black"
                    style={{ color: players.length ? '#04101f' : color, background: players.length ? color : `${color}14` }}
                  >
                    {tier}
                  </div>
                  {players.length ? (
                    <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-end">
                      {players.map((p) => (
                        <SkinFigure key={p} name={p} color={color} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-2 text-sm text-slate-500">
                      <Lock className="w-4 h-4" /> Revealing soon
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
