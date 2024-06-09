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
  const handleUpdate = async (id) => {
    await fetch(
      `http://localhost:8080/admin/orders/${orders.orderId}/items/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    await fetch(`http://localhost:8080/admin/orders/tables/${tableId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data));
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
          {orders?.orderItemResponseDTO?.map((order) => (
            <div
              key={order.id}
              className="grid grid-cols-4 gap-2 justify-between items-center min-w-[400px] my-2"
            >
              <p>{order.dishName}</p>
              <p>{order.dishQuantity}</p>
              <p>
                {order.dishStatus === "Đang ra món" ||
                order.dishStatus === "Đang chọn"
                  ? "x"
                  : "+"}
              </p>
              <Button
                variant="contained"
                disabled={order.dishStatus === "Đã ra món"}
                onClick={() => handleUpdate(order.orderItemId)}
              >
                Cập nhật
              </Button>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default OrderComponent;
