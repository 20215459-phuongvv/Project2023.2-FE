/* eslint-disable no-unused-vars */
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Cart = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState(0);
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
  useEffect(() => {
    if (params.tableId) {
      fetch(`http://localhost:8080/orders/tables/${params.tableId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderItems(
            data?.orderItemResponseDTO ? data?.orderItemResponseDTO : []
          );
          setOrderId(data?.orderId ? data?.orderId : 0);
        })
        .catch(() => console.log("Bàn trống"));
    }
  }, [params.tableId]);
  const handleSendOrder = () => {
    fetch(`http://localhost:8080/orders/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orderId) {
          alert("Gửi order thành công");
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
      .then((res) => alert("Yêu cầu thanh toán thành công"))
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
  return (
    <Container>
      <h1 className="text-4xl font-semibold flex justify-center items-center mt-8 gap-2">
        Order
      </h1>
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outlined"
          onClick={handleCreateOrder}
          disabled={orderItems?.length > 0}
        >
          Tạo order
        </Button>
        <Link
          to={`/menu/${params.tableId}`}
          className="text-2xl font-semibold"
        >{`Đến giỏ hàng >>>`}</Link>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Ghi chú</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hỗ trợ món</TableCell>
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
                  <TableCell>{orderItem.dishQuantity}</TableCell>
                  <TableCell>{orderItem.customPrice}</TableCell>
                  <TableCell>{orderItem.dishNote}</TableCell>
                  <TableCell>{orderItem.dishStatus}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleRequest(orderItem.orderItemId)}
                    >
                      Gửi
                    </Button>
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
          disabled={orderItems.length === 0}
        >
          Gửi order
        </Button>
        <Button
          variant="contained"
          onClick={handlePaymentRequest}
          disabled={orderItems.length === 0}
        >
          Yêu cầu thanh toán
        </Button>
      </div>
    </Container>
  );
};

export default Cart;
