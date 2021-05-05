import React, { useState, useContext, useEffect } from "react";
import UserContext from "../../context/UserContext";
import {
  TextField,
  Button,
} from "@material-ui/core";

import "./login.scss";
import firebase from "../../../firebase";
import { getAuthUser, setAuthUser } from "../../chromestorage/services";

const Login = () => {
  const { state: { user }, actions: { setUser } } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const encodeEmail = (emailToEncode) => {
    let encodedEmail = emailToEncode.replaceAll(".", "(dot)");
    encodedEmail = encodedEmail.replaceAll("$", "(dollar)");
    encodedEmail = encodedEmail.replaceAll("#", "(numeric)");
    encodedEmail = encodedEmail.replaceAll("[", "(rightBracket)");
    encodedEmail = encodedEmail.replaceAll("]", "(leftBracket)");
    encodedEmail = encodedEmail.replaceAll("/", "(slash)");
    return encodedEmail;
  }

  const handleSignIn = (event) => {
    setError("");
    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      onLogin();
    })
    .catch((error) => {
      setError(error.message);
    });
  };

  const onLogin = () => {
    setError("");
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then( response => {
        setUser({
          email: response.user["email"],
          name: encodeEmail(response.user["email"]),
          isAuthenticated: true,
        });
        setAuthUser(response.user["email"]);
      })
      .catch( error => setError(error.message) );
  };

  const handleLogin = (event) => {
    event.preventDefault();
    onLogin();
  };

  useEffect(() => {
    if(!user){
      getAuthUser((authUser)=>{
        if(authUser && authUser.length > 0){
          setUser({
            email: authUser,
            name: encodeEmail(authUser),
            isAuthenticated: true,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
        onChange={
          (e) => {
            setError("");
            setPassword(e.target.value);
          }
        }
      />
      <Button color="secondary" onClick={(event)=>{handleSignIn(event)}}>
        Registrarse
      </Button>
      <Button color="primary" type="submit">
        Iniciar Sesion
      </Button>

      {error.length > 0 && (<p className="login-container__error">{error}</p>)}
      
    </form>
  );
};
export default Login;
