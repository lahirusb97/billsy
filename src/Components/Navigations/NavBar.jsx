import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
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
//* Icons
import {
  AccountBalanceOutlined,
  AddShoppingCartOutlined,
  BarChartOutlined,
  DashboardCustomizeOutlined,
  Inventory2Outlined,
  LogoutOutlined,
  PeopleOutlineOutlined,
  Settings,
  SettingsApplicationsRounded,
  SettingsApplicationsTwoTone,
  SettingsBluetoothRounded,
  SettingsOutlined,
} from "@mui/icons-material";
import MainRoutes from "./MainRoutes";
import { getAuth, signOut } from "firebase/auth";
import AnimateRoute from "./AnimateRoute";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import DrawerRight from "../Component/DrawerRight";
import { useEffect } from "react";
import useWindowDimensions from "../../Hooks/WindowSize";
import { setWidth } from "../../Store/Slices/mainBoxSize";
import { setCurrentShop, switchShop } from "../../Store/Slices/userDataSlice";

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
  const { height, width } = useWindowDimensions();
  const mainbox_width = React.useRef();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectNav, setSelectNav] = React.useState(0);
  const [selectShop, setselectShop] = React.useState("Shop1");
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
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
  const navList = [
    {
      name: "Dashboard",
      Icon: <DashboardCustomizeOutlined />,
      path: "/",
      protected: false,
    },
    {
      name: "Inventory",
      Icon: <Inventory2Outlined />,
      path: "/inventory",
      protected: false,
    },
    {
      name: "Invoice",
      Icon: <AddShoppingCartOutlined />,
      path: "/invoice",
      protected: false,
    },
    {
      name: "Coustomers",
      Icon: <PeopleOutlineOutlined />,
      path: "/coustomers",
      protected: false,
    },
    {
      name: "Employees",
      Icon: <PeopleOutlineOutlined />,
      path: "/employees",
      protected: true,
    },
    {
      name: "Accounting",
      Icon: <AccountBalanceOutlined />,
      path: "/accounting",
      protected: false,
    },
    {
      name: "Report",
      Icon: <BarChartOutlined />,
      path: "/report",
      protected: false,
    },
    {
      name: "Settings",
      Icon: <SettingsOutlined className="text-red-400" />,
      path: "/settings",
      protected: true,
    },
  ];

  return (
    <AnimateRoute>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          style={{
            background: "#ffffff",
            boxShadow: "unset",
          }}
          open={open}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon style={{ color: "1D1D1D" }} />
            </IconButton>

            <Typography variant="h6" noWrap component="div" className="flex">
              <h1 className="text-black ">
                {shopName}
                {/* {location.pathname === "/"
                  ? "Dashboard"
                  : location.pathname.substring(1).charAt(0).toUpperCase() +
                    location.pathname.substring(2)} */}
              </h1>
              <button onClick={() => dispatch(switchShop())}>
                <Settings className="text-myred mx-2" />
              </button>
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <h1 className="text-black ">Bestway Mobile</h1>

            <IconButton
              style={{
                color: "#1D1D1D",
              }}
              onClick={handleDrawerClose}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
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

                    background: selectNav === i ? "#7F55DA" : "#ffffff",
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
                        color: selectNav === i ? "#ffffff" : "#1D1D1D",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ) : !text.protected ? (
                <ListItem
                  onClick={() => {
                    console.log(text);
                  }}
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
        <Box
          ref={mainbox_width}
          component="main"
          className="bg-mymainbg w-full h-screen"
          sx={{ flexGrow: 1, p: 0 }}
        >
          <DrawerHeader />

          <MainRoutes />
        </Box>
      </Box>
    </AnimateRoute>
  );
}
