# Nodeværk

Version 4 med bred toneartstræning, progression og tydelige næste skridt. Den originale klaverapp i repositoriets rod er uændret.

## Udvidelse 7. november 2026

- 12 durtonearter samt deres 12 relative naturlige moltonearter. 12 toneartssignaturer, med dansk navngivning (H-dur, Fis-dur, B-mol m.v.). På niveau 3 og 4 kommer alle 24 i omløb, også i G-/F-nøgler og hele takter. Niveau 1 og 2 har mindre puljer. De eksisterende øvestykker forbliver uændrede.
- Takternes toner vælges i det relevante fortegnssystem med en bias mod den valgte tonearts grundtone. Rytme og samspil fortsætter i 2/4, 3/4, 4/4, 6/8 og 12/8. Ingen påstand om at hver tilfældigt genereret takt er en komplet komposition i den viste toneart.
- Efter hver øvegruppe vises status på op til tre trænede områder. Under Fremskridt vises alle seks færdigheder. Visningen bruger den eksisterende algoritmes faktiske regler: seneste 10 svar på aktuelt niveau, mindst 9 korrekte samt medianhastighed under færdighedens grænse. Niveau 4 er sidste nuværende trin; dækningen af tonearter fortsætter derefter.
- Toneartsoverblikket tæller, hvilke af 24 tonearter der er mødt siden opdateringen, ikke hvilke der er mestret. Nye svar gemmer toneart og taktart; gamle svar forbliver intakte uden bagudopfundet metadata.
- Efter gruppen kommer også et anbefalet næste skridt fra grundøvelse til takt- og musiklæsning. Det er valgfrit.
- Ingen ændring i nøglen `nodevaerk.progress.v1`, den eksisterende `version:1`-state, besvarelser, niveauer, aktive sessioner, `learning.reviews` eller tidligere gemte øvelser. Kun additive felter. Der er stadig ingen serverbaseret backup eller synkronisering mellem enheder.
- Testene under `nodevaerk/tests` dækker tonearter, dansk tonenavngivning, partiturintegritet, facit, øvegruppernes fordeling, niveaukrav, tidligere fremskridt og JavaScript-syntaks. Browserens visuelle layout er ikke testet på fysisk iPhone.

---

Version 3 med 42 øvestykker, klaverstudie, tonerækker, akkorder, bankerytmer og gentagelser over flere dage. Oprindeligt færdig første version af en personlig webapp til nodelæsning på klaver. Dansk brugerflade, mobile skærme, begge nøgler og originale små klaverstykker. Selvstændig app i `nodevaerk/` i klaver-repositoriet. Den eksisterende klaverapp ligger fortsat i roden og ændres ikke af Nodeværk.

## Brug

Åbn Nodeværks eget link: https://mgforever26.github.io/klaver/nodevaerk/. Appen har eget ikon og egen hjemmeskærmsgenvej. Begynd med en blandet gruppe på fem opgaver. Første svar registreres; fejl gentages i senere grupper. Stykker kan læses i grupper på højst fem toner og høres med justerbart tempo. Appen måler læsesvar, ikke fysisk klaverspil.

Data ligger i localStorage på samme origin i samme browser. Safari, ChatGPT og hjemmeskærm kan have hver deres lager. Vælg gerne den faste hjemmeskærmsgenvej før regelmæssig træning. Ingen serverlagring eller synkronisering. Alle eksisterende detaljerede svar, samlet statistik og en igangværende session bevares. Nye svar afkortes ikke ved 4.000. En tidligere gyldig tilstand beholdes som lokal sikkerhedskopi. Webstedsdata kan slettes af bruger/browser.

## Arkitektur

- `engine.js`: separat musikmodel, fortegnsresolver, opgavegenerator, niveauer og fejlgenbesøg.
- `notation.js`: SVG gennem VexFlow 4.2.5 med Bravura, fuldt lokal medfølgende bibliotek.
- `app.js`: brugerflade, fremgang, sessioner, lagring, lyd og zoom.
- `style.css`: mobile layouts og tilgængelighed.
- `sw.js`: netværk først med lokal fallback. Offlineadfærd er ikke verificeret i en fysisk Safari-installation.
- `tests/engine.test.cjs`: deterministiske tests uden browser.
- `tests/browser.html` og `browser.js`: separat intern browserharness til mobilbredder, gennemløb og SVG-kontrol. QA-visningen oprettes kun lokalt og er udeladt fra Git.

## Musikalske konventioner

Dansk H/B. Internt bruges bogstaverne C-D-E-F-G-A-B med B som stamtonen H, mens toneændring er en separat værdi. Rendering og facit benytter eksplicit bogstav, oktav, fortegn, varighed og takt. Et løst fortegn gælder i samme system, samme oktav og takt; faste fortegn gælder alle oktaver. Takt- og systemhukommelse adskilles. Akkorder og bindebuer understøttes. Dobbelte fortegn og skift af nøgle understøttes ikke. Stykkerne bruger én stemme i hvert system.

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


## Læringsudvidelse, 3. november 2026

Nodeværk 2 tilføjer et selvstændigt `curriculum.js` og en 18-opgavers indledende niveauafklaring med G-nøgle, F-nøgle, fortegn, rytme, intervaller samt takter og samspil. Den eksisterende brugerflade genbruges. Brugeren kan vælge fokuset **Takter**, eller få taktøvelser i **Blandet** fra første øvegruppe. Svar og niveauer fra den oprindelige version bevares, fordi appen fortsat læser og skriver samme `nodevaerk.progress.v1`-datamodel. Niveautjekket kan gentages, men er kun en indledende grov placering baseret på tre opgaver pr. færdighed. Individuel tilpasning fortsætter på hvert område, og tidligere fejl bliver genbesøgt.

Nye opgavetyper: læs en hel tonerække i en takt, find en tones indsatstidspunkt i en takt, og find samtidige anslag i G- og F-nøgle. Fra niveau 3 vises typisk to takter til sammenhængende læsning. Taktarterne er **2/4, 3/4, 4/4, 6/8 og 12/8**. I 6/8 tælles normalt to hovedslag med tre ottendedele, i 12/8 fire sådanne hovedslag. For spørgsmål om præcis placering i 6/8 eller 12/8 nummererer appen ottendedelene 1-6 eller 1-12, mens grupperingen i tre vises i instruktionen. VexFlow tegner hver tredelt ottendedelsgruppe som en gruppe. Tætte takter kan rulles vandret på iPhone.

Automatiske tests for varighed, fortegn, nodefølger, svarmuligheder, de fem taktarter og niveautjek findes i `tests/curriculum.test.cjs`. En bestået testkørsel er ikke det samme som endelig visuel kvalitetssikring på en fysisk iPhone. Appen vurderer fortsat nodelæsningssvar, ikke fysisk klaverspil.


## Version 3, 4. november 2026

36 nye stykker: 24 originale miniaturer og 12 kildekontrollerede uddrag fra Satie, Burgmüller, Mozart og Petzold. De seks eksisterende stykkers id og noder er bevaret. Klassiske uddrag har kilde, licens og beskrivelse af eventuelle forenklinger under Om noderne. Der gengives ikke private nodefiler. Nodekilder: Mutopia-værker 37, 203, 1770 og 75.

`learning.js` udvider den eksisterende model uden at ændre lageridentiteten. `repertoire.js` tilføjer stykkerne. `studio.js` tilføjer klaverspil med optælling, puls, håndvalg, taktudsnit, tempo og separat øvelog. Appen lytter ikke til klaveret. Tapping er vejledende timingtræning, ikke hardwarekalibreret måling.

Tonerækker indtastes tone for tone og dækker begge viste takter. Akkorder læses nedefra. Niveau 4 træner også intervallernes kvalitet og rytmer med sekstendedele og bindebuer. Forkerte svar kommer igen i en senere gruppe. Korrekte gentagelser planlægges efter 1, 3, 7, 21 og 45 dage. Disse intervaller er produktvalg, ikke en individuel læringsgaranti.

Opdateringen genbruger `nodevaerk.progress.v1`, app-id, sti og scope. Før første opgradering gemmes rå gamle data under `.before-v3`, når lagerpladsen tillader det. Eksisterende svar, niveauer, gennemførte stykker og aktiv session ændres ikke af migrationen. Data forbliver lokale i den hidtidige browser eller hjemmeskærmsapp.

Verifikation: 42 automatiske tests bestået, inklusive 10.000 nye opgaver, alle 42 stykkers taktlængder og afspilning, 24 uafhængige klassiske MIDI-facit, akkorder, bindebuer, gentagelsesintervaller og gammel datamigration. 157 browserkontroller bestået, inklusive 720 renderinger og alle stykker ved 320, 375 og 430 px, opgradering med gamle fremskridt, sikkerhedskopi, lagringsfejl og nye svarfelter. Fysisk iPhone/Safari og faktisk lydforsinkelse er ikke hardwaretestet.