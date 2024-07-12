import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatDatePdf } from "../lib/dateFormat";
import { Transaction } from "../lib/interfaces";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cell: {
    padding: 5,
    textAlign: "center",
  },
  // Adjust flex values to control column widths
  amountCell: {
    flex: 1,
  },
  dateCell: {
    flex: 3,
  },
  typeCell: {
    flex: 0.7,
  },
  detailsCell: {
    flex: 3,
  },
  borderRight: {
    borderRight: "1px solid black",
  },
  borderLeft: {
    borderLeft: "1px solid black",
  },
  borderBottom: {
    borderBottom: "1px solid black",
  },
  borderTop: {
    borderTop: "1px solid black",
  },
  summaryContainer: {
    marginTop: 20,
    flexDirection: "column",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  marginTop:{
    marginTop:20,
    paddingVertical:8
  }
});

const GeneratePdf = (
  transactions: Transaction[],
  totalIncome: number,
  totalExpense: number,
  balance: number,
  title:string
) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Transactions Report</Text>
      <Text style={styles.subHeader}>{title}</Text>
      <View style={[styles.tableHeader, styles.borderBottom, styles.borderTop]}>
        <Text style={[styles.cell, styles.amountCell, styles.borderLeft, styles.borderRight]}>Amount</Text>
        <Text style={[styles.cell, styles.typeCell, styles.borderRight]}>Type</Text>
        <Text style={[styles.cell, styles.detailsCell, styles.borderRight]}>Details</Text>
        <Text style={[styles.cell, styles.dateCell, styles.borderRight]}>Date</Text>
      </View>
      {transactions.map((transaction, index) => (
        <View key={index} style={[styles.tableRow, styles.borderBottom]}>
          <Text style={[styles.cell, styles.amountCell, styles.borderLeft, styles.borderRight]}>{transaction.amount}</Text>
          <Text style={[styles.cell, styles.typeCell, styles.borderRight]}>
            {transaction.type === "Income" ? "+" : "-"}
          </Text>
          <Text style={[styles.cell, styles.detailsCell, styles.borderRight]}>
            {transaction.type === "Income"
              ? transaction.User?.name || ""
              : transaction.note || ""}
          </Text>
          <Text style={[styles.cell, styles.dateCell, styles.borderRight]}>
            {transaction.type === "Income"
              ? `${formatDatePdf(transaction.fromDate?.toString())} - ${formatDatePdf(transaction.toDate?.toString())}`
              : formatDatePdf(transaction.date.toString())}
          </Text>
        </View>
      ))}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Total Income:</Text>
          <Text style={styles.summaryText}>{totalIncome}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Total Expense:</Text>
          <Text style={styles.summaryText}>{totalExpense}</Text>
        </View>
        <View style={[styles.summaryRow,styles.marginTop, styles.borderTop]}>
          <Text style={styles.summaryText}>Balance:</Text>
          <Text style={styles.summaryText}>{balance}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default GeneratePdf;
