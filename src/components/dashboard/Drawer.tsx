import React, { useState } from "react";
import { Button, Drawer } from "antd";
import AddBrandForm from "../forms/AddBrandForm";
import AddPortfolioForm from "../forms/PortfolioForm";
import AddFeaturedForm from "../forms/AddFeatured";
import AddImageForm from "../forms/ImageForm";

interface DashboardDrawerProps {
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  whatForm: string;
  callBackAction?: () => void;
}

const DashboardDrawer: React.FC<DashboardDrawerProps> = ({
  open,
  setOpen,
  whatForm,
  callBackAction,
  id,
}) => {
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={
          (whatForm == "Brand" && "Add Brand") ||
          (whatForm == "Portfolio" && "Add Portfolio") ||
          (whatForm == "Featured" && "Add Featured")
        }
        onClose={onClose}
        open={open}
      >
        {whatForm == "Brand" && (
          <AddBrandForm reset={open} callBackAction={callBackAction} id={id} />
        )}
        {whatForm == "Portfolio" && (
          <AddPortfolioForm
            reset={open}
            id={id}
            callBackAction={callBackAction}
          />
        )}
        {whatForm == "Featured" && (
          <AddFeaturedForm
            reset={open}
            id={id}
            callBackAction={callBackAction}
          />
        )}
        {whatForm == "image" && (
          <AddImageForm reset={open} id={id} callBackAction={callBackAction} />
        )}
      </Drawer>
    </>
  );
};

export default DashboardDrawer;
