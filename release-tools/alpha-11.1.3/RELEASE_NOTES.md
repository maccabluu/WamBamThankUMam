# Wam Bam Alpha 11.1.4 — Home navigation

PLAY and Settings now queue navigation for the GDevelop frame callback. Previously the engine erased requests made directly from DOM clicks at the start of its next frame. Wam World boss navigation uses the same queue.

- Home controls remain mounted between GDevelop frames, so a press and its click finish on the same button.
- PLAY queues the packaged `Level Map` scene; Settings queues a push of `Settings` so its existing Back action works.
- Legacy canvas hitboxes are disabled when DOM controls own home input.
- Wam World blocks the stable home controls while open and consumes pointer, touch and click events.
- Package name, signing identity, save keys, campaign progress, artwork and levels are retained.

Verification uses the actual packaged RuntimeScene frame implementation and scene tools to reproduce the previous failure and assert the repaired requests survive the frame reset. Physical Android touch testing remains unverified.
