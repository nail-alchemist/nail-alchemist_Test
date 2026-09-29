# Nail Alchemist — Website

Statische Website. Wird über **GitHub Pages** ausgeliefert.

## Was hier liegt

| Datei / Ordner | Zweck |
|---|---|
| `index.html` | Startseite |
| `*.dc.html` | die übrigen Seiten |
| `_ds/` | Design-System: Farben, Schriften, Komponenten |
| `support.js`, `doc-page.js`, `image-slot.js` | Runtime der Seiten |
| `slots.js` | **wird automatisch erzeugt** — freie Termine aus dem iCloud-Kalender |
| `.nojekyll` | siehe unten — ohne diese Datei fehlt das ganze Design |

## ⚠️ `.nojekyll` nicht löschen

GitHub Pages schickt Dateien standardmäßig durch Jekyll, und Jekyll **überspringt
alles, was mit einem Unterstrich beginnt**. Das Design liegt in `_ds/` — ohne die
leere Datei `.nojekyll` wäre die Seite online, aber komplett ohne Styling.

## ⚠️ Die Startseite heißt `index.html`, nicht `index.dc.html`

GitHub Pages sucht unter `/` nach `index.html`. Alle Verweise in den anderen Seiten
sind entsprechend angepasst. Beim Umbenennen also beides mitziehen.

## `slots.js` wird nicht von Hand bearbeitet

Die Datei entsteht auf dem Home-Lab-Server `homelab1` aus dem veröffentlichten
iCloud-Kalender und wird von dort automatisch hierher gepusht.

Das erzeugende Skript (`build-slots.py`) liegt **bewusst nicht in diesem Repository** —
es enthält den Kalenderlink, und wer den hat, kann alle Termintitel des Kalenders
mitlesen. Dieses Repository ist öffentlich.

> **Deshalb die Regel: Hier kommt nur hinein, was ohnehin jeder Website-Besucher
> sehen kann.** Im Zweifel nicht committen — einmal gepusht, steht es für immer
> in der Versionsgeschichte.

## Offen vor dem Livegang

- [ ] Echte WhatsApp-Nummer in `contact.dc.html` (`WHATSAPP_NUMBER`).
      Solange dort Platzhalter stehen, fällt das Formular automatisch auf E-Mail zurück.
- [x] ~~Google-Maps-iframe in `contact.dc.html`~~ → **erledigt 17.09.2026.**
      Die Karte lädt jetzt erst nach einem Klick auf „Show map"; beim Seitenaufruf
      geht nichts an Google. Daneben steht ein Direktlink, der gar nichts einbettet.
- [ ] Impressum (`terms.dc.html`) und Datenschutzerklärung (`policies.dc.html`)
      sind noch Platzhalter. In Österreich Pflicht.
