

## Plan: Set Up Capacitor for Native Mobile App

### Steps

1. **Install Capacitor dependencies** — Add `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, and `@capacitor/android` to the project.

2. **Initialize Capacitor** — Create `capacitor.config.ts` with:
   - appId: `app.lovable.fd9d6f97e8054dcfa7b98f3dc588d6ea`
   - appName: `house-goal-hub`
   - Server URL pointing to the sandbox preview for hot-reload

3. **Post-setup instructions** — Guide you through the local steps needed to build and run on a device (export to GitHub, `npx cap add ios/android`, etc.)

### Technical Details

- Capacitor wraps the existing web app in a native shell (WKWebView on iOS, WebView on Android)
- Hot-reload is configured so the native app loads from the Lovable preview URL during development
- For production, you'd remove the server URL so the app uses the bundled web assets
- Apple Developer account ($99/year) required for iOS App Store; Google Play ($25 one-time) for Android

