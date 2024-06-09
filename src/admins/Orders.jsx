import { useEffect, useState } from "react";
import TableComponent from "../components/admin/TableComponent";

const Order = () => {
  // eslint-disable-next-line no-unused-vars
  const [tables, setTables] = useState([]);
  const [tableActive, setTableActive] = useState([]);
  const [tableDone, setTableDone] = useState([]);
  const [tableEmpty, setTableEmpty] = useState([]);
  const [tableService, setTableService] = useState([]);
  const [tableOrdering, setTableOrdering] = useState([]);
  const [tablePaid, setTablePaid] = useState([]);
  const [status, setStatus] = useState(true);
  useEffect(() => {
    if (status) {
      fetch("http://localhost:8080/admin/tables", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTables(data);
          setTableActive(
            data.filter((table) => table.tableStatus !== "Đang trống")
          );
          setTableDone(
            data.filter(
              (table) => table.tableStatus === "Đang yêu cầu thanh toán"
            )
          );
          setTableEmpty(
            data.filter((table) => table.tableStatus === "Đang trống")
          );
          setTableService(
            data.filter((table) => table.tableStatus === "Đang phục vụ")
          );
          setTableOrdering(
            data.filter((table) => table.tableStatus === "Đang order")
          );
          setTablePaid(
            data.filter((table) => table.tableStatus === "Đã thanh toán")
          );
        });
      setStatus(false);
    }
  }, [status]);

  return (
    <div className="h-full">
      <div className="text-xl font-semibold my-4 flex justify-between">
        <h2>All Orders</h2>
      </div>
      <div className="">
        <div className="border h-full">
          <span className="text-2xl font-semibold">
            Các bàn đang hoạt động {tableActive.length}
          </span>
          <div className="grid grid-cols-5">
            {tableActive.map((table) => (
              <TableComponent
                setStatus={setStatus}
                key={table.tableId}
                table={table}
              />
            ))}
          </div>
        </div>
        <div className="border h-full">
          <span className="text-2xl font-semibold">
            Các bàn đang order {tableOrdering.length}
          </span>
          <div className="grid grid-cols-5">
            {tableOrdering.map((table) => (
              <TableComponent
                setStatus={setStatus}
                key={table.tableId}
                table={table}
              />
            ))}
          </div>
        </div>
        <div className="border h-full">
          <span className="text-2xl font-semibold">
            Các bàn đang phục vụ {tableService.length}
          </span>
          <div className="grid grid-cols-5">
            {tableService.map((table) => (
              <TableComponent
                setStatus={setStatus}
                key={table.tableId}
                table={table}
              />
            ))}
          </div>
        </div>
        <div className="border h-full">
          <span className="text-2xl font-semibold">
            Các bàn đang yêu cầu thanh toán {tableDone.length}
          </span>
          <div className="grid grid-cols-5">
            {tableDone.map((table) => (
              <TableComponent
                setStatus={setStatus}
                key={table.tableId}
                table={table}
              />
            ))}
          </div>
        </div>
        <div className="border h-full">
          <span className="text-2xl font-semibold">
            Các bàn đã thanh toán {tablePaid.length}
          </span>
          <div className="grid grid-cols-5">
            {tablePaid.map((table) => (
              <TableComponent
                setStatus={setStatus}
                key={table.tableId}
                table={table}
              />
            ))}
          </div>
        </div>
        <div className="border h-full">
          <span className="text-2xl font-semibold">
            Các bàn đang trống {tableEmpty.length}
          </span>
          <div className="grid grid-cols-5">
            {tableEmpty.map((table) => (
              <TableComponent
                setStatus={setStatus}
                key={table.tableId}
                table={table}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
