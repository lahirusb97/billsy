/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
//*MUI
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
//* Firebase
import { getDatabase, ref, push, update } from "firebase/database";
// import { getDatabase, ref, onValue } from "firebase/database";

const BODER_RADIUS = "15px";

export default function Addproduct({ setState }) {
  const [age, setAge] = React.useState("");
  const [subCate, setsubCate] = React.useState("");
  const [loadingState, setloadingState] = React.useState(false);
  const shopData = useSelector((state) => state.stock_data.CATEGORY_DATA);

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
    Note: yup.string().transform((value) => value.toLowerCase()),
  });
  const {
    register,
    handleSubmit,
    setValue,
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

  const onSubmit = (data) => {
    setloadingState(true);
    const db = getDatabase();

    const productID = push(ref(db, `/System/Inventory/${shopId}/`)).key;
    const newData = { ...data, productID }; // Add productID to the data object
    const updates = {};
    updates[`/System/Inventory/${shopId}/${productID}/`] = newData;
    update(ref(db), updates)
      .then(() => {
        setloadingState(false);
        setState(false);
      })
      .catch((error) => {
        setloadingState(false);

        console.error("Error adding product:", error.message);
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-black m-2 text-center">
        Add Product
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="m-2">
        <div className="bg-my whxite p-2 shadow-md border-grayLite border  bg-mywhite py-4">
          <TextField
            error={errors.Product_name ? true : false}
            fullWidth
            label="Product Name"
            placeholder="Item Name"
            InputProps={{ sx: { borderRadius: BODER_RADIUS } }}
            {...register("Product_name", { required: true })}
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
          />

          <TextField
            error={errors.Alert ? true : false}
            style={{ marginTop: "1em", marginBottom: "1rem" }}
            type="Alert"
            label="Alert Limit"
            placeholder="Stock Alert Limit"
            InputProps={{ sx: { borderRadius: BODER_RADIUS } }}
            {...register("Alert", { required: true })}
          />
          <p className="text-myred font-semibold text-xs italic">
            {errors.Stock_count ? "Enter How much Number of Items Adding " : ""}
          </p>
          <p className="text-myred font-semibold text-xs italic">
            {errors.Alert ? "Enter How much Number of Items " : ""}
          </p>
        </div>

        <div className="bg-my white px-2 shadow-md border-grayLite border  mt-4 bg-mywhite flex justify-center items-center flex-col">
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
          />
          <p className="text-myred font-semibold text-xs italic">
            {errors.Price ? "Enter Item Price" : ""}
          </p>
        </div>
        <div className="bg-my white px-2 shadow-md border-grayLite border  mt-4 bg-mywhite py-4">
          <TextField
            fullWidth
            multiline
            rows={4}
            type="text"
            label="Note"
            placeholder="Aditional Note"
            InputProps={{ sx: { borderRadius: BODER_RADIUS } }}
            {...register("Note")}
          />
        </div>
        {loadingState ? (
          <CircularProgress />
        ) : (
          <button
            type="submit"
            className="w-full py-4 bg-purple text-mywhite font-semibold border border-purplelite mt-2"
          >
            Add Item
          </button>
        )}
      </form>
    </div>
  );
}
