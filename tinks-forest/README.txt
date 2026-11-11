Tink's Forest
=============
Upload everything in this folder (keep the folders next to index.html) to any static web host and open index.html.
It must be served over http(s) - opening the file directly from disk will not load the models.
Quick local test:  python3 -m http.server 8000   then visit http://localhost:8000
Three.js and the fonts load from public CDNs, so the page needs internet access.
Quality: press T for the tuning panel; the quality button switches between full and light graphics.

What's where
------------
models/characters   the cats (Tink & Luca, with all their animations) and the moss puffs
models/creatures    squirrels, birds, woodpecker, frog, dragonfly, tadpole
models/plants       cherry trees, blossoms, giant hollow tree, beanstalk, ferns, flowers, grass clumps...
models/rocks        rocks, bridges, stepping stones, shrine rocks and frog statue
models/buildings    tower house and room, farmhouse, well, shelter, lanterns, wind chime, washing line, cushion
models/gifts        Jack's gifts
textures            cat coats, butterfly wings, moss patches, the title-screen picture
audio/music         songs (one per season, house/tunnel piano, beanstalk song)
audio/ambient       background loops: forest day/night, wind, rain, thunder, cicadas, crickets
audio/cats          meows, purrs, trills, hisses
audio/animals       birds, squirrels, woodpecker
audio/actions       footsteps, splashes, paw swat
audio/magic         item-found chime, Jack's shimmer
(Models are stored as .glb.txt - a plain-text copy of the .glb file.)
