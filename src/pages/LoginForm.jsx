import { Box, Button, Container, CssBaseline, TextField, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [values, setValues] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem("token", data.jwt);
        navigate("/admin");
      } else {
        setErrorMessage("Tài khoản hoặc mật khẩu không đúng vui lòng thử lại");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="flex justify-center items-center h-[90vh]">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <h2 className="text-center text-3xl font-semibold">Đăng nhập</h2>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmitLogin}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Tên đăng nhập"
              name="username"
              autoComplete="username"
              autoFocus
              value={values.username}
              onChange={(e) => setValues({ ...values, username: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, padding: "1rem" }}
            >
              Đăng nhập
            </Button>
          </Box>
          {/* <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don&apos;t have an account?{" "}
            <Button onClick={() => navigate("/register")}>Register</Button>
          </Typography> */}
        </div>
      </Container>
    </div>
  );
};

export default LoginForm;
