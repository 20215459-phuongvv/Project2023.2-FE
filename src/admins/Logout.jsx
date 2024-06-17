import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import React from 'react';
import PrivateMessageAlert from "../components/admin/PrivateMessageAlert";
const Logout = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <div className="w-full h-[calc(100vh_-_100px)] flex justify-center items-center">
      <PrivateMessageAlert />
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-xl">Admin</h2>
        <h3 className="text-lg">admin@gmail.com</h3>
        <Button variant="contained" onClick={handleClickOpen}>
          Logout
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bạn có muốn đăng xuất?"}
          </DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions className="flex justify-between">
            <Button onClick={handleClose}>Không</Button>
            <Button onClick={handleLogout} autoFocus>
              Có
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Logout;
