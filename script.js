const teams = [
  { name: "DSHS SnowTrex Köln", short: "DS", instagram: 2151, facebook: 2049, date: "30.05.2026", status: "online", url: "https://knud-zabrocki.de/dshs-snowtrex-2025-26/" },
  { name: "TV Waldgirmes", short: "TW", instagram: 2542, facebook: 846, date: "30.05.2026", url: "#tv-waldgirmes-2025-26" },
  { name: "BBSC Berlin", short: "BB", instagram: 4479, facebook: 1647, date: "11.06.2026", url: "#bbsc-berlin-2025-26" },
  { name: "BayerVolleys Leverkusen", short: "BL", instagram: 2697, facebook: 2538, date: "30.05.2026", url: "#bayervolleys-leverkusen-2025-26" },
  { name: "ESA Grimma Volleys", short: "EG", instagram: 3036, facebook: 2322, date: "30.05.2026", url: "#esa-grimma-volleys-2025-26" },
  { name: "VfL Oythe", short: "VO", instagram: 2027, facebook: 1310, date: "30.05.2026", url: "#vfl-oythe-2025-26" },
  { name: "Eintracht Spontent Düsseldorf", short: "ES", instagram: 4471, facebook: 113, date: "30.05.2026", url: "#eintracht-spontent-duesseldorf-2025-26" },
  { name: "Neuseenland-Volleys Markkleeberg", short: "NV", instagram: 2242, facebook: 741, date: "30.05.2026", url: "#neuseenland-volleys-markkleeberg-2025-26" },
  { name: "NawaRo Straubing", short: "NS", instagram: 4115, facebook: 4407, date: "30.05.2026", url: "#nawaro-straubing-2025-26" },
  { name: "Rote Raben Vilsbiburg", short: "RR", instagram: 2027, facebook: 5136, date: "30.05.2026", url: "#rote-raben-vilsbiburg-2025-26" },
  { name: "Sparkassen Wildcats Stralsund", short: "SW", instagram: 2697, facebook: 2456, date: "30.05.2026", url: "#sparkassen-wildcats-stralsund-2025-26" },
  { name: "TV Dingolfing", short: "TD", instagram: 3295, facebook: 1231, date: "11.06.2026", url: "#tv-dingolfing-2025-26" },
  { name: "TV Hörde", short: "TH", instagram: 1819, facebook: 1018, date: "11.06.2026", url: "#tv-hoerde-2025-26" },
  { name: "TV Planegg-Krailling", short: "TP", instagram: 2159, facebook: 889, date: "30.05.2026", url: "#tv-planegg-krailling-2025-26" },
  { name: "VCO Dresden", short: "VD", instagram: 3791, facebook: 1734, date: "30.05.2026", url: "#vco-dresden-2025-26" }
].map(team => ({ status: "planned", ...team }));

const formatter = new Intl.NumberFormat("de-DE");
const displayNumber = value => value == null ? "k. A." : formatter.format(value);
const leagueData = window.LEAGUE_DATA;
const standingsByTeam = new Map(leagueData.standings.map(row => [row.team, row]));
const percentFormatter = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const totalTeamYoutubeViews = Object.values(leagueData.youtubeByTeam).reduce((sum, team) => sum + team.views, 0);
const leagueYoutubeAverage = totalTeamYoutubeViews / teams.length;
const reachOrder = [...teams].sort((a, b) => (leagueData.youtubeByTeam[b.name]?.views || 0) - (leagueData.youtubeByTeam[a.name]?.views || 0));
const reachRankByTeam = new Map(reachOrder.map((team, index) => [team.name, index + 1]));
const maximumTeamViews = leagueData.youtubeByTeam[reachOrder[0].name].views;
teams.forEach(team => {
  const standing = standingsByTeam.get(team.name);
  const youtube = leagueData.youtubeByTeam[team.name] || { games: 0, views: 0 };
  Object.assign(team, {
    rank: standing?.rank ?? null,
    points: standing?.points ?? null,
    wins: standing?.wins ?? null,
    youtubeViews: youtube.views,
    youtubeGames: youtube.games,
    youtubeShare: totalTeamYoutubeViews ? youtube.views / totalTeamYoutubeViews * 100 : 0,
    youtubeAverage: youtube.games ? youtube.views / youtube.games : 0,
    reachIndex: leagueYoutubeAverage ? youtube.views / leagueYoutubeAverage * 100 : 0,
    reachRank: reachRankByTeam.get(team.name),
    barWidth: maximumTeamViews ? youtube.views / maximumTeamViews * 100 : 0
  });
});
const teamGrid = document.querySelector("#team-grid");
const comparisonBody = document.querySelector("#comparison-body");
let activeSort = "youtubeViews";

function sortedTeams() {
  return [...teams]
    .sort((a, b) => {
      if (activeSort === "name") return a.name.localeCompare(b.name, "de");
      if (activeSort === "rank") return (a.rank ?? 99) - (b.rank ?? 99);
      return (b[activeSort] ?? -1) - (a[activeSort] ?? -1) || a.name.localeCompare(b.name, "de");
    });
}

function renderCards() {
  teamGrid.innerHTML = sortedTeams().map(team => {
    const online = team.status === "online";
    const title = online ? "Dossier öffnen" : "Dossier in Vorbereitung";
    const highlightClass = team.reachRank === 1 ? "is-reach-leader" : team.name === "DSHS SnowTrex Köln" ? "is-home-team" : "";
    return `
      <article class="team-card reach-card ${highlightClass}">
        <div class="card-top"><span class="team-logo"><img src="${leagueData.teamLogoUrls[team.name]}" alt="Logo ${team.name}" loading="lazy" width="72" height="72" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="monogram" hidden aria-hidden="true">${team.short}</span></span><span class="reach-rank" aria-label="Reichweitenrang ${team.reachRank}">#${team.reachRank}</span></div>
        <h3>${team.name}</h3>
        <p class="standing-line">Tabelle ${team.rank}. · ${team.points} Punkte · ${team.wins} Siege</p>
        <div class="reach-primary"><span>Team-Aufrufe</span><strong>${formatter.format(team.youtubeViews)}</strong></div>
        <div class="reach-bar" role="img" aria-label="${percentFormatter.format(team.barWidth)} Prozent des Spitzenwerts"><i style="width:${team.barWidth.toFixed(2)}%"></i></div>
        <div class="card-stats reach-stats" aria-label="YouTube-Reichweitenkennzahlen">
          <span>Anteil Team-Aufrufe<strong>${percentFormatter.format(team.youtubeShare)} %</strong></span>
          <span>Ø je Beteiligung<strong>${formatter.format(Math.round(team.youtubeAverage))}</strong></span>
          <span>Reichweitenindex<strong>${Math.round(team.reachIndex)}</strong></span>
          <span>Spiele mit Wert<strong>${team.youtubeGames} / 28</strong></span>
        </div>
        <div class="platform-stats" aria-label="Social-Media-Follower">
          <span>Instagram<strong>${displayNumber(team.instagram)}</strong></span>
          <span>Facebook<strong>${displayNumber(team.facebook)}</strong></span>
        </div>
        <div class="dossier-summary">
          <span>${online ? "Dossier online" : "Dossier in Vorbereitung"}</span>
          <p>28 Spiele, Ergebnisse, Saisonverlauf, MVPs, Zuschauerzahlen und Videos.</p>
        </div>
        <a class="card-action" href="${team.url}" ${online ? "" : 'aria-disabled="true" data-placeholder="true"'}>
          <span>${title}</span><span aria-hidden="true">${online ? "↗" : "–"}</span>
        </a>
      </article>`;
  }).join("");
}

function renderReachSummary() {
  const leader = teams.find(team => team.reachRank === 1);
  document.querySelector("#reach-kpis").innerHTML = [
    [formatter.format(leagueData.coverage.totalViews), "eindeutige Spielaufrufe", "Jedes Spiel zählt einmal."],
    [formatter.format(totalTeamYoutubeViews), "Team-Aufrufe", "Jedes Spiel zählt für beide Teams."],
    [`${leagueData.coverage.withViews} / ${leagueData.coverage.total}`, "Spiele ausgewertet", "Ein YouTube-Wert fehlt."],
    [formatter.format(leader.youtubeViews), "Spitzenwert Düsseldorf", "Höchster teambezogener Saisonwert."]
  ].map(([value, label, text]) => `<article><strong>${value}</strong><h3>${label}</h3><p>${text}</p></article>`).join("");

  document.querySelector("#reach-highlight").innerHTML = `
    <div><p class="eyebrow">Reichweiten-Spitzenreiter</p><h3 id="highlight-title">Eintracht Spontent Düsseldorf</h3></div>
    <p>Eintracht Spontent Düsseldorf ist der klare Reichweiten-Ausreißer der Saison. Mit <strong>${formatter.format(leader.youtubeViews)} teambezogenen YouTube-Aufrufen</strong> erreicht Düsseldorf <strong>${percentFormatter.format(leader.youtubeShare)} %</strong> aller Team-Aufrufe und einen <strong>Reichweitenindex von ${Math.round(leader.reachIndex)}</strong>. Damit liegt der Aufsteiger etwa zweieinhalbmal so hoch wie der Ligadurchschnitt.</p>`;
}

function renderTable() {
  comparisonBody.innerHTML = leagueData.standings.map(row => {
    const youtube = leagueData.youtubeByTeam[row.team] || { games: 0, views: 0 };
    return `
    <tr>
      <td><strong>${row.rank}. ${row.team}</strong></td>
      <td>${row.played}</td><td>${row.wins}</td><td>${row.played - row.wins}</td>
      <td><strong>${row.points}</strong></td><td>${row.sets}</td>
      <td>${youtube.games}/28</td><td>${formatter.format(youtube.views)}</td>
    </tr>`;
  }).join("");
}

function renderCoverage() {
  const coverage = leagueData.coverage;
  document.querySelector("#coverage-grid").innerHTML = [
    [coverage.total, "Ligaspiele"],
    [coverage.withVideo, "Videos verlinkt"],
    [coverage.withViews, "Abrufzahlen vorhanden"],
    [formatter.format(coverage.totalViews), "eindeutige Aufrufe"]
  ].map(([value, label]) => `<div class="coverage-item"><strong>${value}</strong><span>${label}</span></div>`).join("");
}

function renderCrossTable() {
  const names = leagueData.standings.map(row => row.team);
  const matchMap = new Map(leagueData.matches.map(match => [`${match.home}|${match.away}`, match]));
  const head = `<thead><tr><th>Heim ↓ / Auswärts →</th>${names.map(name => `<th><span>${name}</span></th>`).join("")}</tr></thead>`;
  const body = names.map(home => `<tr><th scope="row">${home}</th>${names.map(away => {
    if (home === away) return `<td class="self-cell">–</td>`;
    const match = matchMap.get(`${home}|${away}`);
    if (!match) return `<td class="missing-cell">fehlt</td>`;
    const views = Number.isFinite(match.youtubeViews) ? formatter.format(match.youtubeViews) : "k. A.";
    return `<td class="${Number.isFinite(match.youtubeViews) ? "" : "missing-cell"}"><strong>${match.score}</strong><small>${views} Aufr.</small></td>`;
  }).join("")}</tr>`).join("");
  document.querySelector("#cross-table").innerHTML = head + `<tbody>${body}</tbody>`;
}

function renderMatches(filter = "all") {
  const matches = leagueData.matches.filter(match => filter === "all" || match.home === filter || match.away === filter);
  document.querySelector("#matches-body").innerHTML = matches.map(match => `
    <tr>
      <td>${match.number}</td><td>${match.date}</td>
      <td><strong>${match.home}</strong><br>${match.away}</td><td><strong>${match.score}</strong></td>
      <td>${displayNumber(match.spectators)}</td>
      <td class="${Number.isFinite(match.youtubeViews) ? "" : "missing-value"}">${Number.isFinite(match.youtubeViews) ? formatter.format(match.youtubeViews) : "nicht verfügbar"}</td>
      <td>${match.videoUrl ? `<a class="video-link" href="${match.videoUrl}" target="_blank" rel="noopener">YouTube ↗</a>` : `<span class="missing-value">kein Video</span>`}</td>
    </tr>`).join("");
  document.querySelector("#matches-note").textContent = `${matches.length} Spiele angezeigt · Abrufzahlen laut lokal dokumentiertem Stand 23.–29. Juni 2026.`;
}

function setupMatchFilter() {
  const select = document.querySelector("#match-team-filter");
  select.insertAdjacentHTML("beforeend", leagueData.standings.map(row => `<option value="${row.team}">${row.team}</option>`).join(""));
  select.addEventListener("change", event => renderMatches(event.target.value));
}

document.querySelector("#sort-teams").addEventListener("change", event => {
  activeSort = event.target.value;
  renderCards();
});

document.addEventListener("click", event => {
  const placeholder = event.target.closest("[data-placeholder]");
  if (placeholder) event.preventDefault();
});

renderReachSummary();
renderCards();
renderTable();
renderCoverage();
renderCrossTable();
renderMatches();
setupMatchFilter();
