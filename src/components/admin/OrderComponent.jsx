import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import $ from "jquery";

const OrderComponent = ({ tableId, children }) => {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState({ orderItemResponseDTO: [] });
  const [newQuantity, setNewQuantity] = useState(""); // State for new quantity

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
        url: "http://localhost:8080/orders/updates",
        method: "GET",
        success: (updatedOrderItem) => {
          if (updatedOrderItem) {
            setOrders((prevOrders) => {
              const updatedOrderItems = prevOrders.orderItemResponseDTO.map(
                (orderItem) =>
                  orderItem.orderItemId === updatedOrderItem.orderItemId
                    ? updatedOrderItem
                    : orderItem
              );
              return {
                ...prevOrders,
                orderItemResponseDTO: updatedOrderItems,
              };
            });
          }
          poll();
        },
        error: () => {
          setTimeout(poll, 5000); // Retry after 5 seconds on error
        },
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
      const response = await fetch(
        `http://localhost:8080/admin/orders/${orders.orderId}/items/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedOrderItem = await response.json();

      setOrders((prevOrders) => {
        const updatedOrderItems = prevOrders.orderItemResponseDTO.map(
          (orderItem) =>
            orderItem.orderItemId === updatedOrderItem.orderItemId
              ? {
                  ...orderItem,
                  dishName: updatedOrderItem.dish.dishName,
                  dishQuantity: updatedOrderItem.dishQuantity,
                  customPrice: updatedOrderItem.customPrice,
                  dishNote: updatedOrderItem.dishNote,
                  dishStatus: updatedOrderItem.dishStatus,
                }
              : orderItem
        );
        return { ...prevOrders, orderItemResponseDTO: updatedOrderItems };
      });
    } catch (error) {
      console.error("Error updating order item status:", error);
    }
  };

  const handleUpdateQuantity = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/orders/${orders.orderId}/items/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            dishQuantity: newQuantity,
          }),
        }
      );
      const updatedOrderItem = await response.json();

      // Update orderItemResponseDTO after successful update
      setOrders((prevOrders) => {
        const updatedOrderItems = prevOrders.orderItemResponseDTO.map(
          (orderItem) =>
            orderItem.orderItemId === updatedOrderItem.orderItemId
              ? {
                  ...orderItem,
                  dishName: updatedOrderItem.dish.dishName,
                  dishQuantity: updatedOrderItem.dishQuantity,
                  customPrice: updatedOrderItem.customPrice,
                  dishNote: updatedOrderItem.dishNote,
                  dishStatus: updatedOrderItem.dishStatus,
                }
              : orderItem
        );
        return { ...prevOrders, orderItemResponseDTO: updatedOrderItems };
      });
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
        <DialogTitle id="alert-dialog-title">
          {"Chi tiết đơn hàng"}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-7 gap-4 justify-between items-center my-2 font-semibold">
            <p>Tên món</p>
            <p className="text-center">Số lượng</p>
            <p>Ghi chú</p>
            <p>Trạng thái</p>
            <p className="text-center">Ra món</p>
            <p className="text-center">Cập nhật số lượng</p>
          </div>
          {orders.orderItemResponseDTO.map((order) => (
            <div
              key={order.orderItemId}
              className="grid grid-cols-7 gap-4 justify-between items-center my-2"
            >
              <p>{order.dishName}</p>
              <p className="text-center">{order.dishQuantity}</p>
              <p>{order.dishNote}</p>
              <p>{order.dishStatus}</p>
              <Button
                variant="contained"
                disabled={
                  order.dishStatus === "Đã ra món" ||
                  order.dishStatus === "Đang chọn"
                }
                onClick={() => handleUpdate(order.orderItemId)}
              >
                Ra món
              </Button>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => handleUpdateQuantity(order.orderItemId)}
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
