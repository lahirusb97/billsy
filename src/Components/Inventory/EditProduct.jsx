/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
//*MUI
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
//* Firebase
import { getDatabase, ref, update, remove } from "firebase/database";
import { Delete } from "@mui/icons-material";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";
import SnacBar from "../Component/SnacBar";
import { setStock, stockFilter } from "../../Store/Slices/stockData";
// import { getDatabase, ref, onValue } from "firebase/database";
const BODER_RADIUS = "15px";

export default function EditProduct({ edit, inputdata, setState }) {
  const [age, setAge] = React.useState("");
  const [subCate, setsubCate] = React.useState("");
  const [loadingState, setloadingState] = React.useState(false);
  const shopData = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const ALL_STOCKS = useSelector((state) => state.stock_data.ALL_STOCKS);

  const dispatch = useDispatch();
  const shopId = useSelector(
    (state) => state.user_data.CURRENT_SHOP["Shop_id"]
  );

  const schema = yup.object({
    Product_name: yup
      .string()
      .transform((value) => value.toLowerCase())
      .required("Enter Product Name"),
    Brand_name: yup.string().transform((value) => value.toLowerCase()),
    Category: yup
      .string()
      .transform((value) => value.toLowerCase())
      .required("Select Category"),
    Sub_Category: yup
      .string()
      .transform((value) => value.toLowerCase())
      .required("Select Sub Category"),
    Stock_count: yup.number().required("Enter Item Count"),
    Alert: yup.number().required("Enter Alert Count"),
    Price: yup.number().required("Enter Item Price"),
    Cost: yup.number().required("Enter Item Cost"),
    Warranty: yup.string().required("Enter Item Worrenty"),
    Note: yup.string().transform((value) => value.toLowerCase()),
  });
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const handleChange = (event) => {
    setAge(event.target.value);
    setValue("Category", event.target.value);
  };
  const handlesub = (event) => {
    setsubCate(event.target.value);
    setValue("Sub_Category", event.target.value);
  };

  const EditSubmite = (data) => {
    const allStocksz = ALL_STOCKS.filter(
      (item) =>
        item["Product_name"] === data["Product_name"] &&
        inputdata["productID"] !== item["productID"]
    );
    console.log(allStocksz);
    setloadingState(true);
    if (allStocksz.length > 0) {
      setloadingState(false);
      setError("Product_name", {
        type: "manual",
        message: `${data["Product_name"]} Already exists `,
      });
      dispatch(
        openScackbar({
          open: true,
          type: "warning",
          msg: `${data["Product_name"]} Already exists `,
        })
      );
    } else {
      const db = getDatabase();
      const newData = { ...data, productID: inputdata.productID };
      const updates = {};
      updates[`/System/Inventory/${shopId}/${inputdata["productID"]}`] =
        newData;
      update(ref(db), updates)
        .then(() => {
          setloadingState(false);
          setState(false);
          setState(false);
          dispatch(openScackbar({ open: true, type: "success", msg: "Saved" }));
        })
        .catch((error) => {
          setloadingState(false);
          dispatch(
            openScackbar({ open: true, type: "error", msg: error.message })
          );
        });
    }
  };
  useEffect(() => {
    setValue("Product_name", inputdata["Product_name"]);
    setValue("Brand_name", inputdata["Brand_name"]);
    setValue("Category", inputdata["Category"]);
    setAge(inputdata["Category"]);
    setValue("Sub_Category", inputdata["Sub_Category"]);
    setsubCate(inputdata["Sub_Category"]);
    setValue("Stock_count", inputdata["Stock_count"]);
    setValue("Alert", inputdata["Alert"]);
    setValue("Price", inputdata["Price"]);
    setValue("Cost", inputdata["Cost"]);
    setValue("Warranty", inputdata["Warranty"]);
    setValue("Note", inputdata["Note"]);
  }, [edit]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDelete = () => {
    try {
      // Get a reference to the item you want to delete
      const db = getDatabase();

      const itemRef = ref(
        db,
        `/System/Inventory/${shopId}/${inputdata["productID"]}`
      );

      // Call the remove() function to delete the item
      remove(itemRef).then(() => {
        if (ALL_STOCKS.length == 1) {
          dispatch(setStock([]));
          dispatch(stockFilter([]));
        }
        setState(false);

        dispatch(
          openScackbar({
            open: true,
            type: "success",
            msg: "Item delete completed",
          })
        );
      });
    } catch (error) {
      dispatch(openScackbar({ open: true, type: "error", msg: error.message }));
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold text-black m-2 text-center">
        Edit Product
      </h1>

      <button onClick={handleOpen} className="my-0 mx-auto block">
        <Delete className="text-red scale-150" />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="font-semibold">
            Do you want to delete{" "}
            <span className="text-purple font-bold">
              {inputdata["Product_name"]}
            </span>{" "}
            Item?
          </h1>
          <div className="flex justify-around">
            <button
              onClick={handleClose}
              className="bg-mygreen  font-semibold px-4 py-2"
            >
              No
            </button>
            <button
              onClick={handleDelete}
              className="bg-myredlite font-semibold  px-4 py-2"
            >
              Delete
            </button>
          </div>
        </Box>
      </Modal>
      <form onSubmit={handleSubmit(EditSubmite)} className="m-2">
        <div className="bg-my whxite p-2 shadow-md border-grayLite border  bg-mywhite py-4">
          <TextField
            error={errors.Product_name ? true : false}
            fullWidth
            label="Product Name"
            placeholder="Item Name"
            InputProps={{ sx: { borderRadius: BODER_RADIUS } }}
            {...register("Product_name", { required: true })}
            // InputLabelProps={{
            //   shrink: Boolean(inputdata?.Product_name || errors.Product_name),
            // }}
          />
          <p className="text-myred font-semibold text-xs italic">
            {errors.Product_name?.message}
          </p>
          <TextField
            error={errors.Brand_name ? true : false}
            style={{ marginTop: "1em" }}
            fullWidth
            type="text"
            label="Brand Name"
            placeholder="Samsung"
            InputProps={{ sx: { borderRadius: BODER_RADIUS } }}
            {...register("Brand_name")}
            // InputLabelProps={{
            //   shrink: Boolean(inputdata?.Brand_name || errors.Brand_name),
            // }}
          />
          <p className="text-myred font-semibold text-xs italic">
            {errors.Brand_name?.message}
          </p>
        </div>
        <div className="bg-my white px-2 shadow-md border-grayLite border  mt-4 bg-mywhite py-4">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{"Category"}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label={"Category"}
              onChange={handleChange}
              sx={{ borderRadius: "15px" }}
            >
              {shopData["Category"].map((e, i) => (
                <MenuItem key={"s" + i} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <p className="text-myred font-semibold text-xs italic">
            {errors.Category?.message}
          </p>
          <div style={{ marginTop: "1em" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {"Category"}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subCate}
                label={"Sub Category"}
                onChange={handlesub}
                sx={{ borderRadius: "15px" }}
              >
                {age.length > 0 ? (
                  shopData[`${age}`].map((e, i) => (
                    <MenuItem key={"s" + i} value={e}>
                      {e}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem key={"s"} value={"empty"}>
                    empty
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <p className="text-myred font-semibold text-xs italic">
              {errors.Sub_Category?.message}
            </p>
          </div>
        </div>

        <div className="bg-my white px-2 shadow-md border-grayLite border  bg-mywhite mt-4">
          <TextField
            error={errors.Stock_count ? true : false}
            type="number"
            label="Number of items"
            placeholder="Quantity"
            style={{ marginTop: "1em" }}
            InputProps={{
              sx: { borderRadius: BODER_RADIUS, marginRight: "1em" },
            }}
            {...register("Stock_count", { required: true })}
            // InputLabelProps={{
            //   shrink: Boolean(inputdata?.Product_name || errors.Product_name),
            // }}
          />

          <TextField
            error={errors.Alert ? true : false}
            style={{ marginTop: "1em", marginBottom: "1rem" }}
            type="Alert"
            label="Alert Limit"
            placeholder="Stock Alert Limit"
            InputProps={{ sx: { borderRadius: BODER_RADIUS } }}
            {...register("Alert", { required: true })}
            // InputLabelProps={{
            //   shrink: Boolean(inputdata?.Product_name || errors.Product_name),
            // }}
          />
          <p className="text-myred font-semibold text-xs italic">
            {errors.Stock_count ? "Enter How much Number of Items Adding " : ""}
          </p>
          <p className="text-myred font-semibold text-xs italic">
            {errors.Alert ? "Enter How much Number of Items " : ""}
          </p>
        </div>

        <div className="bg-my white px-2 shadow-md border-grayLite border  mt-4 bg-mywhite flex justify-center items-center">
          <TextField
            error={errors.Price ? true : false}
            style={{ margin: "1em auto" }}
            type="number"
            label="Price"
            placeholder="Item Name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">RS</InputAdornment>
              ),
              sx: { borderRadius: BODER_RADIUS, marginRight: "1em" },
            }}
            {...register("Price", { required: true })}
            // InputLabelProps={{
            //   shrink: Boolean(inputdata?.Product_name || errors.Product_name),
            // }}
          />
          <p className="text-myred font-semibold text-xs italic">
            {errors.Price ? "Enter Item Price" : ""}
          </p>
          <TextField
            error={errors.Price ? true : false}
            style={{ margin: "1em auto" }}
            type="number"
            label="Cost"
            placeholder="Item Cost"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">RS</InputAdornment>
              ),
              sx: { borderRadius: BODER_RADIUS, marginRight: "1em" },
            }}
            {...register("Cost", { required: true })}
            // InputLabelProps={{
            //   shrink: Boolean(inputdata?.Product_name || errors.Product_name),
            // }}
          />
          <p className="text-myred font-semibold text-xs italic">
            {errors.Cost ? "Enter Item Price" : ""}
          </p>
        </div>
        <div className="bg-my white px-2 shadow-md border-grayLite border  mt-4 bg-mywhite py-4">
          <TextField
            fullWidth
            multiline
            rows={1}
            type="text"
            label="Warranty"
            placeholder="Warranty"
            InputProps={{
              sx: { borderRadius: BODER_RADIUS, marginBottom: "1rem" },
            }}
            {...register("Warranty", { required: true })}
          />
          <p className="text-myred font-semibold text-xs italic">
            {errors.Warranty ? "Enter Item Warranty" : ""}
          </p>
          <TextField
            fullWidth
            multiline
            rows={4}
            type="text"
            label="Note"
            placeholder="Aditional Note"
            InputProps={{ sx: { borderRadius: BODER_RADIUS } }}
            {...register("Note")}
            // InputLabelProps={{
            //   shrink: Boolean(inputdata?.Product_name || errors.Product_name),
            // }}
          />
        </div>
        {/* {loadingState ? (
          <CircularProgress />
        ) : ( */}
        <button
          type="submit"
          className="w-full py-4 bg-purple text-mywhite font-semibold border border-purplelite mt-2"
        >
          Add Item
        </button>

        {/* )} */}
      </form>
    </div>
  );
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
