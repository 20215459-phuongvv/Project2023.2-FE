import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NavBar from "../components/customers/NavBar";
import LoginForm from "../pages/LoginForm";

const CustomerRouters = () => {
  return (
    <>
      <nav className="sticky top-0 z-50">
        <NavBar />
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </>
  );
};

export default CustomerRouters;
