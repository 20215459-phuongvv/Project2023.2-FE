/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";

const OrderComponent = ({ tableId, children }) => {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8080/admin/orders/tables/${tableId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [tableId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log(orders);
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
          {orders?.orderItemResponseDTO?.map((order) => (
            <div
              key={order.id}
              className="flex gap-2 justify-between items-center min-w-[300px]"
            >
              <p>{order.dishName}</p>
              <p>{order.dishQuantity}</p>
              <p>{order.dishStatus === "Đang ra món" ? "x" : "+"}</p>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default OrderComponent;
