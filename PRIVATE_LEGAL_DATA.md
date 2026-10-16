# Private rechtliche Angaben – christoph-zink.de

**Keine persönlichen Kontaktdaten in GitHub.** Die Website ist eine statische Astro-Seite. Beim Build werden die Angaben aus der Prozessumgebung in die HTML-Ausgabe geschrieben. Das öffentliche Repository enthält ausschließlich die Variablennamen und die Vorlagen.

## Einmalig für den späteren Veröffentlichungs-Build vorbereiten

1. `.env.example` lokal nach `.env.private` kopieren. `.env.private` ist durch `.gitignore` vom Commit ausgeschlossen.
2. Die erforderlichen Werte **nur in dieser lokalen Datei oder in einer geschützten Build-Umgebung** eintragen – niemals in Quellcode, Commit-Nachrichten, GitHub-Issues oder Review-Screenshots.
3. Die tatsächliche Host-Europe-Produktvariante und die zugehörige Protokollaufbewahrung anhand des Vertrags prüfen. `CMZ_SERVER_LOG_POLICY` erst nach dieser Prüfung ausfüllen.
4. Den späteren Build mit der privaten Umgebung starten (Node.js 24 bzw. >= 22.18):

```powershell
Copy-Item .env.example .env.private  # einmalig, dann privat editieren
node --env-file=.env.private ./node_modules/astro/astro.js build
```

Die Umgebungsvariablen können alternativ direkt im privaten Build-Prozess gesetzt werden. **Die `.env.private`-Datei gehört niemals auf den Webserver oder ins Git-Repository.** Astro überträgt bei diesem statischen Deployment nur die fertig erzeugten Dateien aus `dist/`.

## Pflichtvariablen

| Variable | Inhalt |
| --- | --- |
| `CMZ_LEGAL_NAME` | Name der verantwortlichen Person |
| `CMZ_LEGAL_STREET` | Straße und Hausnummer |
| `CMZ_LEGAL_CITY` | Postleitzahl und Ort |
| `CMZ_LEGAL_EMAIL` | E-Mail-Adresse für das Impressum |
| `CMZ_SERVER_LOG_POLICY` | Bestätigte Produktvariante, Arten und Aufbewahrungszeiten von Serverlogs |

`CMZ_LEGAL_EXTRA` und `CMZ_PRIVACY_ADDITIONAL` sind optionale Ergänzungen **nach rechtlicher Prüfung**, keine Pflichtfelder der technischen Konfiguration.

## Vor Veröffentlichung

- `node --env-file=.env.private scripts/check-release.mjs` zeigt **nur fehlende Feldnamen**, keine eingegebenen Werte. Die Sperre schlägt zunächst erwartungsgemäß fehl, weil Rechtsprüfung, Indexierung und Veröffentlichungsfreigabe weiterhin auf `false` stehen.
- Impressum und Datenschutzerklärung sind noch **Entwürfe**. Der bereits veröffentlichte Entwurfsstand wird durch einen Git-Push nicht aktualisiert.
- Erst nach tatsächlicher rechtlicher Prüfung und ausdrücklicher Freigabe sind die Entwurfskennzeichnung, Release-Schalter und der noindex-Header in `public/.htaccess` separat anzupassen. Keine automatische Freigabe.
- Im veröffentlichten HTML sind Impressumsanschrift und Impressums-E-Mail **öffentlich lesbar** – das ist der Zweck der Anbieterkennzeichnung. Nur die **Quellcodehistorie** enthält sie nicht.
- Falls ein Build mit echten Werten versehentlich in andere Systeme oder GitHub hochgeladen wird, kann ein späteres Löschen aus Git die Veröffentlichung nicht zuverlässig rückgängig machen.

**Sicherheitskontrolle:** `.gitignore` schließt `.env`, `.env.*` (außer der leeren Vorlage) und `dist/` aus; keine personenbezogenen Werte sind in diesem Dokument gespeichert.
