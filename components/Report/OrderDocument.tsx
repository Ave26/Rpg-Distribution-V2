// components/MyDocument.js
import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { TReportData } from "@/pages/api/generateReport";
import {
  assignedProducts,
  binLocations,
  orderedProductsTest,
  products,
  records,
  stockKeepingUnit,
} from "@prisma/client";
import MyDocument from "../MyDocument";

Font.register({
  family: "OpenSans",
  src: "https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf",
});

Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5Q.ttf",
});

interface TableRow {
  barcode: string;
  description: string;
  sku: string;
  bin: string;
  quantity: number;
  remarks: string;
}

type TOrderReportProps = {
  record: TRecordPick | null;
};

type TRecordPick = Pick<
  TRecord,
  "POO" | "_count" | "clientName" | "dateCreated" | "id" | "orderedProductsTest"
>;

type TRecord = records & {
  _count: { orderedProductsTest: number };
  orderedProductsTest: TOrderedProductsTestPick[];
};

type TOrderedProductsTest = orderedProductsTest & {
  binLocations: TBinLocationsPick[];
};

type TBinLocations = binLocations & {
  stockKeepingUnit: TStockKeepingUnitPick | null;
};

type TStockKeepingUnit = stockKeepingUnit & {
  products: TProductsPick | null;
};

type TProductsPick = Pick<products, "price">;

type TStockKeepingUnitPick = Pick<TStockKeepingUnit, "products">;

type TBinLocationsPick = Pick<TBinLocations, "stockKeepingUnit" | "quantity">;

type TOrderedProductsTestPick = Pick<TOrderedProductsTest, "binLocations">;

export default function OrderReport({ record }: TOrderReportProps) {
  const Titles = [
    "Order Id",
    "Customer Name",
    "Order Date",
    "Total Items",
    "Total Quantity",
    "Total Amount",
  ];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Details for Customer Order: {record?.id}
          </Text>
          <Text style={styles.date}>
            Downloaded At {new Date().toLocaleString()}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.sectionHeader}>
            {Titles.map((title, i) => {
              return (
                <Text key={i} style={styles.tableColHeader}>
                  {title}
                </Text>
              );
            })}
          </View>

          <View style={styles.tableRow}>
            <Text
              style={[
                styles.tableCol,
                { flexDirection: "column" },
                styles.productDetails,
              ]}
            >
              {record?.id}
            </Text>

            <Text
              style={[
                styles.tableCol,
                { flexDirection: "column" },
                styles.productDetails,
              ]}
            >
              {record?.clientName}
            </Text>
            <Text
              style={[
                styles.tableCol,
                { flexDirection: "column" },
                styles.productDetails,
              ]}
            >
              {record?.dateCreated?.toLocaleString()}
              <Text
                style={[
                  styles.tableCol,
                  { flexDirection: "column" },
                  styles.productDetails,
                ]}
              >
                {record?._count.orderedProductsTest}
              </Text>
            </Text>
            <Text
              style={[
                styles.tableCol,
                { flexDirection: "column" },
                styles.productDetails,
              ]}
            >
              {record?._count.orderedProductsTest}
            </Text>
            <Text
              style={[
                styles.tableCol,
                { flexDirection: "column" },
                styles.productDetails,
              ]}
            >
              {record?.orderedProductsTest.reduce((acc, initial) => {
                return (
                  acc +
                  initial.binLocations.reduce((acc, initial) => {
                    return acc + initial.quantity;
                  }, 0)
                );
              }, 0)}
            </Text>
            <Text
              style={[
                styles.tableCol,
                { flexDirection: "column" },
                styles.productDetails,
              ]}
            >
              ₱
              {record?.orderedProductsTest
                .reduce((acc, initial) => {
                  return (
                    acc +
                    initial.binLocations.reduce((acc, initial) => {
                      const price =
                        initial.stockKeepingUnit?.products?.price || 0;

                      const totalPrice = price * initial.quantity;
                      return acc + totalPrice;
                    }, 0)
                  );
                }, 0)
                .toLocaleString()}
            </Text>
          </View>
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
    fontSize: 15,
    fontFamily: "OpenSans",
  },
  date: {
    fontSize: 10,
    // fontFamily: "OpenSans",
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
    maxWidth: "33%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    textAlign: "center",
    padding: 5,
    fontSize: 10,
    marginBottom: 2,
    // fontFamily: "OpenSans",
  },
  tableCol: {
    width: "17%",
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
    fontSize: 10,
    fontFamily: "OpenSans",
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 10,
    fontFamily: "Roboto",
    color: "#555",
  },
  sectionHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderBottom: "1 solid #bfbfbf",
    fontFamily: "OpenSans",
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "OpenSans",
  },
});
