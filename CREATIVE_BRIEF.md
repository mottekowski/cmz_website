# christoph-zink.de — Creative & Implementation Brief v1.0

**Project status:** Start design implementation with Codex; text/copy and sections are working drafts unless marked approved.
**Concept:** QUIET VOLTAGE / ATMOSPHERIC ABSTRACT
**Brand:** Christoph Zink — personal digital space, professional expertise and creativity without artificial separation.
**Main statement:** BETWEEN SIGNAL AND NOISE.
**Date:** 2026-10-15

## 1. Goal
Build a distinctive, thoughtful, fast, accessible personal website that shows the way Christoph thinks, explores, and creates. Not a conventional CV, not a consultant sales pitch, not a generic agency portfolio, not a tech-themed visual overload.

## 2. Approved creative decisions — DO NOT silently change
- Dramaturgy: calm, dark and atmospheric with controlled energy.
- Design family: Quiet Voltage, Atmospheric Abstract, Editorial Minimalism, Warm Industrial.
- Palette: Graphite `#0B0C0D`, Charcoal `#1E1F21`, muted gray `#686672`, Off-White `#E8E8E4`, Burnt Amber `#D97706` (secondary lighter amber when necessary for contrast).
- Typography: strong, clean, modern **sans serif** for the hero/headings, legible neutral sans for body. A subsequent full-page image draft accidentally used serif headings: **do not copy that typographic change**. Hero visual reference is authoritative.
- Language: English headlines, German body copy and German navigation/legal pages.
- Voice: thoughtful, unpretentious, personal, non-promotional. **Never begin German sentences with “Ich”.** Avoid title-centric phrases such as “Als IT-Architekt”, “visionärer Experte”, etc.
- **No portrait photography**. No fake people / AI avatars. Personality through ideas, selected work, actual interests.
- **Do not include or reference Schnittvisite** on this personal site.
- Avoid unverified stock/web image usage. Provided images are AI-generated design references, not general licensed stock imagery.

## 3. Image references and priorities
Files in `/references/`:
1. `01_moodboard_burnt_amber.png` — color and mood direction.
2. `02_hero_approved.png` — **approved hero composition and typographic direction**, primary design reference.
3. `03_homepage_first_draft.png` — **inspiration for section order and overall page rhythm**, *not* authority for typography or exact text; image generation changed copy and used serif type.

**Important:** These are concept images with baked-in words and UI. Never deploy a full screenshot as the site. Reconstruct text/navigation/cards/buttons as real semantic HTML, responsive CSS, accessible components. If an image is repurposed as a background, ensure embedded text/UI is not visible; ideally develop new background-only artwork using an approved visual design workflow. Do not rely on hotlinked third-party images.

## 4. Landing page structure and content

### 01. HERO — APPROVED
Micro-label: `STRUCTURE / CURIOSITY / EXPRESSION`

Headline: `BETWEEN SIGNAL AND NOISE.`

Intro (approved):
> Mich faszinieren die Strukturen hinter den Dingen. Die Muster, die Verbindungen und die Fragen, auf die es noch keine Antworten gibt.

CTA primary: `MEINE WELT ENTDECKEN` → scroll to topics/intro.
CTA secondary: `ÜBER MICH` → scroll to about.
Topic micro-row: `IT-ARCHITEKTUR / KI / MUSIK / VISUELLE KUNST`.

Visual: immersive graphitic darkness, abstract smoke/particles/ambient light on the right, subtle copper/amber flares and technical orbital lines. Text on the left. Maintain strong contrast and comfortable whitespace. On mobile, place composition behind/below text without reducing readability.

### 02. ABOUT — BEYOND THE SIGNAL.
Use the following copy with the **approved professional-focus paragraph exactly as written**:

> Komplexität verstehen. Zusammenhänge erkennen. Aus einzelnen Elementen etwas Neues entstehen lassen.
>
> Mein professioneller Schwerpunkt liegt in der Gestaltung komplexer IT-Landschaften. Besonders spannend sind dabei die Strukturen, Abhängigkeiten und das Zusammenspiel ihrer Komponenten – und die Möglichkeiten, die daraus entstehen.
>
> Darüber hinaus eröffnen künstliche Intelligenz, elektronische Musik und visuelle Kunst immer wieder neue Perspektiven.
>
> Unterschiedliche Welten, die nicht zwangsläufig zusammengehören müssen. Was sie verbindet, ist die Neugier auf das Unbekannte und die Freude am Experimentieren.
>
> Denn wirklich spannend wird es dort, wo Bekanntes hinterfragt wird und neue Möglichkeiten entstehen.

Optional pull quote if it fits: `Nicht alles braucht ein Ziel. Manches darf einfach faszinieren.`

### 03. TOPIC WORLDS — SAME CURIOSITY. DIFFERENT FIELDS.
Four distinct, cohesive cards/sections (content can be shortened responsively but not filled with invented achievements):

- `SYSTEMS.` — `Finding order in complexity.` — IT landscapes, infrastructure, systemic connections. German body: `Komplexe IT-Landschaften sind mehr als die Summe ihrer Komponenten. Entscheidend sind die Verbindungen dazwischen – und die Frage, wie aus Strukturen tragfähige Lösungen entstehen.`
- `LAB.` — `What if? Why not?` — AI, web and prototyping. German body: `Neue Technologien eröffnen neue Möglichkeiten. Künstliche Intelligenz, digitale Werkzeuge und eigene Experimente bieten Raum, Ideen auszuprobieren, Grenzen zu entdecken und aus Ergebnissen zu lernen.`
- `FREQUENCIES.` — `Beyond words. Beyond logic.` — electronic music, sound worlds, visual expression. German body: `Elektronische Musik, Klangwelten und visuelle Kunst. Manches muss nicht analysiert werden, um seine Wirkung zu entfalten. Rhythmus, Atmosphäre und Emotionen eröffnen eine andere Form der Wahrnehmung.`
- `PERSPECTIVES.` — `Question the obvious.` — thoughts, observations, new viewpoints. German body: `Beobachtungen, Gedanken und neue Blickwinkel. Nicht jede Frage braucht sofort eine Antwort. Manchmal liegt der eigentliche Wert darin, Gewohntes zu hinterfragen und eine andere Perspektive einzunehmen.`

### 04. SELECTED SIGNALS.
Three **editorial/concept** tiles. Do not invent live pages, working playlist URLs or completed products; use honest 'coming later' handling and only link actual pages:
- `CINDER HAZE.` — visual abstract experiments.
- `ON REPEAT.` — curated music/influences and short commentary (link only with verified destinations).
- `AI WORKBENCH.` — AI experimentation, tools, learning, prototypes.

These are editorial concepts; do not create fake case studies or fictitious results. Source material will be expanded later.

### 05. CONTACT — STAY CURIOUS. STAY CONNECTED.
Suggested body copy: `Gute Gespräche beginnen oft mit einer interessanten Frage. Ob Technologie, Kreativität oder einfach ein neuer Gedanke – der Austausch ist willkommen.`
Contact CTA: `KONTAKT AUFNEHMEN`. A functional mailto requires owner-supplied email; until provided, keep an explicit configurable placeholder, not a made-up email address.
Footer: `CHRISTOPH ZINK`, Impressum and Datenschutz (accurate owner-supplied information, not fabricated legal text).

## 5. Interaction/UX & implementation
- Mobile-first and fully responsive; desktop hero should feel cinematic without making mobile cramped.
- Reduced motion preference must be respected; modest animation only (slow abstract ambient motion, fades) and no intrusive scroll-jacking or parallax dependence.
- Fast-loading optimized visuals, lazy-load below-the-fold media, semantic HTML, keyboard navigation, visible focus, logical heading hierarchy and color contrast checks.
- No unrelated stock icons/pictures. Avoid bulky UI libraries, tracking scripts and unnecessary external dependencies.
- SEO essentials: title, meta description, OG metadata, canonical, sitemap, robots and accessible alt text appropriate to decorative vs informative imagery.
- Privacy: no automatic external fonts/analytics/third-party embeds or nonessential cookies in first iteration; owner-supplied legal details to follow.
- Version-control friendly structure; clean readable code, maintainable components, content separate from layout when useful.

## 6. Suggested workflow for Codex
1. Inspect current repository/working directory; do not overwrite existing files blindly.
2. Recommend a lean stack suitable for a mostly static personal site (Astro or comparable). Briefly explain selection and obtain any truly required configuration from the operator. If repo already exists, prefer its conventions.
3. Build a first functional homepage and temporary local preview, implementing approved HERO and ABOUT copy first, then topics, projects and contact.
4. Verify responsive behavior, keyboard access, reduced motion, build and links. Provide exact run/build commands.
5. Do not deploy to production without explicit user approval and proper access arrangements.

## 7. Acceptance criteria
- Clearly resembles approved hero reference in **layout and atmosphere**, but is a live accessible webpage, not an image.
- Every German sentence avoids beginning with `Ich`.
- The hero and professional-focus paragraph match approved text.
- No selfie/portrait/avatar and no Schnittvisite reference.
- English headings + German body/nav.
- Selected signals contain no misleading links or fabricated details.
- Good mobile UX and basic performance/a11y hygiene.
