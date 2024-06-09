import { Box, Button, Container, CssBaseline, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin");
    }
  }, [navigate]);
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    const data = await res.json();
    if (data.status) {
      localStorage.setItem("token", data.jwt);
      navigate("/admin");
    }
  };
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <h2 className="text-center text-3xl font-semibold">Login</h2>
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
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
              Login
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
