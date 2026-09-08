# Wam Bam Alpha 9.5.0

Wam Bam now has 40 levels across four areas: The Bam Lounge, Lipstick Lounge,
Disco Diner and Couture Club. The existing artwork, ten supplied icons, Android
package and save keys stay in use.

## Gameplay

- Levels 10 to 40 introduce nine board shapes, including steps, windows, wings,
  hourglasses, bridges and separate sections. Each level defines its layout,
  targets, moves, icon palette and obstacle placement.
- Gift boxes take one hit, or two for ribboned boxes. Match beside a box or hit
  it with a special. Handbags still take two hits.
- Ice sits on a board cell. Clear an icon on that cell to remove one layer.
  Double ice needs two clears. The ice stays on its cell as pieces fall.
- A square of four creates a Flying Kiss from Level 10 onward. Flying Kisses
  seek outstanding targets. Levels 1 to 9 keep their existing square-to-Disco
  rule. Five in a line still creates a Disco.
- Tap a special to activate it, or swap specials for a combined clear.
- Gaps and fixed obstacles divide gravity into separate sections. Invalid
  swaps and taps on gaps cost no moves or boosters.
- The opening two levels have more moves to introduce the game gradually.

## Map and areas

- Four area tabs show ten levels at a time, with a drawn path, readable nodes,
  saved ratings, locks, a full level list and a My Level shortcut.
- New-level previews show the board shape and targets before play.
- First-time completions earn one decoration star each. Spend those stars on
  16 decorations across the four areas. Replaying a level improves its rating
  without awarding another decoration star. Existing completed levels count.
- The decoration scenes are lightweight illustrated panels. They do not add
  a 3D world, online teams, purchases or rescue minigames.

## Android and validation

Package: `com.macca.wambamthankumam`. Version code: `95000`.
The build uses the SHA-256-verified 9.3 APK and its existing signing identity.
The 9.4 source and release are retained. The patch reuses its supplied icons.

Engine checks cover 1,000 seeded starting boards, 40-level cascade simulation,
all 25 special pairings, obstacles, holes, invalid moves, progress and decoration
currency. CI also checks representative phone layouts, touch swipes, completion,
next-level navigation, tablet fit, map spacing and original Home integration.
Physical-device playtesting is still needed for difficulty, audio and performance.
