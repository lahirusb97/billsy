import { TextField } from "@mui/material";
import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addItem } from "../../Store/Slices/InvoiceSlice";

export default function CoustomBillItem() {
  const dispatch = useDispatch();
  const schema = yup.object({
    Product_name: yup
      .string()
      .transform((value) => value.toLowerCase())
      .required("Enter Product Name"),
    Price: yup.number().required("Enter Item Price"),
    Cost: yup.number().required("Enter Item Cost"),
    Qty: yup.number(),
    Warranty: yup.string().transform((value) => value.toLowerCase()),
    UnitPrice: yup.number(),
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Qty: 1,
      UnitPrice: 0,
    },
  });
  React.useEffect(() => {
    setValue("UnitPrice", watch("Price"));
  }, [watch("Price"), setValue]);
  const onSubmit = (data) => {
    dispatch(addItem(data));
  };
  return (
    <div className="flex flex-col m-4">
      <h1 className="font-semibold my-4 text-2xl">Add Coustom Item</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          style={{ width: "100%" }}
          label="Product Name"
          {...register("Product_name", { required: true })}
        />
        <p className="text-myred font-semibold text-xs italic">
          {errors.Product_name?.message}
        </p>
        <TextField
          style={{ marginTop: "1rem", marginRight: "1rem" }}
          label="Price"
          {...register("Price", { required: true })}
        />
        <p className="text-myred font-semibold text-xs italic">
          {errors.Price?.message}
        </p>
        <TextField
          style={{ marginTop: "1rem" }}
          label="Cost"
          {...register("Cost", { required: true })}
        />
        <p className="text-myred font-semibold text-xs italic">
          {errors.Cost?.message}
        </p>

        <TextField
          style={{ marginTop: "1rem" }}
          label="Warranty"
          {...register("Warrenty", { required: true })}
        />
        <p className="text-myred font-semibold text-xs italic">
          {errors.Warranty?.message}
        </p>
        <button className="bg-mygreen w-full py-2 mt-4" type="submit">
          Add
        </button>
      </form>
    </div>
  );
}
