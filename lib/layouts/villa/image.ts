// Turn an uploaded image File into a downscaled JPEG data URL so villa photos
// can live in localStorage without blowing the ~5 MB quota. Runs on the client.

const MAX_DIM = 1600;
const QUALITY = 0.82;

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("That file isn't an image."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const src = reader.result as string;
      const img = new window.Image();
      img.onerror = () => reject(new Error("Could not decode the image."));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Canvas unavailable — fall back to the raw data URL.
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
