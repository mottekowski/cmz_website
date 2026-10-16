# Christoph Zink — Between Signal and Noise.

Öffentlicher Entwurf mit Review-Korrekturen vom 15.10.2026. Der Inhaber hat den Upload trotz offener Rechtsangaben ausdrücklich freigegeben. **Keine finale Produktionsfreigabe.** Live-Adresse, Backup und Upload-Verfahren: [DEPLOYMENT.md](DEPLOYMENT.md). Design-Abnahmeunterlagen: [REVIEW_HANDOFF.md](REVIEW_HANDOFF.md).

## Bestandsaufnahme und Umsetzung

Der Ausgangsordner enthielt ausschließlich `CREATIVE_BRIEF.md`, `CODEX_START_PROMPT.txt` und die drei Designreferenzen. Es gab keine vorhandene Anwendung, Build-Konfiguration oder Git-Historie. Die Originaldateien sind unverändert.

Die Website nutzt **Astro 7, TypeScript im Strict-Modus und eigenes CSS**. Astro erzeugt statische HTML-Seiten ohne Client-JavaScript. Es gibt keine UI-Library, keinen Backend-Dienst und keine externen Laufzeitdienste. Inhalte, Konfiguration, Komponenten und Gestaltung sind getrennt. `pnpm-lock.yaml` hält die verwendeten Abhängigkeiten fest; `.gitignore` schließt Build-Ausgaben und lokale Prüfartefakte aus.

Orientierung: [Astro / TypeScript](https://docs.astro.build/en/guides/typescript/), [Astro / statischer Build](https://docs.astro.build/en/guides/deploy/).

## Lokal starten

Voraussetzung: Node.js **22.18 oder neuer**, empfohlen Node 24 LTS; pnpm 11. Getestet mit Node 24.19.0 und pnpm 11.25.0. Alle Befehle im Projektordner ausführen.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Entwicklungsansicht: **http://127.0.0.1:4321/**. Änderungen werden automatisch übernommen. Der Server bindet nur an die lokale Loopback-Adresse. Beenden mit `Strg+C`.

In der verwendeten Codex-PowerShell war `npm` nicht im PATH. Die vorhandene pnpm-Version kann dort ohne zusätzliche Installation so gestartet werden:

```powershell
$pnpmExe = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd'
& $pnpmExe install --frozen-lockfile
& $pnpmExe dev
```

Die weiteren `pnpm …`-Befehle können entsprechend als `& $pnpmExe …` aufgerufen werden.

## Build und Kontrolle

```sh
pnpm check
pnpm lint
pnpm build
pnpm check:links
pnpm preview --port 4321
```

Der Build liegt in `dist/`. `preview` zeigt genau diesen Build, aktualisiert ihn aber nicht selbst. Nach Quelländerungen erneut bauen; alternativ `dev` für die laufende Arbeit verwenden. Der FTPS-Upload erfolgt separat über `scripts/deploy-filezilla.py`, siehe [DEPLOYMENT.md](DEPLOYMENT.md); ein Build veröffentlicht nichts automatisch.

Bei laufendem Preview in einem zweiten Terminal:

```sh
pnpm check:browser
```

Der Browsercheck nutzt unter Windows das installierte Microsoft Edge, auf anderen Systemen Playwright Chromium. Bei Bedarf dort einmal `pnpm exec playwright install chromium` ausführen. `BROWSER_CHANNEL` und `PREVIEW_URL` sind optionale Umgebungsvariablen. Prüfartefakte entstehen unter `.qa/` (nicht versioniert); die vollständigen Desktop-/Mobile-Screenshots, Hero-Details, Themenübersicht und der Browserbericht für die externe Abnahme unter `review/2026-10-15/` werden mitversioniert. Alle Bilder werden vor der Aufnahme vollständig geladen. Die Review-Dateien liegen außerhalb von `public/` und werden nicht als Website ausgeliefert.

Prüfumfang: 320/390/430/720/768/1024/1440 px, Überläufe und abgeschnittene Überschriften, drei unbeschnittene Hero-Zeilen, Sprungnavigation, Tastatur-Skip-Link, reduzierte Bewegung, vollständiges Entfernen der Kontaktoberfläche, fehlende/externe Ressourcen, Browserfehler, Nutzung ohne JavaScript, Rechtsseiten und axe-Regeln für WCAG A/AA sowie Best Practices. `check:links` prüft erzeugte Seiten, lokale Ressourcen, Anker, doppelte IDs, vier Inhaltsabschnitte mit ruhigem Abschluss sowie freigegebene Hero-/Über-mich-/Thementexte gegen den Brief.

```sh
pnpm check:release
```

**Dieser Check muss im aktuellen Draft fehlschlagen.** Er listet die noch fehlenden Angaben und Freigaben auf. Er veröffentlicht nichts. Ein erfolgreicher statischer Build ist keine Veröffentlichungsfreigabe. Die Skripte lesen die TypeScript-Konfiguration mit Nodes `stripTypeScriptTypes`; Node 24 kann dazu einen experimentellen API-Hinweis ausgeben.

## Dateien und Inhalte

| Datei / Ordner | Zweck |
| --- | --- |
| `src/pages/index.astro` | Fünf Abschnitte, semantisches HTML |
| `src/data/content.ts` | Wortgetreue Brieftexte, Themen und redaktionelle Konzepte |
| `src/config/site.ts` | Offene Rechtsangaben einschließlich Impressums-E-Mail, Indexierung und Hero-/About-Assets |
| `src/styles/global.css` | Farb- und Schriftvariablen, Layout, Breakpoints, Fokus, Reduced Motion |
| `src/components/` | Header, Footer, Abschnittsüberschriften |
| `src/layouts/Layout.astro` | Dokument, lokale Schrift, SEO-Metadaten |
| `public/art/` | Neun eigene, textfreie SVG-Studien |
| `scripts/generate-art.mjs` | Deterministischer Generator der SVG-Studien |
| `scripts/check-*.mjs` | Build-, Browser- und Freigabeprüfungen |
| `licenses/Manrope-OFL.txt` | Schriftlizenz, zusätzlich unter `public/licenses/` im Build enthalten |

Die Seite umfasst Hero, Über mich, Themenwelten und Selected Signals, gefolgt von einem ruhigen Abschluss mit „STAY CURIOUS.“. Gemäß Review-Auftrag ersetzt dieser den Kontaktabschnitt aus dem ursprünglichen Brief. Es gibt weder Kontaktbutton noch Kontakt-Navigationspunkt. Der zusätzliche Navigationspunkt „Gedanken“ aus dem Referenzbild wurde nicht als leerer Zielbereich angelegt; die Navigation führt ausschließlich zu vorhandenen Abschnitten. „Impulse“ bezeichnet die drei redaktionellen Konzepte. Der ursprüngliche Brief bleibt als historische Designgrundlage unverändert; die dokumentierte Review-Anweisung hat beim Abschluss Vorrang.

## Gestaltung und spätere Artwork-Ersetzung

Referenzpriorität: `02_hero_approved.png` für Hero-Aufbau und Sans-Serif-Richtung, `01_moodboard_burnt_amber.png` für Farbe und Stimmung, `03_homepage_first_draft.png` für Abschnittsrhythmus. Die abweichende Serifenschrift des Ganzseitenentwurfs wurde nicht übernommen.

Die Gestaltung rekonstruiert linksbündige, breite Hero-Typografie, drei Zeilen, warmen Akzent, graphitfarbenen Raum und eine abstrakte Partikel-/Orbitkomposition rechts. Manrope ist lokal eingebunden und unter OFL-1.1 lizenziert. Unterhalb des Hero wechseln lesbare Textflächen, eine architektonische Lichtstudie und eigenständige Themenbilder. Es gibt keine Porträts und keine Stockbilder.

**Die SVGs sind bewusst vorläufige Originalstudien**, keine freigegebenen finalen Bildassets. Sie enthalten keine eingebrannten Website-Texte. Die Referenz-PNGs bleiben außerhalb von `public/` und gelangen nicht in den Build.

Zum späteren Austausch:

1. Freigegebene, textfreie Assets lokal unter `public/art/` ablegen, bevorzugt optimiertes AVIF/WebP mit geeigneten Größen.
2. Hero/About-Pfade in `src/config/site.ts`, Themen-/Signal-Pfade in `src/data/content.ts` ersetzen. Intrinsische Maße und Ausschnitte in den Komponenten bei Bedarf anpassen.
3. Hero-Kontrast und mobile Darstellung erneut prüfen. Dekorative Bilder behalten leeres `alt`; informative Bilder benötigen passende Alternativtexte.
4. Für Änderungen an den SVG-Studien `node scripts/generate-art.mjs` ausführen. Alle neun Dateien werden reproduzierbar neu erzeugt.

## Offene Angaben vor einer Veröffentlichung

Weitere Hinweise zu privaten Betreiber- und Hostingdaten: [PRIVATE_LEGAL_DATA.md](PRIVATE_LEGAL_DATA.md).

Name, Straße/Hausnummer, Postleitzahl/Ort und E-Mail werden beim Build aus der lokal ignorierten `.env.private` gelesen (`CMZ_LEGAL_NAME`, `CMZ_LEGAL_STREET`, `CMZ_LEGAL_CITY`, `CMZ_LEGAL_EMAIL`). Die Datei niemals committen oder auf den Webserver kopieren. Die angegebenen Werte erscheinen bestimmungsgemäß im öffentlichen Impressum. Nach Änderungen neu bauen; Browserberichte mit persönlichen Angaben ausschließlich unter `.qa/` ablegen.

Ohne diese Konfiguration sowie für weiterhin offene Angaben verwendet `src/config/site.ts` absichtlich `null` statt erfundener Daten:

- Vom Inhaber bestätigte E-Mail für das Impressum. Es gibt keinen Kontakt-CTA auf der Startseite.
- Verantwortliche Person, vollständige Anschrift, Land und gegebenenfalls weitere erforderliche Impressumsangaben. Nicht zutreffende Punkte erst nach Prüfung entsprechend dokumentieren.
- Tatsächlicher Hosting-Anbieter/-Standort und Umgang mit Serverprotokollen.
- Vollständige, für die tatsächliche Verarbeitung geprüfte Datenschutzerklärung.
- Prüfung von Impressum und Datenschutz sowie ausdrückliches Veröffentlichungs-OK.

Die vorhandenen Rechtsseiten sind sichtbar markierte Arbeitsstände und **keine fertigen Rechtstexte**. Nach Ergänzung der Angaben müssen auch die Entwurfskennzeichnung und Darstellung der Rechtsseiten bewusst überarbeitet werden. Kein Automatismus versteckt offene Angaben.

`indexable: false` setzt `noindex, nofollow`, `robots.txt` sperrt Crawling, die Sitemap ist leer. Die Canonicals und OG-Titel/-Beschreibung sind bereits für `https://www.christoph-zink.de` vorbereitet. Ein OG-Vorschaubild bleibt bis zur Auswahl eines geeigneten finalen Assets offen. Erst nach Prüfung und Freigabe die Indexierung aktivieren; dann enthält die Sitemap die Startseite. Rechtsseiten bleiben standardmäßig `noindex`.

Die Indexierungssperre ist keine Zugangskontrolle. Der Entwurf ist aufgrund der späteren ausdrücklichen Entscheidung des Inhabers öffentlich erreichbar; die offenen Rechtsangaben und Entwurfskennzeichnungen bleiben erhalten. Zusätzlich sendet Apache über `public/.htaccess` einen `X-Robots-Tag` gegen Indexierung. Eine spätere Indexierungsfreigabe erfordert auch die Anpassung dieses Headers.

## Datenschutz, Barrierearmut und Performance

- Keine automatischen externen Font-, Medien-, Tracking- oder Embed-Anfragen; keine Cookies und kein Local Storage durch Anwendungscode.
- Manrope wird aus einer lokalen WOFF2-Datei je benötigtem Zeichensatz geladen; keine Google-Fonts-Verbindung.
- Semantische Landmarken, deutsche Dokumentsprache, englische Überschriften ausgezeichnet, logische H1/H2/H3-Struktur und dekorative Bilder ohne Screenreader-Text.
- Skip-Link, sichtbarer Tastaturfokus, direkt erreichbare mobile Navigation ohne JavaScript-Menü.
- `prefers-reduced-motion` schaltet weiches Scrollen und CSS-Transitions aus. Keine dauerhafte Animation, kein Parallax und kein Scroll-Jacking.
- Hero priorisiert, Bilder unterhalb des Hero lazy geladen, feste Bildabmessungen; statische SVG-Grafiken und kein Client-JavaScript.

## Verifikation dieser Iteration

Aktuelle Testergebnisse, Screenshot-Abmessungen, bekannte Einschränkungen und offene Freigabepunkte sind in [REVIEW_HANDOFF.md](REVIEW_HANDOFF.md) festgehalten. Die Maschinenresultate und Screenshot-Prüfsummen liegen in [review/2026-10-15/browser-report.json](review/2026-10-15/browser-report.json).

Der vollständige Build umfasst ungefähr 570 KiB unkomprimiert inklusive sämtlicher Grafiken, Seiten und ausgelieferter Font-Subsets. Das ist keine Messung der initial übertragenen Datenmenge. Die Startseite liefert kein JavaScript aus. Gzip/Brotli und Cache-Header sind später passend zum gewählten Hosting einzurichten.

Grenzen: kein vollständiges manuelles WCAG-Audit, kein Screenreader-/Safari-/Firefox-/Realgeräte-Test und keine Messung auf gedrosselter Mobilverbindung. Keine rechtliche oder finale Produktionsfreigabe. Der gesondert autorisierte Entwurfs-Upload ist in [DEPLOYMENT.md](DEPLOYMENT.md) dokumentiert.
