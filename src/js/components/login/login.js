import React, { useContext, useEffect } from "react";
import UserContext from "../../context/UserContext";
import { TextField, Button } from "@material-ui/core";

import "./login.scss";
import { getAuthUser } from "../../chromestorage/services";

const Login = ({
  showLogin,
  setShowLogin,
  onLogin,
  onSignIn,
  encodeEmail,
  error,
  setError,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const {
    state: { user },
    actions: { setUser },
  } = useContext(UserContext);

  const handleLogin = (event) => {
    event.preventDefault();
    onLogin();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    onSignIn();
  };

  useEffect(() => {
    if (!user) {
      getAuthUser((authUser) => {
        if (authUser && authUser.length > 0) {
          setUser({
            email: authUser,
            name: encodeEmail(authUser),
            isAuthenticated: true,
          });
        } else {
          setShowLogin(true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    showLogin && (
      <form className="login-container" name="login" onSubmit={handleLogin}>
        <TextField
          margin="dense"
          name="email"
          label="email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => {
            setError("");
            setEmail(e.target.value);
          }}
        />
        <TextField
          margin="dense"
          name="password"
          label="contraseña"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => {
            setError("");
            setPassword(e.target.value);
          }}
        />
        <Button
          color="secondary"
          onClick={(event) => {
            handleSignIn(event);
          }}
        >
          Registrarse
        </Button>
        <Button color="primary" type="submit">
          Iniciar Sesión
        </Button>

        {error.length > 0 && <p className="login-container__error">{error}</p>}
      </form>
    )
  );
};
export default Login;
