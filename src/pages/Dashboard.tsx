import React, { useEffect, useState } from "react";
import DashboardBox from "../ui/dashboard/DashboardBox";
import Container from "../ui/Container";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import DashboardTable from "../components/dashboard/DashboardTable";
import { columns } from "../modules/portfolio/columns";
import {
  useGetOverviewQuery,
  useLazyGetOverviewQuery,
} from "../api/overviewApi";
import {
  useGetAllPortfolioQuery,
  useLazyGetAllPortfolioQuery,
} from "../api/portfolio";
import DashboardDrawer from "../components/dashboard/Drawer";

function Dashboard() {
  const navigate = useNavigate();

  const [getOverview, { isFetching: overviewLoading, data: overviewData }] =
    useLazyGetOverviewQuery();

  const [getAllPortfolio, { data: portfolioData, isFetching }] =
    useLazyGetAllPortfolioQuery();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [whatForm, setWhatForm] = useState("");

  useEffect(() => {
    getAllPortfolio("");
    getOverview("");
  }, []);

  const handleGetOverview = () => {
    setDrawerOpen(false);
    getOverview("");
    getAllPortfolio("");
  };

  const handleAddBrand = () => {
    setDrawerOpen(true);
    setWhatForm("Brand");
  };

  const handleAddPortfolio = () => {
    setDrawerOpen(true);
    setWhatForm("Portfolio");
  };

  const handleAddFeatured = () => {
    setDrawerOpen(true);
    setWhatForm("Featured");
  };

  return (
    <Container className="pb-[200px]">
      <div className="flex gap-3">
        <DashboardBox
          title={"Total Brands"}
          value={overviewData?.brands ?? 0}
          handleClick={handleAddBrand}
        />
        <DashboardBox
          title={"Total Portfolio Projects"}
          value={overviewData?.portfolios ?? 0}
          handleClick={handleAddPortfolio}
        />
        {/* <DashboardBox
          title={"Total Featured"}
          value={overviewData?.featuredWorks ?? 0}
          handleClick={handleAddFeatured}
        /> */}
      </div>
      <div className="mt-[26px]">
        <div className="flex items-center justify-between text-[0.895rem] font-[500]">
          <p className="text-[1.2rem] font-[400]">
            Recently Added to Portfolio
          </p>

          <div className="flex cursor-pointer items-center mt-3">
            <Link
              to="/dashboard/portfolio"
              className="font-[300] text-[#0505ab]"
            >
              View all
            </Link>
            <ArrowRight size={16} className="text-[#0505ab]" />
          </div>
        </div>

        <DashboardTable
          columns={columns}
          data={portfolioData ?? []}
          isFetching={isFetching}
          type="Portfolio"
          callBackAction={handleGetOverview}
        />
      </div>
      <DashboardDrawer
        callBackAction={handleGetOverview}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        whatForm={whatForm}
      />
    </Container>
  );
}

export default Dashboard;
