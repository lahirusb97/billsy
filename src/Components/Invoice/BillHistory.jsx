import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import HIstoryTable from "./HIstoryTable";
import BillModal from "./billModal";
import { useSelector } from "react-redux";

export default function BillHistory() {
  const [value, setValue] = React.useState(dayjs());
  const [open, setOpen] = React.useState(false);
  const OPENED_BILL = useSelector((state) => state.bill_data.OPENED_BILL);

  return (
    <div>
      <div className="flex flex-wrap">
        <div className="flex flex-wrap mt-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              defaultValue={dayjs("2022-04-17")}
              label="Controlled picker"
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider>
        </div>
      </div>
      <HIstoryTable dateTime={value} />
      {OPENED_BILL ? <BillModal /> : <></>}
    </div>
  );
}
