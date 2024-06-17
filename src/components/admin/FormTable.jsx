/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";

const FormTable = ({ setStatus, table }) => {
  const [tableName, setTableName] = useState(table?.tableName || "");
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleDeleteTable = async () => {
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
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
              onClick={handleOpenDialog}
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn chắc chắn muốn xóa bàn chứ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hành động này sẽ không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleDeleteTable} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormTable;
