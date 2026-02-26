

## Plan: Add Camera Capture and Push Notification Support

### Important Context

Capacitor's native plugins (Camera, Push Notifications) require native code that runs on iOS/Android devices. The JavaScript/TypeScript integration code can be added here in Lovable, but these features will **only work when running the app on a real device or emulator** after exporting to GitHub and building with Xcode/Android Studio. They will gracefully fall back in the web preview.

### Steps

1. **Install Capacitor plugins** -- Add `@capacitor/camera` and `@capacitor/push-notifications` packages.

2. **Create a camera utility hook** (`src/hooks/use-camera.ts`) -- A hook that detects whether the Capacitor Camera plugin is available (native app) vs web, and provides a `takePhoto()` function. On native, it opens the device camera directly. On web, it falls back to the existing file input.

3. **Update Transactions page with camera button** -- Add a "Take Photo" button (with Camera icon) next to the existing upload area on the receipt form. When tapped on a native device, it launches the camera; the captured photo feeds directly into the existing `handleFile` / `parseReceipt` flow.

4. **Create push notifications utility** (`src/hooks/use-push-notifications.ts`) -- A hook that:
   - Requests notification permission on native devices
   - Registers for push notifications and retrieves the device token
   - Saves the token to a `push_tokens` table in the database (linked to user ID)
   - Listens for incoming notifications

5. **Create `push_tokens` database table** -- Migration to store device tokens with columns: `id`, `user_id`, `token`, `platform` (ios/android), `created_at`. Includes RLS policies so users can only manage their own tokens.

6. **Integrate push notification registration** -- Call the registration hook from the app layout so tokens are saved when users log in on a native device.

7. **Create a backend function** (`send-notification`) -- An edge function that can send push notifications via Apple/Google services. This will be scaffolded but will require APNs/FCM credentials to be configured later when you're ready to deploy.

### Technical Details

- `@capacitor/camera` uses the native camera API on iOS/Android, returns a base64 image that plugs directly into the existing receipt parsing pipeline
- `@capacitor/push-notifications` handles permission prompts, token registration, and notification listeners
- Both plugins detect their runtime environment -- they no-op gracefully in web browsers
- Push notifications require additional setup after export: APNs key for iOS (from Apple Developer account), FCM server key for Android (from Firebase Console)
- The `capacitor.config.ts` may need plugin-specific configuration added

### Post-Implementation: What You'll Need to Do Locally

After exporting to GitHub and building:
1. `npx cap sync` to sync the new plugins to native platforms
2. For push notifications: configure APNs (iOS) and FCM (Android) credentials
3. Test camera capture on a physical device or emulator

