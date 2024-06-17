/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import $ from 'jquery';

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

  useEffect(() => {
    const poll = () => {
      $.ajax({
        url: 'http://localhost:8080/orders/updates',
        method: 'GET',
        success: (updatedOrderItem) => { // Change variable name to indicate it's an order item
          if (updatedOrderItem) {
            setOrders(prevOrders => prevOrders.map(order =>
              order.orderItemId === updatedOrderItem.orderItemId ? updatedOrderItem : order
            ));
          }
          poll();
        },
        error: () => {
          setTimeout(poll, 5000); // Retry after 5 seconds on error
        }
      });
    };
    poll();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async (id) => {
    try {
      const updatedOrderItem = await fetch(
        `http://localhost:8080/admin/orders/${orders.orderId}/items/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then(res => res.json());
  
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderItemId === updatedOrderItem.orderItemId
            ? { ...order, dishStatus: updatedOrderItem.dishStatus } // Update dishStatus of the matched order item
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order item status:", error);
    }
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
        <DialogTitle id="alert-dialog-title">{"Chi tiết đơn hàng"}</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-5 gap-2 justify-between items-center my-2 font-semibold">
            <p>Tên món</p>
            <p className="text-center">Số lượng</p>
            <p>Ghi chú</p>
            <p>Trạng thái</p>
            <p>Ra món</p>
          </div>
          {orders?.orderItemResponseDTO?.map((order) => (
            <div
              key={order.orderItemId}
              className="grid grid-cols-5 gap-2 justify-between items-center my-2"
            >
              <p>{order.dishName}</p>
              <p className="text-center">{order.dishQuantity}</p>
              <p>{order.dishNote}</p>
              <p>{order.dishStatus}</p>
              <Button
                variant="contained"
                disabled={order.dishStatus === "Đã ra món" || order.dishStatus === "Đang chọn"}
                onClick={() => handleUpdate(order.orderItemId)} // Pass orderItemId to handleUpdate
              >
                Ra món
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
