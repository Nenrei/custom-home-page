/* eslint-disable no-undef */
import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import { MdSettings, MdHighlightOff } from "react-icons/md";
import HomePageSettings from "../config/context";
import UserContext from "../../context/UserContext";
import { getTwitchData, setTwitchData } from "../../firebase/services";

const UserSettings = ({ onLogout }) => {
  const {
    state: { user },
  } = useContext(UserContext);

  const [dialogOpened, setDialogOpened] = useState(false);
  const {
    state: { showTwitch, twitchUser, updateTwitch },
    actions: { setShowTwitch, setTwitchUser, setUpdateTwitch },
  } = useContext(HomePageSettings);

  const delaidUpdateTwitch = () => {
    setTimeout(() => {
      setUpdateTwitch(!updateTwitch);
    }, 500);
  };

  useEffect(() => {
    getTwitchData(user.name, setTwitchUser, setShowTwitch);
    delaidUpdateTwitch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (e) => {
    e.preventDefault();

    if (dialogOpened) {
      setTwitchData(user.name, twitchUser, showTwitch);
      delaidUpdateTwitch();
    }

    setDialogOpened(!dialogOpened);
  };

  return (
    <>
      <header className="app-header">
        <Button className="app-header__logout" onClick={onLogout}>
          <MdHighlightOff className="app-header__icon" />
          Cerrar Sesión
          <div className="app-header__tooltip app-header__email">{user.email} </div>
        </Button>
        <Button className="app-header__twitch" onClick={handleClose}>
          <MdSettings className="app-header__icon" />
          Configurar Twitch
          {(twitchUser && twitchUser.length > 0) && <div className="app-header__tooltip app-header__twitch-user">{twitchUser} </div>}
        </Button>
        
        {/*
        <Button className="app-header__firebase">
          Guardar a BBDD
        </Button>
        <Button className="app-header__firebase">
          Cargar de BBDD
        </Button>
        */}
      </header>
      <Dialog
        open={dialogOpened}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
      >
        <form onSubmit={handleClose} autoComplete="off">
          <DialogContent>
            <FormGroup row>
              <FormControlLabel
                labelPlacement="start"
                label="Mostrar Twitch"
                control={
                  <Switch
                    checked={showTwitch}
                    onChange={(e) => {
                      setShowTwitch(e.target.checked);
                    }}
                    name="useTwitch"
                  />
                }
              />

              <TextField
                margin="dense"
                name="title"
                label="Usuario de Twitch"
                type="text"
                variant="outlined"
                value={twitchUser}
                required={showTwitch}
                disabled={!showTwitch}
                onChange={(e) => {
                  setTwitchUser(e.target.value);
                }}
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button type="submit" color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default UserSettings;
