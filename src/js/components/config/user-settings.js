/* eslint-disable no-undef */
import React, { useState, useContext, useEffect } from "react";
import { saveSettings, getSettings } from "../../chromestorage/services";
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

const UserSettings = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const {
    state: { showTwitch, twitchUser, updateTwitch },
    actions: { setShowTwitch, setTwitchUser, setUpdateTwitch },
  } = useContext(HomePageSettings);

  useEffect(() => {
    getSettings({ setShowTwitch, setTwitchUser });
    setTimeout(() => {
      setUpdateTwitch(!updateTwitch);
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = (e) => {
    e.preventDefault();

    if(dialogOpened){

      saveSettings({ showTwitch, twitchUser, setShowTwitch, setTwitchUser });

      setTimeout(() => {
        setUpdateTwitch(!updateTwitch);
      }, 500);
    }

    setDialogOpened(!dialogOpened);
  };

  return (
    <>
      <div className="app-settings" onClick={handleClose}>
        <MdSettings />
      </div>
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
