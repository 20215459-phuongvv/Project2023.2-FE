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
import { useEffect, useState } from "react";
import AlertDialog from "../components/DialogComponent";
import FormMenu from "../components/admin/FormMenu";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [status, setStatus] = useState(true);
  useEffect(() => {
    if (status) {
      fetch("http://localhost:8080/menus", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMenus(data);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });

      setStatus(false);
    }
  }, [status]);
  return (
    <div>
      <div className="text-xl font-semibold my-4 flex justify-between">
        <h2>Danh sách thực đơn</h2>
        <AlertDialog
          component={<FormMenu setStatus={setStatus} />}
          title="Thêm danh mục"
        >
          <Fab color="secondary" aria-label="edit">
            <EditIcon />
          </Fab>
        </AlertDialog>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên thực đơn</TableCell>
              <TableCell>Cập nhật</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.length > 0 &&
              menus.map((menu, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{menu.menuTitle}</TableCell>
                  <TableCell>
                    <AlertDialog
                      component={<FormMenu menu={menu} setStatus={setStatus} />}
                      title="Cập nhật"
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

export default Menu;
