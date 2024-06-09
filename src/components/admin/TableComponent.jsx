/* eslint-disable react/prop-types */

import { Button } from "@mui/material";
import NotificationComponent from "./NotificationComponent";
import OrderComponent from "./OrderComponent";

const TableComponent = ({ table, setStatus }) => {
  return (
    <div className="m-2 border">
      <p>Tên: {table.tableName}</p>
      <p>Trạng thái: {table.tableStatus}</p>
      <p className="flex gap-2 items-center">
        Số món đã lên: {`${table.doneDish}/${table.totalDish}`}
        {table.totalDish > 0 && (
          <OrderComponent tableId={table.tableId}>
            <Button>Chi tiết</Button>
          </OrderComponent>
        )}
      </p>
      <p>Tổng thời gian: {table.tableTime}</p>
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
