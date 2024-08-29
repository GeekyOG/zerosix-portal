import React, { useEffect, useState } from "react";
import Container from "../ui/Container";
import { ArrowRight } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import Button from "../ui/Button";
import DashboardDrawer from "../components/dashboard/Drawer";
import { useLazyGetAllFeaturedQuery } from "../api/featured";

function Featured() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleAddFeatured = () => {
    setDrawerOpen(true);
  };

  const [getAllFeatured, { data, isFetching }] = useLazyGetAllFeaturedQuery();

  useEffect(() => {
    getAllFeatured("");
  }, [getAllFeatured]);

  const handleGetAllFeatured = () => {
    getAllFeatured("");
    setDrawerOpen(false);
  };
  return (
    <Container className="pb-[200px]">
      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[1.2rem] font-[400]">Featured Works</p>

          <div className="flex cursor-pointer items-center mt-3">
            <Button onClick={handleAddFeatured}>Add Featured Work</Button>
          </div>
        </div>

        <DashboardTable
          columns={columns}
          data={data || []}
          isFetching={isFetching}
          type={"Featured"}
          callBackAction={handleGetAllFeatured}
        />
        <DashboardDrawer
          callBackAction={handleGetAllFeatured}
          open={drawerOpen}
          setOpen={setDrawerOpen}
          whatForm={"Featured"}
        />
      </div>
    </Container>
  );
}

export default Featured;
