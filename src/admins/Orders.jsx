import { useEffect, useState } from "react";
import TableComponent from "../components/admin/TableComponent";
import { Button } from "@mui/material";

const Order = () => {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([]);
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState(true);
  const [tableStatus, setTableStatus] = useState("Đang order");
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
          setData(data);
          setTables(() => {
            return data.filter((table) => table?.tableStatus === tableStatus);
          });
        });
      setStatus(false);
    }
  }, [status]);

  const handleClick = (status) => {
    if (data.length > 0) {
      setTableStatus(status);
      setTables(() => {
        return data.filter((table) => table?.tableStatus === status);
      });
    }
  };
  const quantity = (status) => {
    if (data.length > 0) {
      return data.filter((table) => table?.tableStatus === status).length;
    }
    return 0;
  };

  return (
    <div className="h-full">
      <div className="flex justify-between p-4 bg-slate-800">
        <Button
          variant={tableStatus === "Đang order" ? "contained" : "outlined"}
          onClick={() => handleClick("Đang order")}
        >
          Các bàn đang order ({quantity("Đang order")})
        </Button>
        <Button
          variant={tableStatus === "Đang phục vụ" ? "contained" : "outlined"}
          onClick={() => handleClick("Đang phục vụ")}
        >
          Các bàn đang phục vụ ({quantity("Đang phục vụ")})
        </Button>
        <Button
          variant={
            tableStatus === "Đang yêu cầu thanh toán" ? "contained" : "outlined"
          }
          onClick={() => handleClick("Đang yêu cầu thanh toán")}
        >
          Các bàn đang yêu cầu thanh toán ({quantity("Đang yêu cầu thanh toán")}
          )
        </Button>
        <Button
          variant={tableStatus === "Đã thanh toán" ? "contained" : "outlined"}
          onClick={() => handleClick("Đã thanh toán")}
        >
          Các bàn đã thanh toán ({quantity("Đã thanh toán")})
        </Button>
        <Button
          variant={tableStatus === "Đang trống" ? "contained" : "outlined"}
          onClick={() => handleClick("Đang trống")}
        >
          Các bàn đang trống ({quantity("Đang trống")})
        </Button>
      </div>
      <div className="">
        <div className="border min-h-[calc(100vh_-_220px)]">
          <div className="grid grid-cols-3">
            {tables?.map((table) => (
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
