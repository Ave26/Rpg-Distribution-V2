import bwipjs from "bwip-js";

export async function generateBarcodePNG(text: string): Promise<string> {
  const pngBuffer = await bwipjs.toBuffer({
    bcid: "code128", // Barcode type
    text: text, // Text to encode
    scale: 3, // 3x scaling factor
    height: 10, // Bar height, in mm
    includetext: true, // Show human-readable text
    textxalign: "center", // Center-align text
  });

  // Convert buffer to base64 image URL
  return `data:image/png;base64,${pngBuffer.toString("base64")}`;
}
