import React from 'react';

function TableList({ setSelectedTable,selectedTable }) {
    const tables = [
        "TAKEAWAY",
        "AC01", "AC02", "AC03", "AC04", "AC05", "AC06", "AC07", "AC08",
        "SHED01", "SHED02", "SHED03", "SHED04", "SHED05", "SHED06", "SHED07", "SHED08",
        "OUT01", "OUT02", "OUT03", "OUT04", "OUT05", "OUT06", "OUT07", "OUT08"
      ];
      

  return (
    <div className="row table-ids">
      {tables.map((table, index) => (
        <div key={index} className={`table-box ${selectedTable === table ? 'selectedtable' : ''}`}  onClick={() => setSelectedTable(table)}>
          {table}
        </div>
      ))}
    </div>
  );
}

export default TableList;
