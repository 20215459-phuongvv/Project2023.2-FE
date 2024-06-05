import { Search } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="px-5 z-50 py-[.8rem] bg-[#e91e63]  lg:px-20 flex justify-between">
      <Link to="/" className="text-3xl font-semibold">
        Hello
      </Link>
      <div className="flex gap-8 justify-center items-center">
        <Link to="/search" className="text">
          <Search sx={{ fontSize: "30px" }} />
        </Link>
        <Link to="/login" className="text">
          <Avatar />
        </Link>
        <Link to="/cart" className="text">
          <ShoppingCartIcon sx={{ fontSize: "30px" }} />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
