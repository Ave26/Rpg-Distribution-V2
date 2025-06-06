/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 300,
    height: 100,
  },
});

interface BarcodePDFProps {
  barcode?: string;
  barcodes?: void | { label: string; base64: string }[];
}

export const BinBarcodes = ({ barcode, barcodes }: BarcodePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {Array.isArray(barcodes) || !barcode ? (
        barcodes?.map((barcode) => {
          return (
            <Image
              key={barcode.label}
              src={barcode.base64}
              style={styles.image}
            />
          );
        })
      ) : (
        <Image src={barcode} style={styles.image} />
      )}
    </Page>
  </Document>
);
export default BinBarcodes;
