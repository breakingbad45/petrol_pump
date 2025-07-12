import React from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";

const DataTable = ({ id, columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <div className="box-body">
      <div className="box-body table-responsive no-padding">
        <div className="pagination-container">
          <div className="pagination-top">
            <div className="row">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>
        <table
          id={id}
          className="table table-bordered table-striped dataTable dtr-inline"
          {...getTableProps()}
        >
          <thead style={{ background: "#a4bfb6" }}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination-container">
          <div className="pagination-bottom">
            <ul className="pagination" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: "100%" }}>
              <li key="previous" className={`paginate_button page-item ${!canPreviousPage ? 'disabled' : ''}`}>
                <a
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className="page-link"
                  tabIndex="0"
                >
                  Previous
                </a>
              </li>
              <div>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>
              </div>
              <li key="next" className={`paginate_button page-item ${!canNextPage ? 'disabled' : ''}`}>
                <a
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                  className="page-link"
                  tabIndex="0"
                >
                  Next
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
