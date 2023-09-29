import { useDispatch, useSelector } from "react-redux";
import AnimateRoute from "../Navigations/AnimateRoute";
import ProfitChart from "./ProfitChart";
import ConfirmModal from "../Component/ConfirmModal";
import { openModal } from "../../Store/Slices/Component/confirmModal";
import { Button, Paper, Typography, useMediaQuery } from "@mui/material";
import useWindowDimensions from "../../Hooks/WindowSize";
import { useTheme } from "@emotion/react";
import { CalendarMonth, CalendarViewDayRounded } from "@mui/icons-material";
import TotalChart from "./TotalChart";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

export default function Dashboard() {
  const { width, height } = useWindowDimensions();
  const NAV_WIDTH = useSelector((state) => state.nav_width.NAV_WIDTH);

  const dispatch = useDispatch();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AnimateRoute>
      <div className="mt-8">
        {/* <DatePicker /> */}
        <div className="flex sm:flex-row flex-col w-full items-center justify-center">
          <Paper
            sx={{
              width: matches ? "90vw" : 300,

              display: "flex",
              flexDirection: "column",

              margin: 2,
            }}
            elevation={2}
          >
            <div className="flex mt-2 mx-2 justify-between">
              <Typography
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                variant="h5"
              >
                Total Revenue
              </Typography>
              <Typography
                color="primary.subtitle"
                sx={{ fontWeight: "bold", marginLeft: 2 }}
              >
                Agust
              </Typography>
            </div>
            <div className="mx-auto">
              <ProfitChart />
            </div>
          </Paper>
          <Paper
            sx={{
              width: matches ? "90vw" : 300,

              display: "flex",
              flexDirection: "column",

              margin: 2,
            }}
            elevation={2}
          >
            <div className="flex mt-2 mx-2 justify-between">
              <Typography
                sx={{ fontWeight: "bold", fontSize: "1rem" }}
                variant="h5"
              >
                Revenue To Day
              </Typography>
              <div className="flex items-center">
                <Typography
                  color="primary.subtitle"
                  sx={{ fontWeight: "bold", marginLeft: 2 }}
                >
                  2023/10/5
                </Typography>
                <CalendarMonth className="text-subtitle text-grayLite2" />
              </div>
            </div>
            <div className="mx-auto">
              <ProfitChart />
            </div>
          </Paper>
        </div>
        <div>
          <TotalChart />
        </div>
      </div>
    </AnimateRoute>
  );
}
