import {
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import AlertDialog from "../components/DialogComponent";
import FormDish from "../components/admin/FormDish";
import PrivateMessageAlert from "../components/admin/PrivateMessageAlert";

const Dish = () => {
  const [dishes, setDishes] = useState([]);
  const [status, setStatus] = useState(true);
  useEffect(() => {
    if (status) {
      fetch("http://localhost:8080/dishes")
        .then((res) => res.json())
        .then((data) => {
          setDishes(data);
        });
      setStatus(false);
    }
  }, [status]);
  console.log(dishes);
  return (
    <div>
      <PrivateMessageAlert />
      <div className="text-xl font-semibold my-4 flex justify-between">
        <h2>Danh sách món ăn</h2>
        <AlertDialog
          title="Tạo món"
          component={<FormDish setStatus={setStatus} />}
        >
          <Fab color="secondary" aria-label="edit">
            <AddIcon />
          </Fab>
        </AlertDialog>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên món ăn</TableCell>
              <TableCell>Giá tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Cập nhật</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dishes.length > 0 &&
              dishes.map((dish, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={dish.thumbnail}
                      alt={dish.dishName}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell>{dish.dishName}</TableCell>
                  <TableCell>{dish.dishPrice}</TableCell>
                  <TableCell>
                    {dish.dishStatus == 1 ? "Còn món" : "Hết món"}
                  </TableCell>
                  <TableCell>
                    <AlertDialog
                      title="Cập nhật"
                      component={<FormDish setStatus={setStatus} dish={dish} />}
                    >
                      <Fab color="error" aria-label="edit">
                        <EditIcon />
                      </Fab>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dish;
