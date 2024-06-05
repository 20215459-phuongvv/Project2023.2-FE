import { Route, Routes } from "react-router-dom";
import CustomerRouters from "./CustomerRouters";
import AdminRouters from "./AdminRouters";

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<CustomerRouters />} />
        <Route path="/admin/*" element={<AdminRouters />} />
      </Routes>
    </>
  );
};

export default Routers;
