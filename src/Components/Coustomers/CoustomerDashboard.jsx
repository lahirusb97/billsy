import React from "react";
import AddCoustomerModal from "./AddCoustomerModal";

export default function CoustomerDashboard() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="bg-greendark px-2 py-2 text-mywhite"
      >
        Add Coustomer
      </button>
      <AddCoustomerModal open={open} setOpen={setOpen} />
    </div>
  );
}
