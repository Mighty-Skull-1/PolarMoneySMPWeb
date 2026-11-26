// Player pictures: public/skins/<name>.png for players listed here, otherwise their live Minecraft skin.

const LOCAL_SKINS = new Set(['LwkLucky', 'osama_343', 'Slimeprince_', '0ensar', 'galexyworld', 'Myn0x_', 'NaudxNeo', 'itzghuly',
  'JetCreature', 'HopperNot', 'bobu2032', 'ablec',
  'Toniqp', 'MarkusAllard', 'sleepycatsz', 'Secretlife__',
  'Valdfilt', 'Willysmannen', 'NightDay_', 'ThuulBot',
  'm_gamer11', 'Arshzas', 'AuroraTiles', 'ex1l_', 'Vryqs']);

/** Full-body skin image for a Minecraft name. */
export function skinUrl(name: string, size = 120): string {
  return LOCAL_SKINS.has(name) ? `./skins/${name}.png` : `https://mc-heads.net/body/${encodeURIComponent(name)}/${size}`;
}
