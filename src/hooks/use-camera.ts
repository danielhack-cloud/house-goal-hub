import { useCallback, useState } from "react";

interface CameraResult {
  base64: string;
  mimeType: string;
  file: File;
}

export const useCamera = () => {
  const [isNative, setIsNative] = useState(false);

  // Detect if running in Capacitor native shell
  const checkNative = useCallback(async () => {
    try {
      const { Capacitor } = await import("@capacitor/core");
      const native = Capacitor.isNativePlatform();
      setIsNative(native);
      return native;
    } catch {
      return false;
    }
  }, []);

  const takePhoto = useCallback(async (): Promise<CameraResult | null> => {
    try {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform()) return null;

      const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");

      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 1200,
      });

      if (!image.base64String) return null;

      const mimeType = image.format === "png" ? "image/png" : "image/jpeg";
      const ext = image.format === "png" ? "png" : "jpg";

      // Convert base64 to File for the existing handleFile flow
      const byteString = atob(image.base64String);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeType });
      const file = new File([blob], `receipt-photo.${ext}`, { type: mimeType });

      return { base64: image.base64String, mimeType, file };
    } catch (err) {
      console.error("Camera error:", err);
      return null;
    }
  }, []);

  return { takePhoto, checkNative, isNative };
};
