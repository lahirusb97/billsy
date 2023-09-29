import React, { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { useSelector } from "react-redux";

//nested data is ok, see accessorKeys in ColumnDef below
const data = [
  {
    name: {
      firstName: "John",
      lastName: "Doe",
    },
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
  },
  {
    name: {
      firstName: "Jane",
      lastName: "Doe",
    },
    address: "769 Dominic Grove",
    city: "Columbus",
    state: "Ohio",
  },
  {
    name: {
      firstName: "Joe",
      lastName: "Doe",
    },
    address: "566 Brakus Inlet",
    city: "South Linda",
    state: "West Virginia",
  },
  {
    name: {
      firstName: "Kevin",
      lastName: "Vandy",
    },
    address: "722 Emie Stream",
    city: "Lincoln",
    state: "Nebraska",
  },
  {
    name: {
      firstName: "Joshua",
      lastName: "Rolluffs",
    },
    address: "32188 Larkin Turnpike",
    city: "Charleston",
    state: "South Carolina",
  },
];

const ItemTable = ({ state, setState, setEdit, edit }) => {
  const ALL_STOCKS = useSelector((state) => state.stock_data.FILTER_STOCK);
  const Stock_manage = useSelector(
    (state) => state.user_data.userData["Stock_manage"]
  );

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "Product_name", //access nested data with dot notation
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "Price",
        header: "Price",
        size: 150,
      },
      {
        accessorKey: "Cost", //normal accessorKey
        header: "Cost",
        size: 200,
      },
      {
        accessorKey: "Stock_count",
        header: "Stock",
        size: 150,
      },
      {
        accessorKey: "Sub_Category",
        header: "Sub Category",
        size: 150,
      },
      {
        accessorKey: "Category",
        header: "Category",
        size: 150,
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={ALL_STOCKS}
      muiTableBodyRowProps={({ row }) => ({
        onClick: (event) => {
          console.log(ALL_STOCKS[row.index]);
          if (Stock_manage) {
            setState(true);
            setEdit(true, ALL_STOCKS[row.index]);
          } else {
            setState(false);
            setEdit(false, {});
          }
        },
        sx: {
          cursor: "pointer", //you might want to change the cursor too when adding an onClick
        },
      })}
    />
  );
};

export default ItemTable;
