import { Box, Button, Container, CssBaseline, TextField } from "@mui/material";

const LoginForm = () => {
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <h2 className="text-center text-3xl font-semibold">Login</h2>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
