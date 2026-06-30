# Security-Header für den Liga-Hub installieren

Zielseite:

`https://knud-zabrocki.de/sparda-2-liga-pro-frauen-2025-26/`

## Installation

1. Im Hosting-Dateimanager das WordPress-Verzeichnis öffnen.
2. Zu `wp-content/` wechseln.
3. Falls noch nicht vorhanden, den Ordner `mu-plugins` anlegen.
4. `knud-security-headers.php` nach `wp-content/mu-plugins/` hochladen.
5. WordPress- und Hosting-Cache leeren.

MU-Plugins werden automatisch aktiviert und erscheinen unter **Plugins → Installierte Plugins → Must-Use**.

## Kontrolle

Nach Veröffentlichung im Terminal ausführen:

```sh
curl -I https://knud-zabrocki.de/sparda-2-liga-pro-frauen-2025-26/
```

Erwartete Header:

- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `permissions-policy: camera=(), microphone=(), geolocation=()`
- `x-frame-options: SAMEORIGIN`
- `strict-transport-security: max-age=31536000`
- `content-security-policy-report-only: …`

## CSP-Test

Die Browser-Entwicklerkonsole öffnen und die Hubseite vollständig testen. Meldungen mit
`Content Security Policy` notieren. Erst wenn keine legitimen Ressourcen mehr beanstandet
werden, kann im PHP-Code

```php
$headers['Content-Security-Policy-Report-Only']
```

durch

```php
$headers['Content-Security-Policy']
```

ersetzt werden. Danach erneut testen. Nicht ungeprüft global auf die gesamte WordPress-Seite anwenden.
