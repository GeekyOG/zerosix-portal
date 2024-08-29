import { ColumnsType } from "antd/es/table";
import React from "react";
// import React from "react";

export const columns: ColumnsType = [
  {
    title: "Thumbnail Image",
    dataIndex: "imgUrl",
    key: "imgUrl",
    render(value) {
      return <img src={value} alt="thumbnail" width={60} />;
    },
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
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
