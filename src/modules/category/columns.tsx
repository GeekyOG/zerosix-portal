import { ColumnsType } from "antd/es/table";
import React from "react";
// import React from "react";

export const columns: ColumnsType = [
  {
    title: "Category",
    dataIndex: "name",
    key: "name",
    render: (value) => <p>{value ?? ""}</p>,
  },

  {
    title: "Date added",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (item) => {
      return new Date(Date.parse(item)).toLocaleString();
    },
  },
];
