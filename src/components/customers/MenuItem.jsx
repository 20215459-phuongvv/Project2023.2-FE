import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

const MenuItem = ({ dish, orderId }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    dishId: dish.dishId,
    dishQuantity: 1,
    dishNote: "",
  });
  const [error, setError] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValues({
      dishId: dish.dishId,
      dishQuantity: 0,
      dishNote: "",
    });
    setError(null);
  };

  const handleCreateOrderItem = async () => {
    if (values.dishQuantity <= 0) {
      setError("Số lượng phải lớn hơn 0");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/orders/${orderId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          alert("Thêm món thành công");
          handleClose(); // Close dialog after successful addition
        } else {
          setError("Thêm món không thành công");
        }
      } else {
        throw new Error("Thêm món không thành công");
      }
    } catch (error) {
      console.error("Error adding dish:", error);
      setError("Thêm món không thành công");
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <img src={dish.thumbnail} className="w-full h-60 object-cover" alt={dish.dishName} />
      <h2>{dish.dishName}</h2>
      <p>{dish.dishPrice}</p>
      <Button variant="contained" onClick={handleClickOpen}>
        Thêm
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Thêm món ăn</DialogTitle>
        <DialogContent className="min-w-[400px] flex flex-col gap-4">
          <TextField
            id="outlined-basic"
            label="Số lượng"
            variant="outlined"
            type="number"
            className="w-full mt-20"
            value={String(values.dishQuantity)}
            onChange={(e) =>
              setValues({ ...values, dishQuantity: Number(e.target.value) })
            }
            error={error && values.dishQuantity <= 0}
            helperText={error && values.dishQuantity <= 0 && error}
          />
          <TextField
            id="outlined-basic"
            label="Ghi chú"
            variant="outlined"
            type="text"
            className="w-full mt-20"
            value={values.dishNote}
            onChange={(e) => setValues({ ...values, dishNote: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            onClick={handleCreateOrderItem}
            autoFocus
            variant="contained"
            disabled={dish.dishStatus === 0 || values.dishQuantity <= 0}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MenuItem;
