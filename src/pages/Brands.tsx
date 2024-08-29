import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import DashboardTable from "../components/dashboard/DashboardTable";
import Container from "../ui/Container";
import { columns } from "../modules/brands/columns";
import Button from "../ui/Button";
import DashboardDrawer from "../components/dashboard/Drawer";
import { useGetBrandsQuery, useLazyGetBrandQuery } from "../api/brandsApi";

function Brands() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [whatForm, setWhatForm] = useState("");
  const handleAddBrand = () => {
    setDrawerOpen(true);
    setWhatForm("Brand");
  };

  const [getBrands, { isFetching, data }] = useLazyGetBrandQuery();

  useEffect(() => {
    getBrands("");
  }, []);

  const handleGetBrands = () => {
    getBrands("");
    setDrawerOpen(false);
  };

  return (
    <Container className="pb-[200px]">
      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[1.2rem] font-[400]">Brands</p>

          <div className="flex cursor-pointer items-center mt-3">
            <Button onClick={handleAddBrand}>Add Brand</Button>
          </div>
        </div>

        <DashboardTable
          columns={columns}
          data={data || []}
          isFetching={isFetching}
          type={"Brand"}
          callBackAction={handleGetBrands}
        />
      </div>

      <DashboardDrawer
        callBackAction={handleGetBrands}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={whatForm}
      />
    </Container>
  );
}

export default Brands;
