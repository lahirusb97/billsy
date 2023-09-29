import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
// import { makeStyles } from "@mui/styles";

import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
//
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
//* Icons
import {
  AccountBalance,
  AccountBalanceOutlined,
  AddShoppingCart,
  AddShoppingCartOutlined,
  BarChartOutlined,
  Calculate,
  Dashboard,
  DashboardCustomizeOutlined,
  Inventory,
  Inventory2Outlined,
  LogoutOutlined,
  NotificationAdd,
  Notifications,
  NotificationsActiveOutlined,
  People,
  PeopleOutlineOutlined,
  Settings,
  SettingsAccessibility,
  SettingsApplicationsRounded,
  SettingsApplicationsTwoTone,
  SettingsBluetoothRounded,
  SettingsOutlined,
  SettingsPhone,
} from "@mui/icons-material";
import MainRoutes from "./MainRoutes";
import { getAuth, signOut } from "firebase/auth";
import AnimateRoute from "./AnimateRoute";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, Paper, TextField } from "@mui/material";
import DrawerRight from "../Component/DrawerRight";
import { useEffect } from "react";
import useWindowDimensions from "../../Hooks/WindowSize";
import { setWidth } from "../../Store/Slices/mainBoxSize";
import { setCurrentShop, switchShop } from "../../Store/Slices/userDataSlice";
import {
  setCategory,
  setStock,
  stockFilter,
} from "../../Store/Slices/stockData";
import { shopselect } from "../../Store/Slices/shopData";
import { getDatabase, onValue, ref } from "firebase/database";
import { setnavWidth } from "../../Store/Slices/Component/navWidth";

// todo Styles start
const drawerWidth = 250;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: "#ffffff",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  background: "#ffffff",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar

  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),

    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
// todo Styles end
//Router

export default function NavBar() {
  //*Router
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // const classes = useStyles();
  const { height, width } = useWindowDimensions();
  const mainbox_width = React.useRef();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectNav, setSelectNav] = React.useState(0);
  const [selectShop, setselectShop] = React.useState("Shop1");
  const [loading, setLoading] = React.useState(false);

  const handleChange = (event) => {
    setLoading(true);
    setAge(event.target.value);
  };
  useEffect(() => {
    dispatch(setWidth(mainbox_width.current.offsetWidth));
  }, [width]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const adminAccess = useSelector((state) => state.user_data.userData["Admin"]);
  const shopName = useSelector((state) => state.user_data.CURRENT_SHOP["Name"]);
  const username = useSelector((state) => state.user_data.userData["Name"]);
  const SHOP_LIST = useSelector((state) => state.user_data.SHOP_LIST);

  const navList = [
    {
      name: "Dashboard",
      Icon: <Dashboard color="primary.iconcolor" />,
      path: "/",
      protected: false,
    },
    {
      name: "Inventory",
      Icon: <Inventory color="primary.iconcolor" />,
      path: "/inventory",
      protected: false,
    },
    {
      name: "Invoice",
      Icon: <AddShoppingCart color="primary.iconcolor" />,
      path: "/invoice",
      protected: false,
    },
    {
      name: "Coustomers",
      Icon: <People color="primary.iconcolor" />,
      path: "/coustomers",
      protected: false,
    },
    {
      name: "Employees",
      Icon: <People color="primary.iconcolor" />,
      path: "/employees",
      protected: true,
    },
    // {
    //   name: "Accounting",
    //   Icon: <Calculate color="primary.iconcolor" />,
    //   path: "/accounting",
    //   protected: false,
    // },

    {
      name: "Settings",
      Icon: <Settings color="primary.iconcolor" className="text-red-400" />,
      path: "/settings",
      protected: true,
    },
  ];
  const [age, setAge] = React.useState(SHOP_LIST[0]);
  const refs = React.useRef(null);

  useEffect(() => {
    if (open) {
      dispatch(setnavWidth(250));
    } else {
      dispatch(setnavWidth(65));
    }
  }, [open]);

  return (
    <AnimateRoute>
      <Box sx={{ display: "flex" }}>
        <Drawer
          ref={refs}
          PaperProps={{
            elevation: 2,
            square: false,
            style: { backgroundColor: "white", borderRadius: "1rem" },
          }}
          variant="permanent"
          open={open}
        >
          <DrawerHeader style={{ height: "auto" }}>
            <div className="flex justify-start w-full ml-2">
              {open ? (
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  className="flex"
                >
                  <button onClick={() => dispatch(switchShop())}>
                    <Settings color="primary.iconcolor" className=" mx-2" />
                  </button>
                  <h1 className="text-black ">
                    {shopName}
                    {/* {location.pathname === "/"
                      ? "Dashboard"
                      : location.pathname.substring(1).charAt(0).toUpperCase() +
                        location.pathname.substring(2)}{" "} */}
                  </h1>
                </Typography>
              ) : (
                <></>
              )}
            </div>
            {open ? (
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon color="primary.iconcolor" />
                ) : (
                  <ChevronLeftIcon color="primary.iconcolor" />
                )}
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon
                  color="primary.iconcolor"
                  style={{ color: "1D1D1D" }}
                />
              </IconButton>
            )}
          </DrawerHeader>
          {console.log(selectNav)}
          <List>
            {navList.map((text, i) =>
              adminAccess ? (
                <ListItem
                  onClick={() => {
                    setSelectNav(i);
                  }}
                  key={text["name"]}
                  disablePadding
                  sx={{
                    display: "block",

                    background:
                      location.pathname === text["path"]
                        ? "#1B4DE4"
                        : "#ffffff",
                  }}
                >
                  <ListItemButton
                    onClick={() => {
                      navigate(text["path"]);
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: selectNav === i ? "#ffffff" : "#1D1D1D",
                      }}
                    >
                      {text["Icon"]}
                    </ListItemIcon>
                    <ListItemText
                      primary={text["name"]}
                      sx={{
                        opacity: open ? 1 : 0,
                        color:
                          location.pathname === text["path"]
                            ? "#ffffff"
                            : "#1D1D1D",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ) : !text.protected ? (
                <ListItem
                  // className={`${classes.listItem} ${classes.activeListItem}`}
                  onClick={() => {}}
                  key={text["name"]}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    onClick={() => {
                      navigate(text["path"]);
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {text["Icon"]}
                    </ListItemIcon>
                    <ListItemText
                      primary={text["name"]}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ) : (
                <></>
              )
            )}
          </List>
          <List
            sx={{
              position: "fixed",
              bottom: 0,
              textAlign: "center",
            }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => {
                  const auth = getAuth();
                  return signOut(auth)
                    .then(() => {
                      navigate("/login");
                    })
                    .catch((error) => {
                      // Handle any errors that occur during the sign-out process
                      console.error("Error signing out:", error);
                    });
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  color: "#1D1D1D",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#1D1D1D",
                  }}
                >
                  {<LogoutOutlined />}
                </ListItemIcon>
                <ListItemText
                  primary={"Logout"}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <div className="bg-mymainbg w-full h-screen">
          <Box
            ref={mainbox_width}
            component="main"
            className="bg-mymainbg w-full h-screen"
            sx={{ flexGrow: 1, p: 1, maxWidth: "1920px" }}
          >
            {/* <DrawerHeader /> */}
            <Typography
              color="primary.iconcolor"
              variant="h5"
              sx={{ fontWeight: "bold" }}
            >
              {location.pathname === "/"
                ? "Dashboard"
                : location.pathname.substring(1).charAt(0).toUpperCase() +
                  location.pathname.substring(2)}{" "}
            </Typography>
            <div className="flex items-center absolute right-5 top-2">
              <img src="images/profile.png" />
              <p className="capitalize mx-2">{username}</p>
              <NotificationsActiveOutlined />
            </div>
            <MainRoutes />
          </Box>
        </div>
      </Box>
    </AnimateRoute>
  );
}
