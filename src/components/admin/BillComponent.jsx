/* eslint-disable react/prop-types */
import React, { Fragment } from "react";
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
import { convertToTime } from "../../assets/time";

const BillComponent = ({
  children,
  bill,
  tableId,
  orderId,
  isOpen,
  setIsOpen,
  setBill,
  onBillDeleted, // Add this prop
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDeleteBill = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/orders/${orderId}/bill`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("Xóa bill thành công");
        setBill(null); // Reset bill state
        setIsOpen(false); // Close dialog on successful delete
        onBillDeleted(); // Call callback to update TableComponent state
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete bill");
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
      alert(error.message || "Xóa bill không thành công");
    }
  };

  const handleAcceptPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/tables/${tableId}/payment/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("Xác nhận thanh toán thành công");
        setIsOpen(false); // Close dialog on successful payment acceptance
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to accept payment");
      }
    } catch (error) {
      console.error("Error accepting payment:", error);
      alert(error.message || "Xác nhận thanh toán không thành công");
    }
  };

  return (
    <Fragment>
      <Button
        variant="outlined"
        onClick={() => setIsOpen(true)}
        disabled={bill === null}
      >
        {children}
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Hóa đơn"}</DialogTitle>
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
                    <TableCell>Tên</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bill &&
                    bill?.billItems?.length > 0 &&
                    bill.billItems.map((b, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell>{b.billItemName}</TableCell>
                        <TableCell>{b.billItemPrice}</TableCell>
                        <TableCell align="center">{b.billItemQuantity}</TableCell>
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
          <Button onClick={handleClose} variant="contained">Đóng</Button>
          <Button onClick={handleDeleteBill} autoFocus variant="contained">
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
