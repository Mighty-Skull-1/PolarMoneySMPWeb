import React from 'react';
import { Crown, Trophy, Swords, Coins } from 'lucide-react';
import { SEASON1_TEAMS } from '../data/season1';

const Head: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 24, className }) => (
  <img
    src={`https://mc-heads.net/avatar/${encodeURIComponent(name)}/${size * 2}`}
    alt=""
    width={size}
    height={size}
    loading="lazy"
    className={`rounded bg-slate-800 ${className ?? ''}`}
    style={{ imageRendering: 'pixelated' }}
  />
);

const TIER_LABEL = { CAPTAIN: 'CPT', A: 'A', B: 'B', C: 'C' } as const;

export const Season1Results: React.FC = () => {
  const champion = SEASON1_TEAMS[0];
  const players = SEASON1_TEAMS.flatMap((t) => t.members.map((m) => ({ ...m, team: t.name, hex: t.hex })));
  const topEarner = [...players].sort((a, b) => b.credits - a.credits)[0];
  const topKiller = [...players].sort((a, b) => b.kills - a.kills)[0];

  return (
    <section aria-labelledby="season1-heading" className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 id="season1-heading" className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> SEASON 1 · FINAL STANDINGS
          </h2>
          <p className="text-xs text-slate-400">Willy Money SMP Season 1 is over. Ranked by combined Game Credits.</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">Season complete</span>
      </div>

      {/* Champions + awards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div
          className="lg:col-span-2 relative overflow-hidden p-5 sm:p-6 rounded-2xl border"
          style={{ borderColor: `${champion.hex}66`, background: `linear-gradient(135deg, ${champion.hex}26, #0b0f17 70%)` }}
        >
          <div className="flex items-center gap-2 text-xs font-black tracking-widest text-amber-300">
            <Crown className="w-4 h-4" /> SEASON 1 CHAMPIONS
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-3xl sm:text-4xl font-black text-white">{champion.name}</span>
            <span className="text-xl font-black text-amber-400">{champion.credits.toLocaleString()} credits</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {champion.members.map((m) => (
              <span key={m.name} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-sm font-bold text-white">
                <Head name={m.name} size={22} />
                {m.name}
                {m.tier === 'CAPTAIN' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> Top earner
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Head name={topEarner.name} size={28} />
              <div className="min-w-0">
                <div className="font-black text-white truncate">{topEarner.name}</div>
                <div className="text-xs text-slate-400">{topEarner.credits} credits · {topEarner.team}</div>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-rose-400" /> Most kills
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Head name={topKiller.name} size={28} />
              <div className="min-w-0">
                <div className="font-black text-white truncate">{topKiller.name}</div>
                <div className="text-xs text-slate-400">{topKiller.kills} kills · {topKiller.team}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        {SEASON1_TEAMS.map((team, i) => {
          const kills = team.members.reduce((s, m) => s + m.kills, 0);
          return (
            <div key={team.name} className={`flex flex-col md:flex-row md:items-center gap-3 p-4 ${i ? 'border-t border-slate-800' : ''}`}>
              <div className="flex items-center gap-3 md:w-56 flex-none">
                <span className={`w-8 text-center text-lg font-black ${i === 0 ? 'text-amber-400' : 'text-slate-500'}`}>#{i + 1}</span>
                <span className="w-1.5 h-9 rounded-full" style={{ background: team.hex }} />
                <div>
                  <div className="font-black text-white">{team.name}</div>
                  <div className="text-xs text-slate-400">Capt: {team.members[0].name}</div>
                </div>
              </div>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {team.members.map((m) => (
                  <span key={m.name} className="flex items-center gap-1.5 pl-1 pr-2 py-0.5 rounded-md bg-slate-950/60 border border-slate-800 text-xs text-slate-200">
                    <Head name={m.name} size={18} />
                    {m.name}
                    <span className="text-[10px] font-bold text-slate-500">{TIER_LABEL[m.tier]}</span>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-5 md:justify-end md:w-48 flex-none pl-11 md:pl-0">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Kills</div>
                  <div className="font-bold text-slate-200">{kills}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Credits</div>
                  <div className={`text-lg font-black ${i === 0 ? 'text-amber-400' : 'text-white'}`}>{team.credits.toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
