/* eslint-disable no-unused-vars */
import { Button, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import AlertDialog from "../components/DialogComponent";
import FormTable from "../components/admin/FormTable";
import React from "react";
import PrivateMessageAlert from "../components/admin/PrivateMessageAlert";
const Tables = () => {
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState(true);
  useEffect(() => {
    if (status) {
      fetch("http://localhost:8080/admin/tables", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setTables(data));
      setStatus(false);
    }
  }, [status]);
  return (
    <div>
      <PrivateMessageAlert />
      <div className="text-xl font-semibold my-4 flex justify-between">
        <h2>Danh sách bàn</h2>
        <AlertDialog
          component={<FormTable setStatus={setStatus} />}
          title="Thêm bàn"
        >
          <Fab color="secondary" aria-label="edit">
            <EditIcon />
          </Fab>
        </AlertDialog>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {tables.length > 0 &&
          tables.map((table) => (
            <AlertDialog
              className="p-4 flex justify-center items-center bg-slate-300 text-black"
              key={table.tableId}
              component={<FormTable setStatus={setStatus} table={table} />}
              title="Cập nhật bàn"
            >
              <Button
                variant="contained"
                className="p-4 flex justify-center items-center bg-slate-300 text-black"
              >
                {table.tableName}
              </Button>
            </AlertDialog>
          ))}
      </div>
    </div>
  );
};

export default Tables;
