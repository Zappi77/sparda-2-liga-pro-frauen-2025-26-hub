import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const gitRoot = "/Users/zappi01/git";
const planegg = "/Users/zappi01/Documents/Codex/2026-06-22/kannst-du-die-spiele-von-dshs/tv-planegg-krailling-2025-26/games.js";
const gameFiles = fs.readdirSync(gitRoot)
  .filter(name => name.endsWith("-2025-26") && fs.existsSync(path.join(gitRoot, name, "games.js")))
  .map(name => path.join(gitRoot, name, "games.js"));
if (fs.existsSync(planegg)) gameFiles.push(planegg);

function readGameFile(file) {
  const source = fs.readFileSync(file, "utf8") + `\n;globalThis.__exported = {
    games: typeof games === "undefined" ? [] : games,
    youtubeViews: typeof youtubeViews === "undefined" ? {} : youtubeViews,
    youtubeViewsDate: typeof youtubeViewsDate === "undefined" ? "" : youtubeViewsDate,
    teamLogoUrls: typeof teamLogoUrls === "undefined" ? {} : teamLogoUrls,
    finalStandings: typeof finalStandings === "undefined" ? null : finalStandings
  };`;
  const context = {};
  vm.runInNewContext(source, context, { filename: file });
  return context.__exported;
}

const sources = gameFiles.map(file => ({ file, ...readGameFile(file) }));
const gamesByMatch = new Map();

for (const source of sources) {
  for (const game of source.games) {
    const key = String(game.matchId || `${game.date}|${game.home}|${game.away}`);
    const existing = gamesByMatch.get(key) || {};
    const mappedViews = source.youtubeViews[String(game.number)];
    const candidateViews = Number.isFinite(mappedViews) ? mappedViews : game.youtubeViews;
    const existingViews = existing.youtubeViews;
    const videoUrl = [existing.videoUrl, game.videoUrl].find(url =>
      url && /youtu(?:\.be|be\.com)/i.test(url) && !/\/results\?/i.test(url)
    ) || "";
    gamesByMatch.set(key, {
      ...existing,
      number: game.number,
      matchId: game.matchId,
      date: game.date,
      time: game.time,
      home: game.home,
      away: game.away,
      score: game.score,
      spectators: game.spectators,
      duration: game.duration,
      videoUrl,
      youtubeViews: Number.isFinite(candidateViews)
        ? Math.max(existingViews ?? 0, candidateViews)
        : (existingViews ?? null),
      youtubeViewsDate: Number.isFinite(candidateViews) ? source.youtubeViewsDate : (existing.youtubeViewsDate || "")
    });
  }
}

const parseDate = value => {
  const [day, month, year] = value.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
};
const matches = [...gamesByMatch.values()].sort((a, b) => parseDate(a.date) - parseDate(b.date) || a.number - b.number);
const standings = sources.find(source => source.finalStandings?.overall)?.finalStandings.overall || [];
const remoteTeamLogoUrls = sources.find(source => Object.keys(source.teamLogoUrls || {}).length)?.teamLogoUrls || {};
const slugify = value => value
  .toLowerCase()
  .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const localTeamLogoUrls = Object.fromEntries(Object.keys(remoteTeamLogoUrls).map(team => [team, `assets/logos/${slugify(team)}.png`]));
const youtubeByTeam = Object.fromEntries(standings.map(row => [row.team, { games: 0, views: 0 }]));
for (const match of matches) {
  if (!Number.isFinite(match.youtubeViews)) continue;
  for (const team of [match.home, match.away]) {
    if (!youtubeByTeam[team]) youtubeByTeam[team] = { games: 0, views: 0 };
    youtubeByTeam[team].games += 1;
    youtubeByTeam[team].views += match.youtubeViews;
  }
}

const payload = {
  generated: new Date().toISOString(),
  sourceFiles: gameFiles.length,
  matches,
  standings,
  teamLogoUrls: localTeamLogoUrls,
  teamLogoSourceUrls: remoteTeamLogoUrls,
  youtubeByTeam,
  coverage: {
    total: matches.length,
    withVideo: matches.filter(match => match.videoUrl).length,
    withViews: matches.filter(match => Number.isFinite(match.youtubeViews)).length,
    totalViews: matches.reduce((sum, match) => sum + (match.youtubeViews || 0), 0)
  }
};

fs.writeFileSync("league-data.js", `window.LEAGUE_DATA = ${JSON.stringify(payload, null, 2)};\n`);
console.log(JSON.stringify(payload.coverage));
