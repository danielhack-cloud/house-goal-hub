import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePushNotifications = (userId: string | undefined) => {
  const registerPush = useCallback(async () => {
    if (!userId) return;

    try {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform()) return;

      const { PushNotifications } = await import("@capacitor/push-notifications");

      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== "granted") return;

      await PushNotifications.register();

      PushNotifications.addListener("registration", async (token) => {
        const platform = Capacitor.getPlatform(); // 'ios' | 'android'
        
        // Upsert token to database
        await supabase.from("push_tokens").upsert(
          { user_id: userId, token: token.value, platform },
          { onConflict: "user_id,token" }
        );
      });

      PushNotifications.addListener("registrationError", (err) => {
        console.error("Push registration error:", err);
      });

      PushNotifications.addListener("pushNotificationReceived", (notification) => {
        console.log("Push received:", notification);
      });

      PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
        console.log("Push action:", action);
      });
    } catch (err) {
      console.error("Push notifications not available:", err);
    }
  }, [userId]);

  useEffect(() => {
    registerPush();
  }, [registerPush]);
};
