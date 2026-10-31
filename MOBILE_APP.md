# Getting Kolkata Fish, Mutton & More onto the Google Play Store

Short version: **I've done the technical prep work below, but the last
mile — building the signed app file and submitting it — needs your own
Google Play Developer account and a computer with Android Studio.**
I can't create that account or click "Publish" on your behalf; those
are account/business actions tied to you, not something a website
builder (me) can do from here. What follows gets you as close as
possible so that part is mostly mechanical.

## What's already done in this project

### 1. The site is now a real installable app (PWA) — works today, free, no Play Store needed
I added:
- `manifest.json` — app name, icons, colors, "standalone" display (no
  browser address bar)
- `service-worker.js` — caches the site so it opens instantly and still
  works (browsing, prices, cart) with a poor or no connection; placing
  a new order still needs internet, same as any WhatsApp chat
- `icons/` — a full set of app icon sizes

**Try it right now:** host the site (see the main README's free-hosting
section), open it on an Android phone in Chrome, tap the **⋮** menu →
**"Add to Home screen" / "Install app"**. It installs like a real app,
gets its own icon, and opens full-screen. Many small businesses stop
here — it's genuinely free and requires nothing further.

### 2. A ready-to-build Android project scaffold (Capacitor)
This is the standard free path from a web app to a real Play Store
listing — it wraps this exact site into a native Android project you
build with Android Studio. I've added:
- `package.json` — the Capacitor dependencies
- `capacitor.config.json` — app ID (`com.kolkatafishmuttonmore.app`) and
  name, already filled in

This can't be finished inside this chat because building an Android
`.aab`/`.apk` needs Android Studio, the Android SDK, and a Java build
toolchain running on a real machine — that's not available in this
sandboxed environment, and Google's SDK servers aren't reachable from
here either.

## What you (or a developer) do next

1. **Install prerequisites** on a Windows/Mac/Linux computer:
   [Node.js](https://nodejs.org) and [Android Studio](https://developer.android.com/studio)
   (Android Studio includes the Android SDK and Java toolchain).
2. **Open a terminal in this project folder** and run:
   ```
   npm install
   npx cap add android
   ```
   This generates a full `android/` Android Studio project around the
   site.
3. **Generate proper Android launcher icons** from `icons/icon-512.png`
   (Android needs several densities) — easiest way:
   ```
   npm install @capacitor/assets --save-dev
   npx capacitor-assets generate --iconBackgroundColor "#A31621"
   ```
4. **Open the project in Android Studio:**
   ```
   npx cap open android
   ```
5. **Build a signed app bundle:** in Android Studio, `Build` →
   `Generate Signed Bundle / APK` → choose **Android App Bundle (.aab)**
   → create a new keystore (a password-protected signing key). **Save
   this keystore file and its password somewhere safe and backed up** —
   you need the exact same one for every future update, and losing it
   permanently locks you out of updating the app.
6. **Create a Google Play Developer account** at
   [play.google.com/console](https://play.google.com/console) — a
   one-time $25 fee, tied to a Google account you control.
7. **Create the store listing**, which requires:
   - App name, short and full description
   - App icon (512×512 — already generated, in `icons/`)
   - A feature graphic (1024×500 banner image)
   - At least 2 phone screenshots (screenshot the app on a phone/emulator)
   - A **privacy policy URL** — Play Store requires this for essentially
     every app, even ones like this with no server-side data collection.
     A short page stating what the app stores (name/phone/address,
     locally on-device, for order convenience) and that orders are sent
     via WhatsApp is normally enough — I can draft that page for you if
     you'd like.
   - Content rating questionnaire (a few clicks, this is a general/
     everyone-rated shopping app)
8. **Upload the `.aab` file**, complete the listing, and submit for
   review. First-time developer accounts can take a few days longer
   than usual for the first review.

## One thing worth knowing

Play Store's "minimum functionality" policy is stricter on apps that
are just a website in a box with nothing native added. This app already
clears that bar reasonably well because of the offline service worker
and installable behaviour, but if you want to strengthen it further,
Capacitor makes it easy to add real native touches later — e.g. a
native "Share" button, push notifications for order status, or a
native back-button/gesture feel. Say the word if you'd like any of
those added before you submit.

## Alternative: Trusted Web Activity (TWA), once the site has a live domain

If/when this site is hosted at a real address (say
`kolkatafishmuttonmore.com`), there's an even lighter path Google
built specifically for this: a **Trusted Web Activity** via the free
`bubblewrap` tool. It produces a tiny Android app that just points at
your live site (with a verification file proving you own both), so the
app always shows your latest content with no separate app update
needed for content changes. It needs the same Android Studio + Play
Console steps above, just a different (and often simpler) starting
tool. Let me know once the site is live on a domain and I can prepare
that version instead or as well.
