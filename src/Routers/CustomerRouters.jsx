import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NavBar from "../components/customers/NavBar";
import LoginForm from "../pages/LoginForm";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import { useEffect } from "react";

const CustomerRouters = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/admin";
    }
  }, []);
  return (
    <>
      <nav className="sticky top-0 z-50">
        <NavBar />
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/menu/:tableId" element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart/:tableId" element={<Cart />} />
      </Routes>
    </>
  );
};

export default CustomerRouters;
