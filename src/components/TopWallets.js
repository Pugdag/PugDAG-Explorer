import React, { useState, useEffect, useCallback } from "react";
import { Container, Spinner, Pagination } from "react-bootstrap";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { PieChart, pieChartDefaultProps } from "react-minimal-pie-chart";
import { useWindowSize } from "react-use";
import { getCoinSupply } from "../pugdag-api-client";

const testData = `
Address,Balance
pugdag:qq2eecuzygu7hptkn9rch8z8c3adr5mtyv5w69x6m5mwrvtz80wz6jqwnahml,956732578311665
pugdag:qz0vs7dkpatuyl5n77gpguc0dd0anmskdfp5yerss04xcljhdlkzk8yrm2kzd,956392452957145
pugdag:qz6qz78vt5h3l26rwfqhk0qj26t2xh65lrhfgpwxqqcaykp5t0l2kssn3cyaa,952404352145380
pugdag:qpldvahz3sgxsspl2wezppm99vz4r5kpqlz7ddjh2sytgx5jgmsccp9329xcy,824257538375117
pugdag:qz0vs7dkpatuyl5n77gpguc0dd0anmskdfp5yerss04xcljhdlkzk8yrm2kzd,956392452957145
pugdag:qz6qz78vt5h3l26rwfqhk0qj26t2xh65lrhfgpwxqqcaykp5t0l2kssn3cyaa,952404352145380
New Wallets,286
`;

const shiftSize = 7;

const TopWallets = () => {
  const [circCoins, setCircCoins] = useState("-");
  const [addresses, setAddresses] = useState([]);
  const [totalAddresses, setTotalAddresses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [chartData, setChartData] = useState([]);
  const [holdingData, setHoldingData] = useState([]);
  const [newWallets, setNewWallets] = useState(0); // New state for new wallets
  const { width } = useWindowSize();

  const navigate = useNavigate();

  const onClickAddr = (e) => {
    navigate(`/addresses/${e.target.closest("tr").getAttribute("id")}`);
  };

  const calculateCharts = useCallback(
    (addresses) => {
      const nonZeroAddresses = addresses.filter(address => address.balance > 0);
      const balanceRanges = {
        "> 100M PUG": 0,
        "> 10M PUG": 0,
        "> 1M PUG": 0,
        "> 100K PUG": 0,
        "> 10K PUG": 0,
        "> 1K PUG": 0,
        "> 100 PUG": 0,
        "< 100 PUG": 0,
      };
      const holdingRanges = {
        "Top 5": 0,
        "Top 10": 0,
        "Top 100": 0,
        "Top 1000": 0,
        "Top 10000": 0,
      };

      let xeggeXBalance = 0;

      nonZeroAddresses.forEach((address, index) => {
        const balance = parseFloat(address.balance);
        if (index === 0) {
          xeggeXBalance = balance;
        } else {
          if (balance >= 100000000) {
            balanceRanges["> 100M PUG"]++;
          } else if (balance >= 10000000 && balance < 100000000) {
            balanceRanges["> 10M PUG"]++;
          } else if (balance >= 1000000 && balance < 10000000) {
            balanceRanges["> 1M PUG"]++;
          } else if (balance >= 100000 && balance < 1000000) {
            balanceRanges["> 100K PUG"]++;
          } else if (balance >= 10000 && balance < 100000) {
              balanceRanges["> 10K PUG"]++;
          } else if (balance >= 1000 && balance < 10000) {
              balanceRanges["> 1K PUG"]++;
          } else if (balance >= 100 && balance < 1000) {
              balanceRanges["> 100 PUG"]++;
          } else if (balance > 0 && balance < 100) {
            balanceRanges["< 100 PUG"]++;
          }

          if (index > 0 && index <= 5) {
            holdingRanges["Top 5"] += balance;
          } else if (index > 5 && index <= 10) {
            holdingRanges["Top 10"] += balance;
          } else if (index > 10 && index <= 100) {
            holdingRanges["Top 100"] += balance;
          } else if (index > 100 && index <= 1000) {
            holdingRanges["Top 1000"] += balance;
          } else if (index > 1000 && index <= 10000) {
              holdingRanges["Top 10000"] += balance;
          }
        }
      });

      const totalSupply = nonZeroAddresses.reduce((sum, address) => sum + parseFloat(address.balance), 0);
      const holdingPercentage = {
        "Top 5": (holdingRanges["Top 5"] / totalSupply) * 100,
        "Top 10": (holdingRanges["Top 10"] / totalSupply) * 100,
        "Top 100": (holdingRanges["Top 100"] / totalSupply) * 100,
        "Top 1000": (holdingRanges["Top 1000"] / totalSupply) * 100,
        "Top 10000": (holdingRanges["Top 10000"] / totalSupply) * 100,
      };

      const totalNonZeroAddresses = nonZeroAddresses.length;  

      const holdingData = [
        { title: "XeggeX", value: (xeggeXBalance / totalSupply) * 100, color: "#E6E6FA"},
        { title: "Top 5", value: holdingPercentage["Top 5"], color: "#D8BFD8"},
        { title: "Top 10", value: holdingPercentage["Top 10"], color: "#DDA0DD"},
        { title: "Top 100", value: holdingPercentage["Top 100"], color: "#DA70D6"},
        { title: "Top 1000", value: holdingPercentage["Top 1000"], color: "#BA55D3"},
        { title: "Top 10000", value: holdingPercentage["Top 10000"], color: "#9932CC"},
      ];
      setHoldingData(holdingData);
      
      const chartData = [
        { title: "> 100M PUG", value: (balanceRanges["> 100M PUG"] / totalNonZeroAddresses) * 100, color: "#E6E6FA"},
        { title: "> 10M PUG", value: (balanceRanges["> 10M PUG"] / totalNonZeroAddresses) * 100, color: "#D8BFD8"},
        { title: "> 1M PUG", value: (balanceRanges["> 1M PUG"] / totalNonZeroAddresses) * 100, color: "#DDA0DD"},
        { title: "> 100K PUG", value: (balanceRanges["> 100K PUG"] / totalNonZeroAddresses) * 100, color: "#DA70D6"},
        { title: "> 10K PUG", value: (balanceRanges["> 10K PUG"] / totalNonZeroAddresses) * 100, color: "#BA55D3"},
        { title: "> 1K PUG", value: (balanceRanges["> 1K PUG"] / totalNonZeroAddresses) * 100, color: "#9932CC"},
        { title: "> 100 PUG", value: (balanceRanges["> 100 PUG"] / totalNonZeroAddresses) * 100, color: "#8A2BE2"},
        { title: "< 100 PUG", value: (balanceRanges["< 100 PUG"] / totalNonZeroAddresses) * 100, color: "#4B0082"}
      ];
      setChartData(chartData);
      setTotalAddresses(addresses.length);
    },
    []
  );

  useEffect(() => {
    if (circCoins !== "-" && addresses.length > 0) {
      calculateCharts(addresses);
    }
  }, [circCoins, addresses, calculateCharts]);

  useEffect(() => {
    const fetchCircCoins = async () => {
      const coinSupplyResp = await getCoinSupply();
      console.log(coinSupplyResp);
      setCircCoins(Math.round(coinSupplyResp.circulatingSupply / 100000000));
    };
    fetchCircCoins();
  }, []);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch("https://pugdag.com/pug_addresses2.csv");
        const data = await response.text();
        const rows = data.trim().split("\n");
        const parsedAddresses = rows.slice(1, -1).map((row, index) => {
          const [address, balance] = row.split(",");
          return { index, address, balance: parseFloat(balance / 100000000), note: "" };
        });

        const newWalletsLine = rows[rows.length - 1];
        const newWalletsValue = parseInt(newWalletsLine.split(",")[1]);

        setAddresses(parsedAddresses);
        setNewWallets(newWalletsValue);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the CSV file:", error);
        const rows = testData.trim().split("\n");
        const parsedAddresses = rows.slice(1, -1).map((row, index) => {
          const [address, balance] = row.split(",");
          return { index, address, balance: parseFloat(balance) / 100000000, note: "" };
        });

        const newWalletsLine = rows[rows.length - 1];
        const newWalletsValue = parseInt(newWalletsLine.split(",")[1]);

        setAddresses(parsedAddresses);
        setNewWallets(newWalletsValue);
        setLoading(false);
      }
    };

    fetchCSV();
  }, []);

  const totalPages = Math.ceil(addresses.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = addresses.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  let startPage = Math.max(1, currentPage - 4);
  let endPage = Math.min(startPage + 9, totalPages);

  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - 9);
  }

  return (
    <div className="blocks-page">
      <Container className="webpage px-md-5 blocks-page-overview" fluid>
        <div className="block-overview mb-4">
          <div className="d-flex flex-row w-100">
            <h4 className="block-overview-header text-center w-100 mt-4">
              <RiMoneyDollarCircleFill className={"rotate"} size="1.7rem" />
              Top Wallets
            </h4>
          </div>
          <div className="block-overview-content">
            {loading ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <>
                <table className={`styled-table w-100`}>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Balance</th>
                      <th>Note</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map((address, index) => (
                      <tr key={index} id={address.address}>
                        <td>{address.index}</td>
                        <td>{Number(address.balance).toLocaleString()}</td>
                        <td>{address.index === 0 ? "XeggeX" : address.note}</td>
                        <td className="hashh w-100" onClick={onClickAddr}>
                          {address.address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(endPage - startPage + 1)].map((_, i) => (
                      <Pagination.Item key={startPage + i} active={startPage + i === currentPage} onClick={() => handlePageChange(startPage + i)}>
                        {startPage + i}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                  </Pagination>
                </div>
                <h4 className="block-overview-header text-center w-100 mt-4">PUG distribution</h4>              
                <div className="d-flex justify-content-center mt-4">
                  <PieChart
                     data={chartData}
                     label={({ dataEntry }) => `${dataEntry.value.toFixed(2)}% ${dataEntry.title}`}
                     lineWidth={50}
                     paddingAngle={5}
                     radius={pieChartDefaultProps.radius - 10}
                    
                     labelStyle={{
                       fill: "#fff",
                       fontSize: "3px",
                       fontFamily: "sans-serif",
                     }}
                     labelPosition={105}
                     style={{ maxHeight: width < 768 ? "250px" : "350px", width: "100%" }}
                     lengthAngle={360}
                  />
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <PieChart
                   data={holdingData}
                   label={({ dataEntry }) => `${parseFloat(dataEntry.value).toFixed(2)}% ${dataEntry.title}`}
                   lineWidth={50}
                   paddingAngle={5}
                   radius={pieChartDefaultProps.radius - 10} 
                   labelStyle={{
                     fill: "#fff",
                     fontSize: "3px", 
                     fontFamily: "sans-serif",
                   }}
                   labelPosition={110} 
                   style={{ maxHeight: width < 768 ? "250px" : "350px", width: "100%" }}
                   lengthAngle={360}
                  />
                </div>
                <div className="d-flex flex-column align-items-center mt-4">
                  <p style={{ fontSize: "12px", fontStyle: "italic", marginBottom: "30px" }}>
                    *Wallets with no PUG are excluded from the charts
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "bold", textAlign: "center" }}>
                    Total wallets: {totalAddresses}
                    <br />
                    New daily wallets: +{newWallets}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopWallets;

