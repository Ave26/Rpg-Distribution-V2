import { StyleSheet } from "@react-pdf/renderer";

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
    fontSize: 11,
    fontFamily: "Roboto",
    fontWeight: "ultrabold",
    textTransform: "uppercase",
    // textAlign: "center",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
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
    fontWeight: "ultrabold",
    fontSize: 10,
  },
  headerText: {
    fontSize: 10,
    fontWeight: "ultrabold",
    textTransform: "uppercase",
    fontFamily: "OpenSans",
  },
});

export default styles;
