/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";

const FormMenu = ({ setStatus, menu }) => {
  const [menuName, setMenuName] = useState(menu?.menuTitle || "");
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8080/admin/menus${menu ? "/" + menu.menuId : ""}`,
      {
        method: `${menu ? "PUT" : "POST"}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          menuTitle: menuName,
        }),
      }
    );
    const data = await res.json();
    if (data.menuId) {
      alert("Thành công");
      setStatus(true);
    } else {
      setStatus(false);
      alert(data.message);
    }
  };

  const handleDeleteMenu = async () => {
    const res = await fetch(
      `http://localhost:8080/admin/menus/${menu.menuId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setStatus(true);
    alert("Xóa thực đơn thành công");
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      className="flex flex-col gap-2 min-w-[500px] mt-2"
      component="form"
      noValidate
      sx={{ mt: 1 }}
      onSubmit={handleSubmitForm}
    >
      <TextField
        type="text"
        placeholder="Tên menu..."
        label="Tên menu"
        value={menuName}
        onChange={(e) => setMenuName(e.target.value)}
      />
      {menu ? (
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn chắc chắn muốn xóa thực đơn chứ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hành động này sẽ không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleDeleteMenu} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormMenu;
