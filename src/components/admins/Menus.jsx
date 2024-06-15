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

const Menu = () => {
  return (
    <div>
      <div className="text-xl font-semibold my-4 flex justify-between">
        <h2>Danh sách thực đơn</h2>
        <Fab color="secondary" aria-label="edit">
          <EditIcon />
        </Fab>
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
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Menu;
