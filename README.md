# Wam Bam Thank U Mam

Native Android match-3 game in Alpha.

## Latest gameplay update - Alpha 8.0.0

- [Read the Alpha 8.0.0 release notes](downloads/alpha-8.0.0/RELEASE_NOTES.md)
- [Previous Alpha 7.9.0 Android APK](downloads/alpha-7.9.0/WamBam_Alpha_7.9.0_Events_And_Navigation.apk)
- [Previous Alpha 7.9.0 editable GDevelop source](downloads/alpha-7.9.0/WamBam_GDevelop_Alpha_7.9.0_Events_And_Navigation_Source.zip)

Alpha 8.0.0 updates Levels 1 to 5 with the new lounge gameplay background. The old Coins and Hearts gameplay HUD readouts are removed, Moves and Target information are repositioned, and the board now matches the taller artwork with 8 cells across and 11 cells down. Match checking, drops, cascades, reshuffles, boosters and Level 5 handbag blockers were updated for the expanded board. Gameplay icons were resized to sit inside the new grid cells.

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
