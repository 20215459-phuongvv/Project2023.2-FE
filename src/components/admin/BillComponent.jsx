/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, useState } from "react";
import { convertToTime } from "../../assets/time";

const BillComponent = ({ children, bill, tableId, orderId }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteBill = async () => {
    await fetch(`http://localhost:8080/admin/orders/${orderId}/bill`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => alert("Xóa bill thành công"));
  };
  const handleAcceptPayment = async () => {
    await fetch(
      `http://localhost:8080/admin/tables/${tableId}/payment/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res) => alert("Xác nhận thanh toán thành công"));
  };
  return (
    <Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        disabled={bill === null}
      >
        {children}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Tạo bill"}</DialogTitle>
        <DialogContent className="h-fit">
          {bill && (
            <div>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                className="h-fit w-fit"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bill &&
                    bill?.billItemResponseDTOS?.length > 0 &&
                    bill.billItemResponseDTOS.map((b, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{b.billItemName}</TableCell>
                        <TableCell>{b.billItemPrice}</TableCell>
                        <TableCell>{b.billItemQuantity}</TableCell>
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
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleDeleteBill} autoFocus variant="outlined">
            Xóa bill
          </Button>
          <Button onClick={handleAcceptPayment} autoFocus variant="contained">
            Chấp nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default BillComponent;
