# Wam Bam Alpha 11.1.3 — PLAY Fix

Alpha 11.1.3 repairs the home-screen input lifecycle in Alpha 11.1.2.

- Home controls remain mounted between GDevelop frames, so a press and its click finish on the same button.
- PLAY directly opens the packaged `Level Map` scene.
- Wam World blocks the stable home controls while open and consumes pointer, touch and click events.
- Package name, signing identity, save keys, campaign progress, artwork and levels are retained.
