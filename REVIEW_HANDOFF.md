# christoph-zink.de — Review-Handoff

**Stand:** 15.10.2026 · Review-Korrekturrunde nach dem ersten Draft

**Status:** Bereit für externe Designprüfung. **Keine Veröffentlichungsfreigabe. Kein Deployment.**

## Umfang dieser Runde

- Kontaktabschnitt, Kontakttext und deaktivierter Button entfernt. „Kontakt“ aus der gemeinsamen Hauptnavigation entfernt, auch auf den Rechtsseiten.
- Neuer ruhiger Abschluss mit ausschließlich **STAY CURIOUS.**, einer feinen Horizontlinie, einem zurückhaltenden Lichtpunkt und einer angeschnittenen Orbitlinie. Keine Kontaktaufforderung, kein Link und kein Button im Abschluss.
- Mobile Hero-Typografie präzisiert; drei Zeilen, englischer Wortlaut, Sans-Serif, freigegebene Palette und linke Textausrichtung erhalten.
- Drei Themen-Artworks überarbeitet, das bereits eigenständige Wellenmotiv für FREQUENCIES. beibehalten. Die vier Titel, Untertitel und deutschen Beschreibungen sind unverändert.
- Prüfskripte auf die entfernte Kontaktoberfläche und den neuen Abschluss umgestellt. Screenshots und Browserbericht dauerhaft im Repository abgelegt.

Der Kontaktabschnitt in `CREATIVE_BRIEF.md` beschreibt den ursprünglichen Stand. Die spätere ausdrückliche Review-Anweisung ersetzt diesen Teil. Der Brief und die freigegebenen Referenzbilder wurden nicht verändert.

## Abgleich mit der freigegebenen Hero-Referenz

Vergleichsgrundlage: [02_hero_approved.png](references/02_hero_approved.png).

| Aspekt | Ergebnis / Entscheidung |
| --- | --- |
| Komposition | Text links, atmosphärische Licht-/Partikelgrafik rechts, drei Headline-Zeilen und beide Entdecken-/Über-mich-Links erhalten. Desktop-Hero-Geometrie unverändert. |
| Typografie | Lokal gehostete Manrope, keine Serifenschrift. Die Referenz bleibt maßgeblich für die breite, leichte Sans-Serif-Richtung. |
| Mobile | Horizontale Dehnung von 1,25 auf 1,12 reduziert; Schriftgröße, Laufweite und Zeilenhöhe angepasst. Micro-Label, Themenzeile und primärer Link etwas größer. Bei 390 px bleibt „AND NOISE.“ in einer Zeile; alle drei Zeilen passen auch bei 320 px in den Inhaltsbereich. |
| Farbe | Graphit, Off-White und Amber erhalten. Keine neue Farbwelt eingeführt. |
| Bildatmosphäre | Bestehende eigene SVG-Studie erhalten. Sie ist eine textfreie Annäherung und erreicht nicht die fotografische Feinheit/Tiefe des Referenzbildes. Ein späteres finales Artwork bleibt ein offener Designpunkt. |
| Navigation | Nur reale Sprungziele. Der vom Auftrag gestrichene Kontaktpunkt ist auch gegenüber der Referenz bewusst entfernt. |

## Differenzierung der Themenkarten

| Themenwelt | Visuelles Motiv |
| --- | --- |
| SYSTEMS. | Drei geordnete, miteinander verbundene Raumkörper. Ruhige Geometrie und eine durchgehende Amber-Verbindung statt eines allgemeinen Punktnetzes. |
| LAB. | Organisches Partikelfeld mit unterbrochenen Messkreisen. Offener, experimenteller Charakter. |
| FREQUENCIES. | Fließende, überlagerte Wellenlinien. Das bereits passende Motiv bleibt unverändert. |
| PERSPECTIVES. | Versetzte Horizont- und Landschaftsebenen mit dezentem Lichtkreis. Räumliche Tiefe statt einer weiteren vertikalen Lichtschwelle. |

Kartengröße, Textaufbau und Palette bleiben gemeinsam. Die Unterscheidung entsteht aus den Motiven; sie hängt nicht allein von Farbe ab. Die Karten sind redaktionelle Inhalte ohne fingierte Detailseiten oder Klickaufforderungen.

## Screenshots für die externe Designabnahme

Alle PNGs zeigen den tatsächlich gebauten HTML/CSS-Stand. Keine nachträgliche Bildretusche. Die verwendete lokale Schrift und alle Bilder waren vor den Aufnahmen geladen. Die vollständigen Seiten zeigen auch Footer und Entwurfskennzeichnung.

| Datei | Abmessungen | Verwendung |
| --- | --- | --- |
| [Desktop, vollständige Seite](review/2026-10-15/homepage-desktop-1440.png) | 1440 × 3989 px | Gesamtrhythmus und Abschluss |
| [Mobile, vollständige Seite](review/2026-10-15/homepage-mobile-390.png) | 390 × 6026 px | Mobile Abfolge, Texte und Abstände |
| [Desktop-Hero](review/2026-10-15/hero-desktop-1440.png) | 1440 × 900 px | Vergleich mit freigegebener Hero-Referenz |
| [Mobile-Hero](review/2026-10-15/hero-mobile-390.png) | 390 × 844 px | Schriftproportionen und Lesbarkeit |
| [Themenkarten auf Desktop](review/2026-10-15/topics-desktop-1440.png) | 1440 × 881 px | Motivdifferenzierung und Zusammengehörigkeit |

Aufnahmeumgebung: **Microsoft Edge 155.0.4283.45**, Windows, Device Scale Factor 1, `prefers-reduced-motion: reduce`. Desktop-Viewport 1440 × 900, Mobile-Viewport 390 × 844. Mobile ist eine Browseransicht in entsprechender Größe, keine Realgeräteaufnahme.

[Maschinenbericht einschließlich SHA-256-Prüfsummen](review/2026-10-15/browser-report.json). Die Dateien befinden sich bewusst außerhalb von `public/`; sie werden nicht mit der Website ausgeliefert. Der Review-Ordner kann zusammen mit diesem Dokument an die prüfende Person weitergegeben werden; die PNGs sind ohne Entwicklungsumgebung lesbar. Es wurden keine Nachrichten an externe Personen versendet.

Bitte bei der externen Designprüfung besonders beurteilen:

1. Trifft die mobile Hero-Typografie die breite, ruhige Sans-Serif-Wirkung der Referenz bei guter Lesbarkeit?
2. Sind SYSTEMS., LAB., FREQUENCIES. und PERSPECTIVES. als unterschiedliche Welten erkennbar und dennoch zusammengehörig?
3. Wirkt der Abschluss mit „STAY CURIOUS.“ angemessen ruhig, einschließlich der Freiflächen vor dem Footer?
4. Ist die vorläufige SVG-Atmosphäre für diesen Draft akzeptabel, oder soll als nächster Schritt ein finales textfreies Artwork entwickelt werden?

**Externe Designabnahme: offen.** Diese Unterlagen dokumentieren den Prüfstand, keine vorweggenommene Freigabe.

## Testergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| `pnpm check` | Erfolgreich: 20 Dateien, 0 Fehler, 0 Warnungen, 0 Hinweise |
| `pnpm lint` | Erfolgreich |
| `pnpm build` | Erfolgreich: vier statische HTML-Seiten, 23 Ausgabedateien |
| `pnpm check:links` | Erfolgreich: 63 lokale Link-/Asset-Verweise, eindeutige IDs und vorhandene Sprungziele |
| Wortlaut | Hero-Intro, Headline, Über-mich-Absätze und alle vier Themenbeschreibungen gegen den Brief geprüft |
| Kontaktentfernung | Kein Kontaktanker, kein Kontaktpunkt in der Navigation, kein `mailto:` und kein Button auf der Startseite; Abschluss ohne CTA |
| `pnpm check:browser` | Erfolgreich bei 320, 390, 430, 720, 768, 1024 und 1440 px |
| Hero-Reflow | Genau drei unbeschnittene Headline-Zeilen innerhalb des Inhaltsbereichs auf allen sieben Breiten |
| Layout | Keine horizontalen Seitenüberläufe oder seitlich abgeschnittenen Überschriften im geprüften Umfang |
| Bedienung | Alle vier Navigationsziele, Tastatur-Skip-Link und primärer Hero-Link ohne JavaScript erfolgreich geprüft |
| Reduced Motion | Weiches Scrollen bei reduzierter Bewegung deaktiviert |
| Netzwerk / Browser | Keine Drittanbieteranfragen, fehlgeschlagenen Ressourcen oder JavaScript-Laufzeitfehler in den geprüften Startseitenansichten |
| axe | Keine gemeldeten Verstöße gegen die geprüften WCAG-A/AA- und Best-Practice-Regeln auf sieben Startseitenansichten sowie Impressum, Datenschutz und 404 |
| Visuelle Kontrolle | Vollständige Desktop-/Mobile-Screenshots, Mobile-Hero und Themenkarten angesehen und mit dem Referenzbild abgeglichen |
| `pnpm check:release` | **Erwartet gesperrt, Exit 1:** offene Rechts-/Hostingangaben, fehlende Veröffentlichungsfreigabe und gesperrte Indexierung |

Die Node-Hilfsfunktion zum Lesen der TypeScript-Konfiguration kann einen `ExperimentalWarning` ausgeben. Die Prüfungen wurden dadurch nicht beeinträchtigt.

## Reproduktion

Im Projektordner mit Node 24 und pnpm 11:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm lint
pnpm build
pnpm check:links
pnpm preview --port 4321
```

In einem zweiten Terminal bei laufendem Preview:

```sh
pnpm check:browser
pnpm check:release
```

Der letzte Befehl muss im aktuellen Entwurfsstand fehlschlagen. Der Browsercheck schreibt die Review-Screenshots und den Bericht erneut. Die [README](README.md) enthält den vollständigen PowerShell-Aufruf für die in dieser Umgebung vorhandene pnpm-Installation.

## Bekannte Einschränkungen und offene Release-Punkte

- Die SVG-Grafiken sind eigene, vorläufige Studien. Externe Designabnahme und etwaiger Ersatz durch freigegebene finale Artworks stehen aus.
- Kein vollständiges manuelles WCAG-Audit, kein Screenreader-Test, keine Realgeräteprüfung sowie keine Safari-/Firefox-Prüfung. Automatische axe-Ergebnisse ersetzen diese Prüfungen nicht.
- Keine Performance-Messung auf gedrosselter Mobilverbindung; Kompression und Cache-Header hängen vom später gewählten Hosting ab.
- „Selected Signals“ bleibt als Konzept gekennzeichnet. Tatsächliche Projektinhalte und verifizierte Ziele sind weiterhin offen.
- **Impressum:** bestätigte verantwortliche Person, vollständige Anschrift, Impressums-E-Mail und weitere tatsächlich erforderliche Angaben fehlen. Nichts wurde erfunden.
- **Datenschutz:** Hosting-Anbieter/-Standort, tatsächlicher Umgang mit Serverprotokollen und geprüfte Datenschutzerklärung fehlen.
- Die rechtlichen Seiten sind ausdrücklich nicht veröffentlichungsfähige Arbeitsstände. Ihre Entwurfskennzeichnung darf erst nach inhaltlicher Prüfung überarbeitet werden.
- `indexable: false` und `publicationApproved: false` bleiben gesetzt. `noindex, nofollow`, gesperrte `robots.txt` und leere Sitemap bleiben aktiv. Diese Einstellungen sind keine Zugangskontrolle.
- OG-Vorschaubild und ausdrückliches Veröffentlichungs-OK bleiben offen.

**Release-Entscheidung: NICHT FREIGEGEBEN.** Commit und GitHub-Push dienen der Versionsverwaltung und Review-Bereitstellung. Es wird kein Deployment ausgeführt und keine Hosting-Konfiguration eingerichtet.
