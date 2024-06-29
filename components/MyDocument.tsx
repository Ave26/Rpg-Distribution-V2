// components/MyDocument.js
import React from "react";
import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { TReportData } from "@/pages/api/generateReport";
import { assignedProducts } from "@prisma/client";
import { TRecords } from "@/fetcher/fetchRecord";

type TMyDocumentProps = {
  product?: SkuOnly[];
  reportData?: TReportData;
  record?: TRecords;
};

type SkuOnly = Pick<assignedProducts, "skuCode">;

export default function MyDocument() {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Details for Customer Order # {0}</Text>
          <Text style={styles.date}>{new Date().toLocaleString()}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.tableColHeader, { width: "40%" }]}>
              Product/Supplier
            </Text>
            <Text style={styles.tableColHeader}>Unit Price</Text>
            <Text style={styles.tableColHeader}>Quantity</Text>
            <Text style={styles.tableColHeader}>Discount</Text>
            <Text style={styles.tableColHeader}>Subtotal</Text>
          </View>
          {/* {record.products.map((product, index) => (
            <View style={styles.tableRow} key={index}>
              <View
                style={[
                  styles.tableCol,
                  { width: "40%", flexDirection: "column" },
                ]}
              >
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetails}>
                  {product.supplierDetails}
                </Text>
              </View>
              <Text style={styles.tableCol}>{product.unitPrice}</Text>
              <Text style={styles.tableCol}>{product.quantity}</Text>
              <Text style={styles.tableCol}>{product.discount}</Text>
              <Text style={styles.tableCol}>{product.subtotal}</Text>
            </View>
          ))} */}
        </View>
      </Page>
    </Document>
  );
}
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
  },
  titleSection: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "OpenSans",
  },
  date: {
    fontSize: 10,
    fontFamily: "OpenSans",
    color: "#555",
  },
  table: {
    // display: "table",
    width: "auto",
    marginTop: 20,
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    textAlign: "center",
    padding: 5,
    fontFamily: "OpenSans",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    textAlign: "center",
    padding: 5,
    fontFamily: "OpenSans",
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "OpenSans",
  },
  tableCell: {
    fontSize: 10,
    fontFamily: "OpenSans",
  },
  productName: {
    fontSize: 12,
    fontFamily: "OpenSans",
    fontWeight: "bold",
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 10,
    fontFamily: "OpenSans",
    color: "#555",
  },
  sectionHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottom: "1 solid #bfbfbf",
    padding: 5,
    fontFamily: "OpenSans",
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "OpenSans",
  },
});
