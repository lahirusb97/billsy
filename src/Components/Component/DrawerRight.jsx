import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useWindowDimensions from "../../Hooks/WindowSize";
import { AppBar } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
export default function DrawerRight({ comp, state, setState }) {
  // eslint-disable-next-line react/prop-types
  const mainBoxSize = useSelector((state) => state.mainbox_width.width);

  const { width, height } = useWindowDimensions();

  const navWidth = width > 500 ? 500 : mainBoxSize;
  const handleClose = () => {
    setState(false);
  };
  return (
    <div>
      <React.Fragment>
        <Drawer
          BackdropProps={{
            invisible: true,
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#F5F4F7",
              color: "white",
              zIndex: 20000,
              position: "absolute",
            },
          }}
          anchor={"right"}
          open={state}
          // onClose={toggleDrawer(false)}
        >
          <Box
            sx={{
              width: navWidth,
              display: "block",
              color: "black",
              marginTop: "70px",
            }}
            role="button"
            // onClick={toggleDrawer(false)}
          >
            <div className="ml-4" onClick={handleClose}>
              <ArrowForwardIosIcon />
            </div>

            {comp}
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}
