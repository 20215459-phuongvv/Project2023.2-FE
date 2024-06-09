/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

const FormMenu = ({ setStatus, menu }) => {
  const [menuName, setMenuName] = useState(menu?.menuTitle || "");
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `http://localhost:8080/admin/menus${menu ? "/" + menu.menuId : ""}`,
      {
        method: `${menu ? "PUT" : "POST"}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          menuTitle: menuName,
        }),
      }
    );
    const data = await res.json();
    if (data.menuId) {
      alert("Successfully");
      setStatus(true);
    } else {
      setStatus(false);
      alert(data.message);
    }
  };
  const handleDeleteMenu = async () => {
    const res = await fetch(
      `http://localhost:8080/admin/menus/${menu.menuId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setStatus(true);
    alert("Delete successfully");
  };
  return (
    <Box
      className="flex flex-col gap-2 min-w-[500px] mt-2"
      component="form"
      noValidate
      sx={{ mt: 1 }}
      onSubmit={handleSubmitForm}
    >
      <TextField
        type="text"
        placeholder="Tên menu..."
        label="Tên menu"
        value={menuName}
        onChange={(e) => setMenuName(e.target.value)}
      />
      {menu ? (
        <div className="flex gap-2">
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, padding: "1rem" }}
            onClick={handleDeleteMenu}
          >
            Xóa
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, padding: "1rem" }}
          >
            Cập nhật
          </Button>
        </div>
      ) : (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2, padding: "1rem" }}
        >
          Tạo
        </Button>
      )}
    </Box>
  );
};

export default FormMenu;
