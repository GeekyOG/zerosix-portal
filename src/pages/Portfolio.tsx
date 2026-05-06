import React, { useEffect, useState } from "react";
import Container from "../ui/Container";
import { ArrowRight } from "lucide-react";
import { columns } from "../modules/portfolio/columns";
import DashboardDrawer from "../components/dashboard/Drawer";
import Button from "../ui/Button";
import {
  useLazyGetAllPortfolioQuery,
  useUpdatePortfolioMutation,
  useUpdatePortfolioPositionMutation,
} from "../api/portfolio";
import DashboardTable from "../components/dashboard/DragableDashboardTable";

function Portfolio() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleAddPortfolio = () => {
    setDrawerOpen(true);
  };

  const [updatePortfolioPosition] = useUpdatePortfolioPositionMutation();

  const handlePositionUpdate = async (
    id: string | number,
    position: number,
  ) => {
    await updatePortfolioPosition({ id, position }).unwrap();
  };
  const [getAllPortfolio, { isFetching, data }] = useLazyGetAllPortfolioQuery();

  useEffect(() => {
    getAllPortfolio("");
  }, []);

  const handleGetPortfolio = () => {
    getAllPortfolio("");
    setDrawerOpen(false);
  };
  return (
    <Container className="pb-[200px]">
      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[1.2rem] font-[400]">Portfolio</p>

          <div className="flex cursor-pointer items-center mt-3">
            <Button onClick={handleAddPortfolio}>Add Featured Work</Button>
          </div>
        </div>

        <DashboardTable
          columns={columns}
          data={data || []}
          isFetching={isFetching}
          type="Portfolio"
          callBackAction={handleGetPortfolio}
          onPositionUpdate={handlePositionUpdate}
        />
      </div>
      <DashboardDrawer
        callBackAction={handleGetPortfolio}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={"Portfolio"}
      />
    </Container>
  );
}

export default Portfolio;
