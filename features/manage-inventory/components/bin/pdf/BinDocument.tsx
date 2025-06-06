import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { InventoryBins } from "@/pages/api/inventory/bins";
import { BinResult, binTitles } from "../../../types";
import { formatDate } from "@/utils";

interface BinDocumentProps {
  bins: BinResult[];
}

export default function BinDocument({ bins }: BinDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Inventory Report: Bin Products</Text>
          <Text style={styles.date}>
            Downloaded At {new Date().toLocaleString()}
          </Text>
        </View>

        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.row, { backgroundColor: "#f0f0f0" }]}>
            {binTitles.map((title, i) => (
              <Text key={i} style={[styles.cell, styles.header]}>
                {title}
              </Text>
            ))}
          </View>

          {/* Inventory Rows */}
          {bins.map((bin, i) => {
            return (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{bin.category}</Text>
                <Text style={styles.cell}>
                  {bin.assignedProducts[0].products.productName}
                </Text>
                <Text style={styles.cell}>
                  {bin.rackName}
                  {bin.row}-{bin.shelfLevel}
                </Text>
                <Text style={styles.cell}>
                  {bin.assignedProducts[0].skuCode}
                </Text>
                <Text style={styles.cell}>
                  {formatDate(bin.assignedProducts[0].dateInfo.date)}
                </Text>
                <Text style={styles.cell}>{bin._count.assignedProducts}</Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
    textTransform: "uppercase",
    fontWeight: "ultrabold",
  },
  date: {
    fontSize: 10,
    textAlign: "center",
    color: "gray",
  },
  table: {
    // display: "table",
    width: "auto",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
