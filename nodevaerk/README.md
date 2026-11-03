# Nodeværk

Færdig første version af en personlig webapp til nodelæsning på klaver. Dansk brugerflade, mobile skærme, begge nøgler og originale små klaverstykker. Selvstændig app i `nodevaerk/` i klaver-repositoriet. Den eksisterende klaverapp ligger fortsat i roden og ændres ikke af Nodeværk.

## Brug

Åbn Nodeværks eget link: https://mgforever26.github.io/klaver/nodevaerk/. Appen har eget ikon og egen hjemmeskærmsgenvej. Begynd med en blandet gruppe på fem opgaver. Første svar registreres; fejl gentages i senere grupper. Stykker kan læses i grupper på højst fem toner og høres med justerbart tempo. Appen måler læsesvar, ikke fysisk klaverspil.

Data ligger i localStorage på samme origin i samme browser. Safari, ChatGPT og hjemmeskærm kan have hver deres lager. Vælg gerne den faste hjemmeskærmsgenvej før regelmæssig træning. Ingen serverlagring eller synkronisering. Der gemmes op til 4.000 detaljerede svar, samlet statistik og en igangværende session. En tidligere gyldig tilstand beholdes som lokal sikkerhedskopi. Webstedsdata kan slettes af bruger/browser.

## Arkitektur

- `engine.js`: separat musikmodel, fortegnsresolver, opgavegenerator, niveauer og fejlgenbesøg.
- `notation.js`: SVG gennem VexFlow 4.2.5 med Bravura, fuldt lokal medfølgende bibliotek.
- `app.js`: brugerflade, fremgang, sessioner, lagring, lyd og zoom.
- `style.css`: mobile layouts og tilgængelighed.
- `sw.js`: netværk først med lokal fallback. Offlineadfærd er ikke verificeret i en fysisk Safari-installation.
- `tests/engine.test.cjs`: deterministiske tests uden browser.
- `tests/browser.html` og `browser.js`: separat intern browserharness til mobilbredder, gennemløb og SVG-kontrol. QA-visningen oprettes kun lokalt og er udeladt fra Git.

## Musikalske konventioner

Dansk H/B. Internt bruges bogstaverne C-D-E-F-G-A-B med B som stamtonen H, mens toneændring er en separat værdi. Rendering og facit benytter eksplicit bogstav, oktav, fortegn, varighed og takt. Et løst fortegn gælder i samme system, samme oktav og takt; faste fortegn gælder alle oktaver. Takt- og systemhukommelse adskilles. Ingen bindebuer, dobbelte fortegn eller skift af nøgle i denne version. Stykkerne bruger én stemme i hvert system.

Der testes mod håndskrevne MIDI-facit for begge hænder i alle seks stykker og faste koordinater for anker- og hjælpelinjenoder. Enharmoniske navne er bevidst forskellige svar i læseøvelserne.

## Progression

Seks adskilte områder, fire niveauer. Mindst 9/10 korrekte svar på aktuelt niveau og median for korrekte svar højst 6,5 sekunder for G/F-nøgle, 10 for fortegn/rytme og 12 for intervaller/passager løfter niveauet. Højst 5/10 sænker ét niveau. Grænserne er pædagogiske produktvalg, ikke validerede normer. Blandede grupper dækker områderne; en gemt fejl prioriteres som gentagelse. Begge nøglers niveau 2 åbner samlet læsning i blandede grupper. Alle stykker er altid tilgængelige manuelt.

## Verifikation, 2. november 2026

- 16 automatiske tests bestået, herunder 10.000 genererede opgaver, alle toners facit og alle taktlængder.
- 43 browserkontroller bestået i Chrome, herunder 720 renderinger, mobilbredder på 320/375/390/430 CSS-pixels, genåbning, fejlgenbesøg, 12-toners stykke i tre grupper, zoom, lydstart/stop, gendannelse fra beskadiget primærlager og synlig fejl ved blokeret skrivning.
- Visuel inspektion af mobilforside, øveskærm og fortegn.
- Ikke testet på en fysisk iPhone eller direkte i iOS Safari. Lydens faktiske klang og Safari-hjemmeskærmens adfærd er derfor ikke hardwareverificeret. Ingen påstand om automatisk vurdering af klaverspil.

## Kør tests

Kør `npm ci` og derefter `npm test` fra `nodevaerk/`. Appen er statisk og kræver ingen bygning; VexFlow ligger allerede i `vendor/`.

Til browserkontrol: `npm run qa:prepare`, servér `nodevaerk/` med en lokal webserver, åbn `__qa.html` under appens egen sti, og vælg Kør browsertests. Brug en separat browserprofil til QA, da testene ændrer de lokale testresultater. `npm run qa:clean` fjerner testvisningen før publicering.

## Kilder og licens

Musikalske regler kontrolleret mod LilyPond Notation Reference og Musikipedia, især https://www.musikipedia.dk/fortegn og https://lilypond.org/doc/v2.26/Documentation/notation/writing-pitches. VexFlow er MIT-licenseret; licens medfølger i `vendor/VEXFLOW-LICENSE`. iOS-hjemmeskærmens separate lagring beskrevet af WebKit: https://webkit.org/blog/14787/webkit-features-in-safari-17-2/.

## Flytning til GitHub, 3. november 2026

Kopieret fra den publicerede Site-version med kildecommit `6010f0d3cb1270c9354e3f48f3f56179cd6bf455`. Webmanifestets app-id er gjort relativt (`./`), så installationen identificeres med Nodeværks egen undermappe. Serviceworkerens standardomfang er samme mappe. Test- og QA-stier følger den nye mappeplacering. Ingen ændringer i musikmodel, facit eller progression.

Resultater på den oprindelige ChatGPT Site-adresse følger ikke automatisk med til GitHub Pages, da adresserne har hvert sit lokale lager. Det oprindelige private link fungerer fortsat.
