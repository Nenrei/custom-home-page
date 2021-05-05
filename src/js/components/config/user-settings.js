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
import { MdSettings } from "react-icons/md";
import HomePageSettings from "../config/context";
import UserContext from "../../context/UserContext";
import firebase from "../../../firebase";
import { setAuthUser } from "../../chromestorage/services";

const UserSettings = () => {
  const {
    state: { user },
    actions: { setUser },
  } = useContext(UserContext);

  const [dialogOpened, setDialogOpened] = useState(false);
  const {
    state: { showTwitch, twitchUser, updateTwitch },
    actions: { setShowTwitch, setTwitchUser, setUpdateTwitch },
  } = useContext(HomePageSettings);

  useEffect(() => {

    const twitchRef = firebase.database().ref(`${user.name}/twitch`);
    twitchRef.on("value", (snapshot) => {
      setTwitchUser(snapshot.val().user);
      setShowTwitch(snapshot.val().showTwitch);
    });

    setTimeout(() => {
      setUpdateTwitch(!updateTwitch);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (e) => {
    e.preventDefault();

    if (dialogOpened) {
      const twitchRef = firebase.database().ref(`${user.name}/twitch`);
      twitchRef.set({
        user: twitchUser,
        showTwitch: showTwitch
      });


      setTimeout(() => {
        setUpdateTwitch(!updateTwitch);
      }, 500);

    }

    setDialogOpened(!dialogOpened);
  };

  const onLogout = () => {
    setAuthUser(``);
    firebase
      .auth()
      .signOut()
      .then((response) => setUser({ email: ``, name: ``, isAuthenticated: false }))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="app-settings" onClick={handleClose}>
        <MdSettings />
      </div>
      
      <Button className="app-logout" color="secondary" onClick={onLogout}>
        Cerrar Sesión
      </Button>
      <div className="app-email">{user.email} </div>

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
                label="Show Twitch"
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
                label="Twitch User"
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
              Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default UserSettings;
