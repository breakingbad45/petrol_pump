// @ts-nocheck
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable";

const printReport = (tickets,season,sale,company) => {

  const tableColumn = ["SL", "GROUP", "SALE", "FACTORY", "BROKERS", "KAFORM","TOTAL.INV" ,"TOTAL BAG", "TOTAL QTY", "CATEGORY"];
  const tableRows = [];

  let totalNetTotal = 0;

  tickets.forEach((ticket, i) => {
    const ticketData = [
      i + 1,
      ticket.group,
      ticket.sale_number,
      ticket.factory,
      ticket.brokers,
      ticket.kaform,
      ticket.total_invoice,
      ticket.inbagqty,
      ticket.inkg,
      ticket.category,
    ];

    totalNetTotal += ticket.Grand_total;
    tableRows.push(ticketData);
  });


  const totalRow = ["Total", "", "", "", "", "","", totalNetTotal.toFixed(2) +' kg', "", ""];
  tableRows.push(totalRow);
  // e.preventDefault();

  // let doc = new jsPDF("p", "mm", [350, 250]);
  let doc = new jsPDF({
    orientation: "landscape",
  });
  doc.setFontSize(10);

  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
  const cen = pageWidth / 2;
  const Line = pageWidth - 15;


 

  doc.autoTable({
    startY:35,
    margin: { bottom: 20 },
    head: [tableColumn],
    body: tableRows,
    didDrawPage: function (data) {
      // Reseting top margin. The change will be reflected only after print the first page.
      data.settings.margin.top = 35;
      data.settings.margin.bottom = 20; },
    theme: "striped",
    headStyles: {
      halign:'center',
      textColor:'white',
      fillColor: 'limegreen',
    },
    // styles: { font: "WorkSans" },
  
    
    columnStyles: {
      0: { halign: "right", textColor:'black', fontSize: 10,},
      1: { halign: "center", textColor: 'black', fontSize: 10,},
      2: { halign: "left", textColor: 'black', fontSize: 10,},
     
      6: { halign: "center",},
      7: { halign: "right",},
      8: { halign: "right",},
     
    },
    bodyStyles: { lineColor: [0, 0, 0] },
    tableWidth: "auto",
    columnWidth: "wrap",
    showHeader: "everyPage",
    tableLineColor: 200,
    tableLineWidth: 0,
  });
  
  const logoSrc = "/assets/img/logo.png";

  // Calculate the position and size of the logo
  const logoWidth = 16; // Adjust as needed
  const logoHeight = 16; // Adjust as needed
  const margin = 10; // Margin from the top left corner

  // Add the logo to each page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.addImage(logoSrc, "png", 20, margin, logoWidth, logoHeight);
  }
  // const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    autoTable(doc, {
      startY: 3,
      body: [
        [
          {
            content: `${company}`,
            styles: {
              halign: "center",
              fontSize: 16,
              fontStyle: "bold",
              // font: "WorkSans",
            },
          },
        ],
      ],
      theme: "plain",
      
    });
    autoTable(doc, {
  margin: { bottom: 40 },
      startY: 10,
      body: [
        [
          {
            content:
             `Season: ${season}`+
             `\nSale: ${sale}`+
             "\n (Sold list lot wise)",

            styles: {
              halign: "center",
              fontSize: 10,
              // font: "WorkSans",
            },
          },
        ],
      ],
      theme: "plain",
    });
  
  // doc.setLineWidth(1.5);
  doc.setDrawColor(0, 0, 0);
  doc.line(15, 30, Line, 30);
  doc.setLineWidth(0);



    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const footer = `Page ${i} of ${pageCount}`;


    doc.setFont("courier");

    const footerTextLeft = 'This automated report is generated by ittechpointbd';

  doc.setFontSize(12);

  // Add the left text at the beginning of the line
  doc.text(10, doc.internal.pageSize.height - 10, footerTextLeft);

  // Add the right text at the end of the line
 
  const textWidth = doc.getStringUnitWidth(footer)+25 ;

  doc.text(pageWidth - 10 - textWidth, doc.internal.pageSize.height - 10, footer);
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    doc.text("" + dateTime, pageWidth - doc.getTextWidth(dateTime) - 20, 5);
  }
  doc.setProperties({
    title: "Lot Wise Sold",
  });
  // doc.setFont('courier');
  doc.output("dataurlnewwindow");
};

export default printReport;