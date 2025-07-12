import { Font, Page, Text, View, Document, StyleSheet, Image, pdf } from "@react-pdf/renderer";

Font.register({
  family: "Play",
  src: "/assets/Play-Bold.ttf",
});

const styles = StyleSheet.create({
  page: { paddingTop: 15, paddingBottom: 40, paddingHorizontal: 40 },

  header: { marginBottom: 20 },
  logoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { width: 140, height: 50, marginRight: 10 },
  companyInfo: { flex: 1, textAlign: "right" },
  companyName: {
    fontSize: 18,
    fontWeight: 900,
    textTransform: "uppercase",
    fontFamily: "Play",
    letterSpacing: 1.5,
  },
  address: { fontSize: 9 },
  contact: { fontSize: 9 },

  accountInfoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  accountInfoLeft: { flex: 1 },
  accountInfoRight: { flex: 1, textAlign: "right" },
  accountLabel: { fontSize: 10, fontWeight: "bold" },
  accountValue: { fontSize: 10 },

  divider: { borderBottomWidth: 1, borderBottomColor: "black", marginVertical: 10 },

  // Table Styles (Box Style)
  tableContainer: { borderWidth: 1, borderColor: "black", marginTop: 10 },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#6A5ACD",
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },

  cell: { fontSize: 10, padding: 5, borderRightWidth: 1, borderRightColor: "black" },

  // Fixed Column Widths
  dateCol: { width: "12%" },
  descCol: { width: "20%" }, // Fixed width for Description
  productCol: { width: "30%" }, // Fixed width for Product
  smallCol: { width: "12%", textAlign: "right" },
  lastCol: { width: "12%", textAlign: "right", borderRightWidth: 0 },

  footer: {
    position: "absolute",
    bottom: 10,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: "black",
  },
});

const BankStatementPDF = () => {
  const data = new Array(10).fill(0).map((_, index) => ({
    date: `2024-02-${(index % 28) + 1}`,
    description: `Transaction ${index + 1}`,
    product: `Product ${index + 1}`,
    payment: index % 2 === 0 ? 500 : 0,
    receive: index % 2 === 1 ? 700 : 0,
    balance: index % 5 === 0 ? 0 : 1000 - index * 50,
  }));

  // Calculate Totals
  const totalPayment = data.reduce((sum, item) => sum + item.payment, 0);
  const totalReceive = data.reduce((sum, item) => sum + item.receive, 0);
  const totalBalance = data.reduce((sum, item) => sum + item.balance, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* HEADER */}
        <View style={styles.header} fixed>
          <View style={styles.logoRow}>
            <Image src="/assets/bashundhara.png" style={styles.logo} />
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>M/S FAHIM TRADERS</Text>
              <Text style={styles.address}>PROP - ALHAJ MOSHAROF HOSSAIN</Text>
              <Text style={styles.address}>SHALBAGAN ROAD, SHAHEBNAGAR</Text>
              <Text style={styles.contact}>01718313460</Text>
            </View>
          </View>

          <View style={styles.divider} fixed></View>

          <View style={styles.accountInfoRow}>
            <View style={styles.accountInfoLeft}>
              <Text style={styles.accountLabel}>MD. JAYED BIN APU</Text>
              <Text style={styles.accountValue}>BHAJANPUR TETULIA</Text>
              <Text style={styles.accountValue}>01796194791</Text>
            </View>
            <View style={styles.accountInfoRight}>
              <Text style={styles.accountLabel}>Print Date: 01-02-2025</Text>
              <Text style={styles.accountLabel}>Period From: 01-01-2025 to 01-02-2025</Text>
              <Text style={styles.accountLabel}>Account Number: 2398377297</Text>
              <Text style={styles.accountLabel}>Customer ID: 239837737</Text>
              <Text style={styles.accountLabel}>Account Type: CUSTOMER</Text>
            </View>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.tableContainer}>
          {/* TABLE HEADER */}
          <View style={styles.tableHeader} fixed>
            <Text style={[styles.cell, styles.dateCol]}>Date</Text>
            <Text style={[styles.cell, styles.descCol]}>Description</Text>
            <Text style={[styles.cell, styles.productCol]}>Product</Text>
            <Text style={[styles.cell, styles.smallCol]}>Ton/ban</Text>
            <Text style={[styles.cell, styles.smallCol]}>Kg/Pcs</Text>
            <Text style={[styles.cell, styles.smallCol]}>Rate</Text>
            <Text style={[styles.cell, styles.smallCol]}>Payment</Text>
            <Text style={[styles.cell, styles.smallCol]}>Receive</Text>
            <Text style={[styles.cell, styles.lastCol]}>Balance</Text>
          </View>

          {/* TABLE CONTENT */}
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.cell, styles.dateCol]}>{item.date}</Text>
              <Text style={[styles.cell, styles.descCol]}>{item.description}</Text>
              <Text style={[styles.cell, styles.productCol]}>{item.product}</Text>
              <Text style={[styles.cell, styles.smallCol]}>{item.payment}</Text>
              <Text style={[styles.cell, styles.smallCol]}>{item.payment}</Text>
              <Text style={[styles.cell, styles.smallCol]}>{item.payment}</Text>
              <Text style={[styles.cell, styles.smallCol]}>{item.payment}</Text>
              <Text style={[styles.cell, styles.smallCol]}>{item.receive}</Text>
              <Text style={[styles.cell, styles.lastCol, item.balance === 0 && { color: "red" }]}>{item.balance}</Text>
            </View>
          ))}

          {/* TOTAL ROW */}
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.dateCol, { fontWeight: "bold" }]}>Total</Text>
            <Text style={[styles.cell, styles.descCol]}></Text>
            <Text style={[styles.cell, styles.productCol]}></Text>
            <Text style={[styles.cell, styles.smallCol, { fontWeight: "bold" }]}>{totalPayment}</Text>
            <Text style={[styles.cell, styles.smallCol]}></Text>
            <Text style={[styles.cell, styles.smallCol]}></Text>
            <Text style={[styles.cell, styles.smallCol]}></Text>
            <Text style={[styles.cell, styles.smallCol, { fontWeight: "bold" }]}>{totalReceive}</Text>
            <Text style={[styles.cell, styles.lastCol, { fontWeight: "bold" }]}>{totalBalance}</Text>
          </View>
        </View>

        {/* FOOTER */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

const openPDF = async () => {
  const doc = <BankStatementPDF />;
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

const BankStatementView = () => <button onClick={openPDF}>View PDF</button>;

export default BankStatementView;
