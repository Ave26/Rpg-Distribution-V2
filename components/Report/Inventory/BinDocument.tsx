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

interface BinDocumentProps {
  inventory: InventoryBins[];
}

const BinDocument: React.FC<BinDocumentProps> = ({ inventory }) => {
  const Titles = [
    "Category",
    "Product Name",
    "Bin Location",
    "SKU",
    "Date Info",
    "Quantity",
    // "Total Quantity",
  ];

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
            {Titles.map((title, i) => (
              <Text key={i} style={[styles.cell, styles.header]}>
                {title}
              </Text>
            ))}
          </View>

          {/* Inventory Rows */}
          {inventory.map((item, i) => {
            const { row, shelfLevel, rackName, count, category } = item.bin;

            return (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{category}</Text>
                <Text style={styles.cell}>
                  {item.product?.productName ? item.product?.productName : ""}
                </Text>
                <Text style={styles.cell}>
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
                </Text>
                <Text style={styles.cell}>{count}</Text>
                {/* <Text style={styles.cell}>{count}</Text> */}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default BinDocument;

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

// function BinDocument({ inventory }: BinDocumentProps) {
//   const Titles = [
//     "Bin Location",
//     "Sku",
//     "DateInfo",
//     "Quantity",
//     "Total Quantity",
//   ];
//   console.log(inventory);

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.titleSection}>
//           <Text style={styles.title}>Inventory Report: Bin Products</Text>
//           <Text style={styles.date}>
//             Downloaded At {new Date().toLocaleString()}
//           </Text>
//         </View>

//         <Table>
//           <TH style={styles.title}>
//             {Titles.map((title, i) => {
//               return (
//                 <TD key={i}>
//                   <Text
//                     style={{
//                       textAlign: "center",
//                     }}
//                   >
//                     {title}
//                   </Text>
//                 </TD>
//               );
//             })}
//           </TH>
//           {inventory.map((v, i) => {
//             const { row, shelfLevel, rackName } = v.bin;
//             return (
//               <TR key={i} style={styles.tableCell}>
//                 <TD>
//                   {rackName}
//                   {row}-{shelfLevel}
//                 </TD>
//                 <TD>{v.product?.skuCode}</TD>
//                 <TD>
//                   {v.product?.dateInfo.date.toISOString().slice(0, 10)}:{" "}
//                   {v.product?.dateInfo.type}
//                 </TD>
//                 <TD>{v.bin.count}</TD>
//                 <TD>{v.bin.count}</TD>
//               </TR>
//             );
//           })}
//         </Table>

//         {/* <View style={styles.table}>
//           <View style={styles.sectionHeader}>
//             {Titles.map((title, i) => {
//               return (
//                 <Text key={i} style={styles.tableColHeader}>
//                   {title}
//                 </Text>
//               );
//             })}
//           </View>
//           {inventory.map((v, i) => {
//             const { row, shelfLevel, rackName } = v.bin;
//             return (
//               <View key={i}>
//                 <Text style={styles.tableColHeader}>
//                   {rackName}
//                   {row}-{shelfLevel}
//                 </Text>
//               </View>
//             );
//           })}
//           {inventory.map((v, i) => {
//             const { row, shelfLevel, rackName } = v.bin;
//             return (
//               <View key={i}>
//                 <Text style={styles.tableColHeader}>
//                   {rackName}
//                   {row}-{shelfLevel}
//                 </Text>
//               </View>
//             );
//           })}
//         </View> */}
//       </Page>
//     </Document>
//   );
// }

// export default BinDocument;
