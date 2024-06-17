/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { convertToTime } from "../../assets/time";

const NotificationComponent = ({ children, tableId, setStatus }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotionfications] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8080/admin/notifications/tables/${tableId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotionfications(data));
  }, [tableId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDeteleAll = async () => {
    await fetch(`http://localhost:8080/admin/notifications/tables/${tableId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setOpen(false);
    setStatus(true);
    setNotionfications([]);
  };

  return (
    <Fragment>
      <div onClick={handleClickOpen}>{children}</div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Thông báo"}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col">
            {notifications.map((notification, index) => (
              <div
                className="flex gap-2 min-w-[570px] justify-between"
                key={index}
              >
                <span>{index + 1}.</span>
                <span>{notification.text}</span>
                <span>{convertToTime(notification.notificationTime)}</span>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          <Button onClick={handleDeteleAll} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default NotificationComponent;
