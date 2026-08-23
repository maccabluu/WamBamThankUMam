# Wam Bam Thank U Mam

Native Android match-3 game in Alpha.

## Latest gameplay update — Alpha 9.0.0

- [Download Wam Bam Alpha 9.0.0 for Android](https://github.com/maccabluu/WamBamThankUMam/releases/download/v9.0.0/WamBam_Alpha_9.0.0_4x6_Large_Icons.apk)
- [Read the Alpha 9.0.0 release notes](downloads/alpha-9.0.0/RELEASE_NOTES.md)

Alpha 9.0.0 changes Levels 1–5 to a clear 4-across by 6-down board. The pieces are much larger, the cells stay square, and the complete board is centred inside the parchment frame on every level.

Match checking, swaps, cascades, drops, reshuffles, all four boosters and Level 5 handbag blockers now use the new board dimensions. Reducing the live board from 64 pieces to 24 also lowers rendering work for smoother gameplay.

The updated lounge background remains on every level, with the old Coins and Hearts gameplay tabs removed and the live Moves and Target information aligned to the new upper panels.

Alpha 9.0.0 uses Android versionCode `90000`, versionName `9.0.0`, package `com.macca.wambamthankumam`, and the permanent Wam Bam signing key so it installs as an update to the existing app.

## Previous update — Alpha 8.1.1

- [Download the Alpha 8.1.1 background hotfix](https://github.com/maccabluu/WamBamThankUMam/releases/download/v8.1.1/WamBam_Alpha_8.1.1_Background_Hotfix.apk)

Alpha 8.1.1 restored the sharp gameplay background on Levels 1–5 while retaining the Alpha 8 board and layout changes.

## Previous update - Alpha 8.0.0

- [Read the Alpha 8.0.0 release notes](downloads/alpha-8.0.0/RELEASE_NOTES.md)
- [Previous Alpha 7.9.0 Android APK](downloads/alpha-7.9.0/WamBam_Alpha_7.9.0_Events_And_Navigation.apk)
- [Previous Alpha 7.9.0 editable GDevelop source](downloads/alpha-7.9.0/WamBam_GDevelop_Alpha_7.9.0_Events_And_Navigation_Source.zip)

Alpha 8.0.0 updated Levels 1 to 5 with the lounge gameplay background. The old Coins and Hearts gameplay HUD readouts were removed, Moves and Target information were repositioned, and the board was changed to the taller artwork with 8 cells across and 11 cells down. Match checking, drops, cascades, reshuffles, boosters and Level 5 handbag blockers were updated for the expanded board. Gameplay icons were resized to sit inside the new grid cells.

Alpha 7.9.0 repaired the complete Home return flow from gameplay and the Road Map, aligned the Road Map and Home animations, improved Level 5 handbag tile placement, paused audio when Android backgrounds the app, and added three working daily Events activities.

Package: `com.macca.wambamthankumam`

## Alpha 0.1

- Android Studio project
- Full-screen portrait Android app
- Wam Bam home and gameplay artwork embedded in the app
- Working Play, Events, Shop, Challenges, Settings, VIP, Lives and Coins touch areas
- 8 x 8 match-3 board
- Swipe or tap adjacent pieces to swap
- Invalid swaps return
- Cascading matches
- 16 moves
- Clear 30 pieces to win
- Hammer booster
- Shuffle booster
- BAM 3 x 3 blast
- Hint booster
- Sound and vibration feedback
- Win and lose screens

Package: `com.blustudio.wambam`

## Original native APK builds

GitHub Actions uses `.github/workflows/android-apk.yml` to compile the Android debug APK. Successful builds upload an artifact named `WamBamThankUMam-Android-APK` containing `app-debug.apk`.
