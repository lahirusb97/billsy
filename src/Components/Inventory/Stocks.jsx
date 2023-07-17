import { useEffect, useState } from "react";
import DrawerRight from "../Component/DrawerRight";
import StockCount from "./StockCount";
import StockTable from "./StockTable";
import { Box, Button, TextField } from "@mui/material";
import Addproduct from "./Addproduct";

//* MUI
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Search } from "@mui/icons-material";
import SelectBox from "../Component/SelectBox";
import { useSelector } from "react-redux";
//
import SearchCom from "../Component/SearchCom";
import EditProduct from "./EditProduct";
//
export default function Stocks() {
  const [state, setState] = useState(false);
  const [edit, setEdit] = useState(false);
  const [inputdata, setInputdata] = useState([]);
  const shop_Id = useSelector(
    (state) => state.user_data.CURRENT_SHOP["Shop_id"]
  );
  const editState = (editSw, data) => {
    setEdit(editSw);
    setInputdata(data);
  };

  return (
    <div>
      <DrawerRight
        state={state}
        setState={setState}
        comp={
          edit ? (
            <EditProduct setState={setState} inputdata={inputdata} />
          ) : (
            <Addproduct setState={setState} />
          )
        }
      />
      <button
        className="bg-greendark text-mywhite mt-2 py-2 px-4 mb-2"
        onClick={() => {
          setState(true);
          setEdit(false);
        }}
      >
        Add Product
      </button>
      <SearchCom />

      <StockTable
        state={state}
        setState={setState}
        edit={edit}
        setEdit={editState}
      />
    </div>
  );
}
