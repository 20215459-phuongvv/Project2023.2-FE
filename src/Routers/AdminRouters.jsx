import { Route, Routes } from "react-router-dom";
import Navbar from "../components/admins/Navbar";
import DashBoard from "../components/admins/DashBoard";
import Dish from "../components/admins/Dishes";
import Menu from "../components/admins/Menus";
import Order from "../components/admins/Orders";
import Tables from "../components/admins/Tables";

const AdminRouters = () => {
  return (
    <>
      <Navbar>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/dish" element={<Dish />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/table" element={<Tables />} />
        </Routes>
      </Navbar>
    </>
  );
};

export default AdminRouters;
