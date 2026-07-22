export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export async function fileToCompressedDataUrl(
  file: File,
  maxDim = 1000,
  quality = 0.8,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

export type Vehicle = {
  _id: string;
  make: string;
  model: string;
  category: string;
  year?: number;
  price: number;
  quantity: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export const CATEGORIES = ["Sedan", "SUV", "Coupe", "Truck", "Hatchback"] as const;
