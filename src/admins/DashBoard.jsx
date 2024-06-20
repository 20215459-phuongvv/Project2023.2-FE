import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PrivateMessageAlert from "../components/admin/PrivateMessageAlert";
import { useEffect, useState } from "react";
import { convertToTime } from "../assets/time";
const DashBoard = () => {
  const [orders, setOrders] = useState([]);
  const [bill, setBill] = useState(null);
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [open, setOpen] = useState(false);

  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    if (status) {
      fetch(`http://localhost:8080/admin/orders?page=${page - 1}&size=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.orderResponseDTOList);
          setTotalPage(Math.ceil(data.total / 10));
        });
      setStatus(false);
    }
  }, [status, page]);
  const handleClickOpen = async (orderId) => {
    setOpen(true);
    await fetch(`http://localhost:8080/orders/${orderId}/bill`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBill(data);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setBill(null);
  };
  console.log(orders);
  return (
    <div>
      <PrivateMessageAlert />
      <h2 className="text-xl font-semibold my-4">Danh sách đơn hàng</h2>
      <div className="flex flex-col items-center justify-between min-h-[calc(100vh_-_150px)] gap-4">
        <TableContainer component={Paper} className="flex-1">
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Mã đơn hàng</TableCell>
                <TableCell align="center">Thời gian</TableCell>
                <TableCell align="center">Bàn</TableCell>
                <TableCell align="center">Số lượng món ăn</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Xem bill</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 &&
                orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell align="center">{order.orderId}</TableCell>
                    <TableCell align="center">{convertToTime(order.orderTime)}</TableCell>
                    <TableCell align="center">{order.tableName}</TableCell>
                    <TableCell align="center">{order?.orderItemResponseDTO?.length}</TableCell>
                    <TableCell align="center">{order.orderStatus}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => handleClickOpen(order.orderId)}
                      >
                        Xem bill
                      </Button>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Hóa đơn"}
                        </DialogTitle>
                        <DialogContent>
                          {
                            <div>
                              <Table
                                sx={{ minWidth: 500 }}
                                aria-label="simple table"
                                className="h-fit w-fit"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Giá</TableCell>
                                    <TableCell align="center">
                                      Số lượng
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {bill &&
                                    bill?.billItemResponseDTOS?.length > 0 &&
                                    bill.billItemResponseDTOS.map(
                                      (b, index) => (
                                        <TableRow key={index}>
                                          <TableCell align="center">
                                            {index + 1}
                                          </TableCell>
                                          <TableCell>
                                            {b.billItemName}
                                          </TableCell>
                                          <TableCell>
                                            {b.billItemPrice}
                                          </TableCell>
                                          <TableCell align="center">
                                            {b.billItemQuantity}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                </TableBody>
                              </Table>
                              {bill && (
                                <>
                                  <div className="m-2">
                                    Tổng số tiền: {bill.totalAmount}đ
                                  </div>
                                  <div className="m-2">
                                    Thời gian:{" "}
                                    {convertToTime(bill.billDateTime)}
                                  </div>
                                </>
                              )}
                            </div>
                          }
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Đóng</Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div>
          <Pagination count={totalPage} page={page} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
