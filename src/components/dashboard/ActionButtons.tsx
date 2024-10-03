import React, { useState } from "react";
import TableActionButtons from "../../ui/dashboard/TableActionButtons";
import DashboardDrawer from "./Drawer";
import DialogContainer from "../../ui/dashboard/Modal";
import { useDeleteBrandMutation } from "../../api/brandsApi";
import { toast } from "react-toastify";
import { useDeleteFeaturedMutation } from "../../api/featured";
import { useDeletePortfolioMutation } from "../../api/portfolio";
import { useDeleteWorkMutation } from "../../api/imageApi";
// import EditCategory from "../../modules/products/EditCategory";
interface ActionButtonsProps {
  id: string;
  type: string;
  callBackAction?: () => void;
}

function ActionButtons({ id, type, callBackAction }: ActionButtonsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [dialogBtnText, setDialogBtnText] = useState("");

  const [deleteBrand, { isLoading: deleteBrandLoading }] =
    useDeleteBrandMutation();

  const [deleteFeatured, { isLoading: deleteFeaturedLoading }] =
    useDeleteFeaturedMutation();

  const [deletePortfolio, { isLoading: deletePortfolioLoading }] =
    useDeletePortfolioMutation();

  const [deleteWork, { isLoading: deleteWorkLoading }] =
    useDeleteWorkMutation();

  const handleDeleteBrandDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Brand Permanently");
    setDialogContent(
      "Deleting this brand shows this brand would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Brand");
  };
  const handleDeleteBrand = () => {
    deleteBrand(id)
      .then(() => {
        toast.success("Action Successful");
        callBackAction && callBackAction();
      })
      .catch(() => {
        toast.error("Action Failed");
      });
  };

  const handleDeleteFeaturedDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Featured Work Permanently");
    setDialogContent(
      "Deleting this featured work, this featured work would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Featured Work");
  };

  const handleDeleteFeatured = () => {
    deleteFeatured(id)
      .then(() => {
        toast.success("Action Successful");
        callBackAction && callBackAction();
        setShowDialog(true);
      })
      .catch(() => {
        toast.error("Action Failed");
      });
  };

  const handleDeletePortfolioDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Work Portfolio Item");
    setDialogContent(
      "Deleting this portfolio item, this portfolio item would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Portfolio Item");
  };

  const handleDeletePortfolio = () => {
    deletePortfolio(id)
      .then(() => {
        toast.success("Action Successful");
        callBackAction && callBackAction();
        setShowDialog(true);
      })
      .catch(() => {
        toast.error("Action Failed");
      });
  };

  const handleDeleteImageDialog = () => {
    setShowDialog(true);
    setDialogTitle("Delete Work Image Item");
    setDialogContent(
      "Deleting this Image item, this Image item would would not longer be displayed on your website. Please note this action cannot be undone"
    );
    setDialogBtnText("Delete Image Item");
  };

  const handleDeleteImage = () => {
    deleteWork(id)
      .then(() => {
        toast.success("Action Successful");
        callBackAction && callBackAction();
        setShowDialog(true);
      })
      .catch(() => {
        toast.error("Action Failed");
      });
  };

  return (
    <>
      {type === "Featured" && (
        <>
          <TableActionButtons
            handleEdit={() => {
              setDrawerOpen(true);
            }}
            handleDelete={handleDeleteFeaturedDialog}
          />
        </>
      )}

      {type === "Portfolio" && (
        <>
          <TableActionButtons
            handleEdit={() => {
              setDrawerOpen(true);
            }}
            handleDelete={handleDeletePortfolioDialog}
          />
        </>
      )}

      {type === "Brand" && (
        <>
          <TableActionButtons
            handleEdit={() => {
              setDrawerOpen(true);
            }}
            handleDelete={handleDeleteBrandDialog}
          />
        </>
      )}

      {type == "image" && (
        <>
          <TableActionButtons
            handleEdit={() => {
              setDrawerOpen(true);
            }}
            handleDelete={handleDeleteImageDialog}
          />
        </>
      )}
      <DashboardDrawer
        id={id}
        callBackAction={() => {
          setDrawerOpen(false);
          if (callBackAction) callBackAction();
        }}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={type}
      />
      {showDialog && (
        <DialogContainer
          setDialogOpen={setShowDialog}
          title={dialogTitle}
          btnText={dialogBtnText}
          description={dialogContent}
          isLoading={
            deleteBrandLoading ||
            deleteFeaturedLoading ||
            deletePortfolioLoading ||
            deleteWorkLoading
          }
          type={"delete"}
          image={"/delete.svg"}
          action={
            (dialogTitle == "Delete Brand Permanently" && handleDeleteBrand) ||
            (dialogTitle == "Delete Featured Work Permanently" &&
              handleDeleteFeatured) ||
            (dialogTitle == "Delete Work Portfolio Item" &&
              handleDeletePortfolio) ||
            (dialogTitle == "Delete Work Image Item" && handleDeleteImage) ||
            function (): void {
              throw new Error("Function not implemented.");
            }
          }
        />
      )}
    </>
  );
}

export default ActionButtons;
