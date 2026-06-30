# Sparda 2. Liga Pro Frauen 2025/26 – Hub

Responsive Saison- und Datenübersicht für die 15 Teams der Sparda 2. Liga Pro Frauen 2025/26.

## Inhalte

- Teamkarten mit sportlicher Abschlussbilanz
- Instagram- und Facebook-Follower
- YouTube-Reichweitenanalyse aus 209 von 210 Saisonspielen
- Abschlusstabelle und Ergebnis-Kreuztabelle
- Liste aller verfügbaren Spielvideos und Aufrufzahlen
- vorbereitete Verlinkung der Team-Dossiers

## Dateien

- `index.html` – Seitenstruktur
- `styles.css` – responsives Design
- `script.js` – Karten, Sortierung und Auswertungslogik
- `league-data.js` – zentrale Spiel-, Tabellen-, Logo- und YouTube-Daten
- `assets/fonts/` – lokal eingebundene Schriftdateien und OFL-Lizenzen
- `assets/logos/` – lokal ausgelieferte, weboptimierte Vereinslogos; Ursprungslinks stehen in `league-data.js`

Für eine lokale Vorschau genügt ein einfacher statischer Webserver, beispielsweise:

```sh
python3 -m http.server 4173
```

Anschließend ist die Seite unter `http://127.0.0.1:4173/` erreichbar.
