import { Route, Routes } from "react-router-dom";
import Navbar from "../admins/Navbar";
import DashBoard from "../admins/DashBoard";
import Dish from "../admins/Dishes";
import Menu from "../admins/Menus";
import Order from "../admins/Orders";
import Tables from "../admins/Tables";
import Logout from "../admins/Logout";
import { useEffect } from "react";

const AdminRouters = () => {
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);
  return (
    <>
      <Navbar>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/dish" element={<Dish />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/table" element={<Tables />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Navbar>
    </>
  );
};

export default AdminRouters;
