/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

const FormTable = ({ setStatus, table }) => {
  const [tableName, setTableName] = useState(table?.tableName || "");
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8080/admin/tables${table ? "/" + table.tableId : ""}`,
      {
        method: `${table ? "PUT" : "POST"}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tableName: tableName,
        }),
      }
    );
    const data = await res.json();
    if (data.tableId) {
      setStatus(true);
      setTableName("");
      alert("Thành công");
    } else {
      setStatus(false);
      setTableName("");
      alert(data.message);
    }
  };
  const handleDeleteTable = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8080/admin/tables/${table.tableId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    alert("Xóa bàn thành công");
    setStatus(true);
  };
  return (
    <div>
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        onSubmit={handleSubmitForm}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="Tên bàn"
          name="tableName"
          autoComplete="tableName"
          autoFocus
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
        {table ? (
          <div className="flex gap-2">
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, padding: "1rem" }}
              onClick={handleDeleteTable}
            >
              Xóa
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, padding: "1rem" }}
            >
              Cập nhật
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, padding: "1rem" }}
          >
            Tạo
          </Button>
        )}
      </Box>
    </div>
  );
};

export default FormTable;
