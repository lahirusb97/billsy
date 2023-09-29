import * as React from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

export default function DatePickerViews() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker", "DatePicker", "DatePicker"]}>
        <DatePicker
          label={'"year", "month" and "day"'}
          views={["year", "month", "day"]}
        />
        <DatePicker label={'"day"'} views={["day"]} />
        <DatePicker label={'"month" and "year"'} views={["month", "year"]} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
