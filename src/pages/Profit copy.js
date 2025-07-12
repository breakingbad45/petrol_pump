import React, { useState } from "react";

const data = [
  { id: 1, particular: "cash", payment: 200, receive: 0, type: "expense" },
  { id: 2, particular: "cash", payment: 0, receive: 10, type: "expense" },
  { id: 3, particular: "cash", payment: 100, receive: 0, type: "expense" },
  { id: 4, particular: "cash", payment: 0, receive: 500, type: "client" },
  { id: 5, particular: "cash", payment: 0, receive: 500, type: "client" },
];

const salesAndPurchases = [
  { id: 1, sell_type: "sale", bill_type: "cash", client: "cash sale", amount: 1000 },
  { id: 2, sell_type: "sale", bill_type: "credit", client: "jayed", amount: 1000 },
  { id: 3, sell_type: "sale", bill_type: "credit", client: "jayed", amount: 1000 },
  { id: 4, sell_type: "pur", bill_type: "cash", client: "cash pur", amount: 1000 },
  { id: 5, sell_type: "pur", bill_type: "credit", client: "jayed", amount: 1000 },
];

const openingBalance = 1000; // Define the opening balance

const GroupedTable = () => {
  const [expanded, setExpanded] = useState(null);
  const [expandedSalesAndPurchases, setExpandedSalesAndPurchases] = useState(null);

  // Group data by type
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = { payment: 0, receive: 0, items: [] };
    }
    acc[item.type].payment += item.payment;
    acc[item.type].receive += item.receive;
    acc[item.type].items.push(item);
    return acc;
  }, {});

  // Group sales and purchases
  const groupedSalesAndPurchases = salesAndPurchases.reduce((acc, item) => {
    const key = `${item.sell_type}_${item.bill_type}`;
    if (!acc[key]) {
      acc[key] = { total: 0, items: [] };
    }
    acc[key].total += item.amount;
    acc[key].items.push(item);
    return acc;
  }, {});

 // Calculate totals
 const totalCashSales = salesAndPurchases
 .filter((item) => item.sell_type === "sale" && item.bill_type === "cash")
 .reduce((sum, item) => sum + item.amount, 0);

const totalCashPurchases = salesAndPurchases
 .filter((item) => item.sell_type === "pur" && item.bill_type === "cash")
 .reduce((sum, item) => sum + item.amount, 0);

const transactionPayment = data.reduce((sum, item) => sum + item.payment, 0);
const transactionReceive = data.reduce((sum, item) => sum + item.receive, 0);

const totalPayment = totalCashPurchases + transactionPayment;
const totalReceive = totalCashSales + transactionReceive;
const cashInHand = openingBalance + totalReceive - totalPayment;
  const totalWithOpening = openingBalance + totalReceive;

  const toggleAccordion = (type) => {
    setExpanded(expanded === type ? null : type);
  };

  const toggleSalesAndPurchasesAccordion = (key) => {
    setExpandedSalesAndPurchases(expandedSalesAndPurchases === key ? null : key);
  };

  return (
    <div className="box box-primary">
      <div className="box-header with-border">
        <h3 className="box-title">Grouped Table</h3>
      </div>
      <div className="box-body">
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>SL</th>
              <th>Type</th>
              <th>Payment</th>
              <th>Receive</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-warning">
              <td colSpan="3" className="text-right">
                Opening Balance
              </td>
              <td>{openingBalance}</td>
            </tr>
            {Object.entries(groupedSalesAndPurchases).map(([key, group], index) => (
              <React.Fragment key={key}>
                <tr
                  className="info"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSalesAndPurchasesAccordion(key)}
                >
                  <td>{index + 1}</td>
                  <td>{key.replace("_", " ").toUpperCase()}</td>
                  <td>
                    {key.includes("pur") || key.includes("credit") ? group.total : 0}
                  </td>
                  <td>
                    {key.includes("sale") || key.includes("credit") ? group.total : 0}
                  </td>
                </tr>
                {expandedSalesAndPurchases === key &&
                  group.items.map((item, subIndex) => (
                    <tr key={item.id}>
                      <td className="text-right">{index + 1}.{subIndex + 1}</td>
                      <td>{item.client}</td>
                      <td>
                        {key.includes("pur") || key.includes("credit")
                          ? item.amount
                          : 0}
                      </td>
                      <td>
                        {key.includes("sale") || key.includes("credit")
                          ? item.amount
                          : 0}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
            {Object.entries(groupedData).map(([type, group], index) => (
              <React.Fragment key={type}>
                <tr
                  className="info"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleAccordion(type)}
                >
                  <td>{index + 1}</td>
                  <td>{type}</td>
                  <td>{group.payment}</td>
                  <td>{group.receive}</td>
                </tr>
                {expanded === type &&
                  group.items.map((item, subIndex) => (
                    <tr key={item.id}>
                      <td className="text-right">{index + 1}.{subIndex + 1}</td>
                      <td>{item.particular}</td>
                      <td>{item.payment}</td>
                      <td>{item.receive}</td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-light">
              <td colSpan="2" className="text-right">Total</td>
              <td>{totalPayment}</td>
              <td>{totalReceive}</td>
            </tr>
            <tr className="bg-light">
              <td colSpan="3" className="text-right">Opening + Total Receive</td>
              <td>{totalWithOpening}</td>
            </tr>
            <tr className="bg-light">
              <td colSpan="3" className="text-right">Cash in Hand</td>
              <td>{cashInHand}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default GroupedTable;
