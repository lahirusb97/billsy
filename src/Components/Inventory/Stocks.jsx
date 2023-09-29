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
import ItemTable from "./ItemTable";
//
export default function Stocks() {
  const [state, setState] = useState(false);
  const [edit, setEdit] = useState(false);
  const [inputdata, setInputdata] = useState([]);
  const shop_Id = useSelector(
    (state) => state.shop_data.SELECTED_SHOP["Shop_id"]
  );
  const editState = (editSw, data) => {
    setEdit(editSw);
    setInputdata(data);
  };
  const Stock_manage = useSelector(
    (state) => state.user_data.userData["Stock_manage"]
  );

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
      {Stock_manage ? (
        <button
          className="bg-greendark text-mywhite mt-2 py-2 px-4 mb-2"
          onClick={() => {
            setState(true);
            setEdit(false);
          }}
        >
          Add Product
        </button>
      ) : (
        <></>
      )}

      <ItemTable
        state={state}
        setState={setState}
        edit={edit}
        setEdit={editState}
      />
    </div>
  );
}
