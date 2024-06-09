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
          setOrderItems(data.orderItemResponseDTO);
        });
    }
  }, [params.tableId]);
  return (
    <Container>
      <h1 className="text-4xl font-semibold flex justify-center items-center mt-8 gap-2">
        Order
      </h1>
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outlined"
          onClick={handleCreateOrder}
          disabled={orderItems.length > 0}
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Cart;
