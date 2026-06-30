import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile("league-data.js", "utf8");
const context = { window: {} };
vm.runInNewContext(source, context, { filename: "league-data.js" });
const { teamLogoUrls, teamLogoSourceUrls } = context.window.LEAGUE_DATA;

await fs.mkdir("assets/logos", { recursive: true });

for (const [team, url] of Object.entries(teamLogoSourceUrls)) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${team}: HTTP ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) throw new Error(`${team}: unerwarteter Inhaltstyp ${contentType}`);
  const target = teamLogoUrls[team];
  await fs.writeFile(target, Buffer.from(await response.arrayBuffer()));
  console.log(`${team} -> ${target}`);
}
