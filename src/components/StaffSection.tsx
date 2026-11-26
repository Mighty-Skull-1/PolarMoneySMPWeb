import React from 'react';
import { Crown, Shield } from 'lucide-react';
import { skinUrl } from '../lib/skins';
import type { StaffMember, StaffRank } from '../types/tournament';

const GOLD = '#fbbf24';
const BLUE = '#38bdf8';

const RankBadge: React.FC<{ rank: StaffRank; small?: boolean }> = ({ rank, small }) => {
  const owner = rank === 'OWNER';
  const Icon = owner ? Crown : Shield;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-black uppercase tracking-wider text-[#04101f] ${
        small ? 'px-2 py-0.5 text-[9px] sm:text-[10px]' : 'px-2.5 py-0.5 text-[10px] sm:text-[11px]'
      }`}
      style={{
        background: owner ? 'linear-gradient(180deg, #fde68a, #f59e0b)' : 'linear-gradient(180deg, #bae6fd, #38bdf8)',
        boxShadow: owner ? '0 0 12px rgba(251,191,36,0.45)' : '0 0 10px rgba(56,189,248,0.35)',
      }}
    >
      <Icon className={small ? 'w-2.5 h-2.5' : 'w-3 h-3'} strokeWidth={3} aria-hidden />
      {owner ? 'Owner' : 'Admin'}
    </span>
  );
};

const StaffFigure: React.FC<{ member: StaffMember }> = ({ member }) => {
  const owner = member.rank === 'OWNER';
  const color = owner ? GOLD : BLUE;
  return (
    <li className={`flex flex-col items-center gap-1.5 min-w-0 ${owner ? 'w-28 sm:w-32' : 'w-20 sm:w-24'}`}>
      <div className={`relative flex items-end justify-center ${owner ? 'h-32 sm:h-40' : 'h-20 sm:h-24'}`}>
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%] blur-md opacity-70 ${owner ? 'w-20 h-4' : 'w-12 h-3'}`}
          style={{ background: color }}
          aria-hidden
        />
        <img
          src={skinUrl(member.name)}
          alt={`${member.name}'s Minecraft skin`}
          loading="lazy"
          className="relative h-full w-auto object-contain drop-shadow-[0_0_14px_rgba(95,211,255,0.45)]"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      <span
        className={`font-bold text-white truncate max-w-full rounded-md bg-[#0a1a2e] border ${
          owner ? 'text-xs sm:text-sm px-2 py-1' : 'text-[11px] sm:text-xs px-1.5 py-0.5'
        }`}
        style={{ borderColor: `${color}55` }}
        title={member.name}
      >
        {member.name}
      </span>
      <RankBadge rank={member.rank} small={!owner} />
    </li>
  );
};

/** "Run by": the server's Owners and Admins from /rank. Hidden when nobody has a rank. */
export const StaffSection: React.FC<{ staff?: StaffMember[] }> = ({ staff }) => {
  const owners = (staff ?? []).filter((s) => s.rank === 'OWNER');
  const admins = (staff ?? []).filter((s) => s.rank === 'ADMIN');
  if (owners.length === 0 && admins.length === 0) return null;

  return (
    <section
      aria-labelledby="staff-heading"
      className="mt-8 mx-auto max-w-3xl rounded-2xl border border-sky-400/20 bg-[#08111f]/80 backdrop-blur-sm px-4 py-5 sm:px-8 sm:py-6"
    >
      <h3
        id="staff-heading"
        className="text-center text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-sky-300 pl-[0.3em]"
      >
        Run by
      </h3>

      {owners.length > 0 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-5 sm:gap-x-10">
          {owners.map((m) => (
            <StaffFigure key={m.name} member={m} />
          ))}
        </ul>
      )}

      {admins.length > 0 && (
        <ul
          className={`flex flex-wrap justify-center gap-x-3 gap-y-4 sm:gap-x-6 ${
            owners.length > 0 ? 'mt-5 pt-5 border-t border-sky-400/10' : 'mt-4'
          }`}
        >
          {admins.map((m) => (
            <StaffFigure key={m.name} member={m} />
          ))}
        </ul>
      )}
    </section>
  );
};
