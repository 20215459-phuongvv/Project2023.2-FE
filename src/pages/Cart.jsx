import { useEffect, useState } from "react";
import {
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ButtonGroup,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { convertToTime } from "../assets/time";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import $ from "jquery";

const Cart = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState(0);
  const [hasOrder, setHasOrder] = useState(false);
  const [bill, setBill] = useState(null);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);

  useEffect(() => {
    if (params.tableId) {
      fetch(`http://localhost:8080/orders/tables/${params.tableId}`)
        .then((res) => {
          if (res.status === 500) {
            throw new Error("No order found");
          }
          return res.json();
        })
        .then((data) => {
          setOrderItems(
            data?.orderItemResponseDTO ? data?.orderItemResponseDTO : []
          );
          setOrderId(data?.orderId ? data?.orderId : 0);
          setHasOrder(true);
        })
        .catch(() => {
          setHasOrder(false);
          console.log("Bàn trống");
        });
    }
  }, [params.tableId]);

  useEffect(() => {
    const poll = () => {
      $.ajax({
        url: "http://localhost:8080/orders/updates",
        method: "GET",
        success: (updatedOrder) => {
          if (updatedOrder) {
            setOrderItems((prevOrderItems) =>
              prevOrderItems.map((item) =>
                item.orderItemId === updatedOrder.orderItemId
                  ? updatedOrder
                  : item
              )
            );
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

  const handleCreateOrder = async () => {
    await fetch(`http://localhost:8080/${params.tableId}/menus`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.length > 0) {
          alert("Tạo order thành công");
          navigate(`/menu/${params.tableId}`);
        }
      });
  };

  const handleSendOrder = () => {
    fetch(`http://localhost:8080/orders/${params.tableId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orderId) {
          alert("Gửi order thành công");
          setOrderItems((prevOrderItems) =>
            prevOrderItems.map((item) => ({
              ...item,
              dishStatus: "Đang ra món",
            }))
          );
        }
      });
  };

  const handleRequest = (id) => {
    fetch(`http://localhost:8080/orders/${orderId}/items/${id}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => alert("Yêu cầu hỗ trợ món ăn thành công"))
      .catch((err) => alert(err));
  };

  const handlePaymentRequest = () => {
    fetch(`http://localhost:8080/tables/${params.tableId}/payment/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => alert("Đã gửi yêu cầu thanh toán"))
      .catch((err) => alert(err));
  };

  const handleGetBill = () => {
    fetch(`http://localhost:8080/orders/${orderId}/bill`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBill(data);
        setIsBillDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching bill:", error);
        setBill(null);
        setIsBillDialogOpen(false);
      });
  };

  const handleDeleteItem = (id) => {
    fetch(`http://localhost:8080/orders/${orderId}/items/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setOrderItems((prevOrderItems) =>
            prevOrderItems.filter((item) => item.orderItemId !== id)
          );
          alert("Xóa món ăn thành công");
        } else {
          alert("Xóa món ăn thất bại");
        }
      })
      .catch((err) => alert(err));
  };

  const handleCloseBillDialog = () => {
    setIsBillDialogOpen(false);
  };

  const allItemsAreSelecting = orderItems.every(
    (item) => item.dishStatus === "Đang chọn"
  );
  const allItemsAreDone = orderItems.every(
    (item) => item.dishStatus === "Đã ra món"
  );

  const handleUpdateQuantity = async (orderItemId, quantity, number) => {
    if (quantity + number > 0) {
      await fetch(
        `http://localhost:8080/orders/${orderId}/items/${orderItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dishQuantity: quantity + number,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setOrderItems((prevOrderItems) =>
            prevOrderItems.map((item) =>
              item.orderItemId === data.orderItemId ? data : item
            )
          );
        })
        .catch((err) => alert(err));

      await fetch(`http://localhost:8080/orders/tables/${params.tableId}`)
        .then((res) => {
          if (res.status === 500) {
            throw new Error("No order found");
          }
          return res.json();
        })
        .then((data) => {
          setOrderItems(
            data?.orderItemResponseDTO ? data?.orderItemResponseDTO : []
          );
          setOrderId(data?.orderId ? data?.orderId : 0);
          setHasOrder(true);
        })
        .catch(() => {
          setHasOrder(false);
          console.log("Bàn trống");
        });
    }
  };

  return (
    <Container>
      <h1 className="text-4xl font-semibold flex justify-center items-center mt-8 gap-2">
        Giỏ hàng
      </h1>
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="contained"
          onClick={handleCreateOrder}
          disabled={hasOrder}
        >
          Tạo order
        </Button>
        <Button
          component={Link}
          to={`/menu/${params.tableId}`}
          variant="contained"
          color="primary"
          className="text-2xl font-semibold"
          disabled={!hasOrder}
        >
          Đến thực đơn
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hỗ trợ món</TableCell>
              <TableCell align="center">Xóa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.length > 0 &&
              orderItems.map((orderItem) => (
                <TableRow
                  key={orderItem.orderItemId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {orderItem.dishName}
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup
                      variant="outlined"
                      aria-label="Basic button group"
                      disabled={orderItem.dishStatus !== "Đang chọn"}
                    >
                      <Button
                        onClick={() =>
                          handleUpdateQuantity(
                            orderItem.orderItemId,
                            orderItem.dishQuantity,
                            -1
                          )
                        }
                      >
                        <RemoveIcon />
                      </Button>
                      <Button>{orderItem.dishQuantity}</Button>
                      <Button
                        onClick={() =>
                          handleUpdateQuantity(
                            orderItem.orderItemId,
                            orderItem.dishQuantity,
                            1
                          )
                        }
                      >
                        <AddIcon />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                  <TableCell>{orderItem.customPrice}</TableCell>
                  <TableCell>{orderItem.dishNote}</TableCell>
                  <TableCell>{orderItem.dishStatus}</TableCell>
                  <TableCell>
                    {orderItem.dishStatus !== "Đang chọn" && (
                      <Button
                        variant="outlined"
                        onClick={() => handleRequest(orderItem.orderItemId)}
                      >
                        Gửi
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      disabled={orderItem.dishStatus !== "Đang chọn"}
                      onClick={() => handleDeleteItem(orderItem.orderItemId)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-8 gap-8">
        <Button
          variant="contained"
          onClick={handleSendOrder}
          disabled={orderItems.length === 0 || allItemsAreDone}
        >
          Gửi order
        </Button>
        <Button
          variant="contained"
          onClick={handlePaymentRequest}
          disabled={orderItems.length === 0 || allItemsAreSelecting}
        >
          Yêu cầu thanh toán
        </Button>
        <Button
          variant="contained"
          onClick={handleGetBill}
          disabled={orderItems.length === 0 || allItemsAreSelecting}
        >
          Xem hóa đơn
        </Button>
      </div>
      {/* Bill Dialog */}
      <Dialog open={isBillDialogOpen} onClose={handleCloseBillDialog}>
        <DialogTitle>Hóa đơn</DialogTitle>
        <DialogContent className="h-fit">
          {bill && (
            <div>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="simple table"
                className="h-fit w-fit"
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">STT</TableCell>
                    <TableCell>Tên món ăn</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bill &&
                    bill?.billItemResponseDTOS?.length > 0 &&
                    bill.billItemResponseDTOS.map((b, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell>{b.billItemName}</TableCell>
                        <TableCell>{b.billItemPrice}</TableCell>
                        <TableCell align="center">
                          {b.billItemQuantity}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <div className="m-2">Tổng số tiền: {bill.totalAmount}đ</div>
              <div className="m-2">
                Thời gian: {convertToTime(bill.billDateTime)}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBillDialog} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;
