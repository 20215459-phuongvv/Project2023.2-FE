/* eslint-disable react/prop-types */
import {
  Button,
} from "@mui/material";
import NotificationComponent from "./NotificationComponent";
import OrderComponent from "./OrderComponent";
import BillComponent from "./BillComponent";
import { useEffect, useState } from "react";

const TableComponent = ({ table, setStatus }) => {
  const [order, setOrder] = useState({});
  const [bill, setBill] = useState(null);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);

  // Function to fetch order details using Polling
  const fetchOrderDetails = () => {
    fetch(`http://localhost:8080/orders/tables/${table.tableId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((error) => console.error("Error fetching order:", error));
  };

  // Function to fetch bill details using Polling
  const fetchBillDetails = () => {
    try {
      if (order?.orderId) {
        fetch(`http://localhost:8080/orders/${order.orderId}/bill`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setBill(data?.message ? null : data);
          })
          .catch((error) => {
            setBill(null);
            console.error("Error fetching bill:", error);
          });
      }
    } catch (error) {
      setBill(null);
      console.error("Error fetching bill:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchOrderDetails();
    fetchBillDetails();

    // Polling interval
    const orderPollInterval = setInterval(fetchOrderDetails, 5000); // Poll every 5 seconds
    const billPollInterval = setInterval(fetchBillDetails, 5000); // Poll every 5 seconds

    // Clear intervals on component unmount
    return () => {
      clearInterval(orderPollInterval);
      clearInterval(billPollInterval);
    };
  }, [table.tableId]); // Only re-run effect if tableId changes

  const handleMakeTableEmpty = async () => {
    await fetch(`http://localhost:8080/admin/tables/${table.tableId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((req) => req.json())
      .then((data) => {
        if (data.tableId) {
          alert("Làm trống bàn thành công");
        }
      })
      .catch((error) => {
        console.error("Error making table empty:", error);
      });
  };

  const handleCreateBill = async () => {
    await fetch(`http://localhost:8080/admin/orders/${order.orderId}/bill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        } else {
          setBill(data);
          setIsBillDialogOpen(true); // Open the bill dialog
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="m-2 border">
      <p>Tên: {table.tableName}</p>
      <p>
        Trạng thái: {table.tableStatus}{" "}
        {table.tableStatus === "Đang yêu cầu thanh toán" && (
          <div className="flex gap-4 items-center">
            <Button
              onClick={handleCreateBill}
              variant="outlined"
              disabled={bill !== null}
            >
              Tạo bill
            </Button>
            <BillComponent
              bill={bill}
              tableId={table.tableId}
              orderId={order.orderId}
              isOpen={isBillDialogOpen}
              setIsOpen={setIsBillDialogOpen}
              setBill={setBill}
            >
              Xem bill
            </BillComponent>
          </div>
        )}
        {table.tableStatus === "Đã thanh toán" && (
          <Button variant="outlined" onClick={handleMakeTableEmpty}>
            Làm trống bàn
          </Button>
        )}
      </p>
      <p className="flex gap-2 items-center">
        Số món đã lên: {`${table.doneDish}/${table.totalDish}`}
        {table.totalDish > 0 && (
          <OrderComponent tableId={table.tableId}>
            <Button>Chi tiết</Button>
          </OrderComponent>
        )}
      </p>
      <p>Tổng thời gian: {table.totalTime} phút</p>
      <p className="flex gap-2 items-center">
        Số thông báo: {table.notificationNumber}
        {table.notificationNumber > 0 && (
          <>
            <NotificationComponent
              tableId={table.tableId}
              setStatus={setStatus}
            >
              <Button>Chi tiết</Button>
            </NotificationComponent>
          </>
        )}
      </p>
    </div>
  );
};

export default TableComponent;
