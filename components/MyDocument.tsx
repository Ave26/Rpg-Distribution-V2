// components/MyDocument.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { TReportData } from "@/pages/api/generateReport";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

type TMyDocumentProps = {
  reportData: TReportData;
};

const MyDocument = ({ reportData }: TMyDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Product Report</Text>
      <View style={styles.section}>
        <Text style={styles.text}>Product: {reportData.product}</Text>
        <Text style={styles.text}>
          Total Quantity Scanned: {reportData.totalQuantityScanned}
        </Text>
        <Text style={styles.text}>POO: {reportData.POO}</Text>
        <Text style={styles.text}>
          Date: {new Date(reportData.date).toLocaleDateString()}
        </Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
