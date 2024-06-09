/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const FormDish = ({ setStatus, dish }) => {
  const [formValues, setFormValues] = useState({
    dishName: "",
    dishPrice: "",
    dishStatus: "",
    menuId: 0,
    ...dish,
    thumbnail: null,
  });
  const [menus, setMenus] = useState([]);
  useEffect(() => {
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
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormValues({
      ...formValues,
      thumbnail: e.target.files[0],
    });
  };
  const handleChange = (e) => {
    console.log(typeof e.target.value);
    setFormValues({
      ...formValues,
      menuId: e.target.value,
    });
  };

  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo FormData object
    const formData = new FormData();
    formData.append("dishName", formValues.dishName);
    formData.append("dishPrice", formValues.dishPrice);
    formData.append("dishStatus", formValues.dishStatus);
    formData.append("menuId", formValues.menuId);
    if (formValues.thumbnail) {
      formData.append("thumbnail", formValues.thumbnail);
    }

    console.log(formData);
    try {
      // Gửi POST request với FormData
      const response = await fetch(
        `http://localhost:8080/admin/dishes${dish ? "/" + dish.dishId : ""}`,
        {
          method: `${dish ? "PUT" : "POST"}`,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.dishId) {
        alert("Successfully");
        setStatus(true);
        setFormValues({
          dishName: "",
          dishPrice: "",
          dishStatus: "",
          menuId: 0,
          thumbnail: null,
        });
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };
  const handleDeleteDish = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/admin/dishes/${dish.dishId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      alert("Successfully");
      setStatus(true);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 300,
        margin: "auto",
        mt: 5,
      }}
    >
      <TextField
        label="Dish Name"
        variant="outlined"
        name="dishName"
        value={formValues.dishName}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Dish Price"
        variant="outlined"
        name="dishPrice"
        type="number"
        value={formValues.dishPrice}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Dish Status"
        variant="outlined"
        name="dishStatus"
        type="number"
        value={formValues.dishStatus}
        onChange={handleInputChange}
        required
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Danh mục</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formValues.menuId}
          label="Danh mục"
          onChange={handleChange}
        >
          {menus.length > 0 &&
            menus.map((menu) => (
              <MenuItem key={menu.menuId} value={menu.menuId}>
                {menu.menuTitle}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Button variant="outlined" component="label">
        Upload Thumbnail
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
      {dish ? (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="contained"
            color="primary"
            className="flex-1"
            onClick={handleDeleteDish}
          >
            Xóa
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="flex-1"
          >
            Cập nhật
          </Button>
        </div>
      ) : (
        <Button type="submit" variant="contained" color="primary">
          Tạo
        </Button>
      )}
    </Box>
  );
};

export default FormDish;
