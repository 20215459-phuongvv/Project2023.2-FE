import { Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import MenuItem from "../components/customers/MenuItem";
import { Link, useParams } from "react-router-dom";

const Menu = () => {
  const { tableId } = useParams();
  const [menus, setMenus] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [menuId, setMenuId] = useState(0);
  const [orderId, setOrderId] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8080/menus")
      .then((res) => res.json())
      .then((data) => {
        setMenus(data);
        setDishes(data[0].dishResponseDTO);
        setMenuId(data[0].menuId);
      });
  }, []);

  const handleClick = (index) => {
    setDishes(menus[index].dishResponseDTO);
    setMenuId(menus[index].menuId);
  };

  useEffect(() => {
    if (tableId) {
      fetch(`http://localhost:8080/orders/tables/${tableId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderId(data.orderId);
        });
    }
  }, [tableId]);

  return (
    <Container className="flex flex-col items-center">
      <div className="flex justify-between w-[1200px] p-4 bg-slate-800">
        {menus.map((menu, index) => (
          <Button
            key={menu.menuId}
            variant={menu.menuId === menuId ? "contained" : "outlined"}
            onClick={() => handleClick(index)}
          >
            {menu.menuTitle}
          </Button>
        ))}
      </div>
      <div className="flex justify-end mt-4 w-full">
        <Button
          component={Link}
          to={`/cart/${tableId}`}
          variant="contained"
          color="primary"
          className="text-2xl font-semibold"
        >
          Đến giỏ hàng
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full">
        {dishes.map((dish) => (
          <MenuItem dish={dish} key={dish.dishId} orderId={orderId} />
        ))}
      </div>
    </Container>
  );
};

export default Menu;
