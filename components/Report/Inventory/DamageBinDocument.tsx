import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  PDFViewer,
  StyleSheet,
} from "@react-pdf/renderer";
// import styles from "@/styles/ReportSheet";
import { InventoryBins } from "@/pages/api/inventory/bins/find";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import { AssignedProducts } from "@/pages/api/inventory/assigned-products/find";

interface BinDocumentProps {
  //   inventory: InventoryBins[];
  products: AssignedProducts[];
}

const DamageBinDocument: React.FC<BinDocumentProps> = ({ products }) => {
  console.log(products);
  const Titles = [
    "Category",
    "Position",
    "PO",
    "Quantity",
    "Action",
    "Purchase Type | Code",
    "Damage Bin ID",
    // "SKU",
    // "Date Info",
    // "Quantity",
    // "Total Quantity",
  ];
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Inventory Report: Damage Bin Products
          </Text>
          <Text style={styles.date}>
            Downloaded At {new Date().toLocaleString()}
          </Text>
        </View>

        {products.map((p, i) => {
          return (
            <View key={i} style={styles.table}>
              <View
                style={[
                  styles.row,
                  { backgroundColor: "#f0f0f0" },
                  styles.header,
                ]}
              >
                <Text style={[styles.cell, styles.header]}>
                  {p.productName} | {p.skuCode}
                </Text>
              </View>
              <View style={[styles.row, { backgroundColor: "#f0f0f0" }]}>
                {Titles.map((title, i) => (
                  <Text key={i} style={[styles.cell, styles.header]}>
                    {title}
                  </Text>
                ))}
              </View>
              {p.damageBins.map((item, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.cell}>{item.category}</Text>
                  <Text style={styles.cell}>
                    {item.row}-{item.shelf}
                  </Text>
                  <Text style={[styles.cell, { marginVertical: "2" }]}>
                    {item.purchaseOrder.map((v) => v)}
                  </Text>
                  <Text style={[styles.cell, { marginVertical: "2" }]}>
                    {item.count}
                  </Text>
                  <Text style={[styles.cell, { marginVertical: "2" }]}>
                    {item.action}
                  </Text>
                  <Text style={[styles.cell, { marginVertical: "2" }]}>
                    {item.action}
                  </Text>
                  <Text style={[styles.cell, { marginVertical: "2" }]}>
                    {item.id}
                  </Text>
                  {/* <Text style={[styles.cell, { marginVertical: "2" }]}>
                    {item.SO ? item.SO : ""}
                  </Text> */}
                </View>
              ))}
            </View>
          );
        })}
        {/* <View style={styles.table}>
          <View
            style={[styles.row, { backgroundColor: "#f0f0f0" }, styles.header]}
          >
            <Text style={[styles.cell, styles.header]}>
              Table 1: Product Information
            </Text>
          </View>
          <View style={[styles.row, { backgroundColor: "#f0f0f0" }]}>
            {Titles.map((title, i) => (
              <Text key={i} style={[styles.cell, styles.header]}>
                {title}
              </Text>
            ))}
          </View>
          {products.map((item, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.cell}>{item.category || "N/A"}</Text>
              <Text style={styles.cell}>{item.rackLocation || "N/A"}</Text>
            </View>
          ))}
        </View> */}
      </Page>
    </Document>
  );
};

export default DamageBinDocument;

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
{
  /* <Text style={styles.cell}>
                  {rackName}
                  {row}-{shelfLevel}
                </Text>
                <Text style={styles.cell}>
                  {item.product?.skuCode || "N/A"}
                </Text>
                <Text style={styles.cell}>
                  {item.product?.dateInfo.date.toISOString().slice(0, 10) ||
                    "N/A"}
                  : {item.product?.dateInfo.type || "N/A"}
                </Text> */
}
