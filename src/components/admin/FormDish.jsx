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
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
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
    const file = e.target.files[0];
    setFormValues({
      ...formValues,
      thumbnail: file,
    });
    setThumbnailPreview(URL.createObjectURL(file));
  };
  
  const handleChange = (e) => {
    console.log(typeof e.target.value);
    setFormValues({
      ...formValues,
      menuId: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert("Thành công");
        setStatus(true);
        setFormValues({
          dishName: "",
          dishPrice: "",
          dishStatus: "",
          menuId: 0,
          thumbnail: null,
        });
        setThumbnailPreview(null);
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
      alert("Thành công");
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
        label="Tên món ăn"
        variant="outlined"
        name="dishName"
        value={formValues.dishName}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Giá tiền"
        variant="outlined"
        name="dishPrice"
        type="number"
        value={formValues.dishPrice}
        onChange={handleInputChange}
        required
      />
      <TextField
        label="Trạng thái"
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
        Tải ảnh lên
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </Button>
      {thumbnailPreview && (
        <Box
          component="img"
          src={thumbnailPreview}
          alt="Thumbnail Preview"
          sx={{
            width: '100%',
            height: 'auto',
            marginTop: 2,
          }}
        />
      )}
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
