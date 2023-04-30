import "./Dashboard.css";
import { React, useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import "chartjs-adapter-luxon";
import zoomPlugin from "chartjs-plugin-zoom";
import { getCellData, getCellIds } from "../../services/cell";
import PwrChart from "../../charts/pwrChart/pwrChart";
import VChart from "../../charts/vChart/vChart";
import VwcChart from "../../charts/vwcChart/vwcChart";
import TempChart from "../../charts/tempChart/tempChart";
import Button from "@mui/material/Button";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateTime } from "luxon";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import DownloadBtn from "../../components/DownloadBtn";

Chart.register(CategoryScale);
Chart.register(zoomPlugin);

function Dashboard() {
  const [startDate, setStartDate] = useState(DateTime.utc());
  const [dBtnDisabled, setDBtnDisabled] = useState(true);
  const [cellData, setCellData] = useState({});
  const [selectedCell, setSelectedCell] = useState(0);
  const [cellIds, setCellIds] = useState({
    data: [],
  });
  const [tempChartData, setTempChartData] = useState({
    label: [],
    datasets: [
      {
        data: [],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [vChartData, setVChartData] = useState({
    label: [],
    datasets: [
      {
        data: [],
        borderColor: "black",
        borderWidth: 2,
        yAxisID: "vAxis",
      },
      {
        data: [],
        borderColor: "black",
        borderWidth: 2,
        yAxisID: "cAxis",
      },
    ],
  });
  const [pwrChartData, setPwrChartData] = useState({
    label: [],
    datasets: [
      {
        label: "Voltage",
        data: [],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [vwcChartData, setVWCChartData] = useState({
    label: [],
    datasets: [
      {
        label: "VWC",
        data: [],
        borderColor: "black",
        borderWidth: 2,
        yAxisID: "vwcAxis",
      },
      {
        label: "EC",
        data: [],
        borderColor: "black",
        borderWidth: 2,
        yAxisID: "ecAxis",
      },
    ],
  });

  const updateCharts = (sC) => {
    getCellData(sC).then((response) => {
      const cellDataObj = JSON.parse(response.data);
      setCellData(cellDataObj);
      setVChartData({
        labels: cellDataObj.timestamp,
        datasets: [
          {
            label: "Voltage (v)",
            data: cellDataObj.v,
            borderColor: "lightgreen",
            borderWidth: 2,
            fill: false,
            yAxisID: "vAxis",
            radius: 2,
            pointRadius: 2,
          },
          {
            label: "Current (µA)",
            data: cellDataObj.i,
            borderColor: "purple",
            borderWidth: 2,
            fill: false,
            yAxisID: "cAxis",
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
      setPwrChartData({
        labels: cellDataObj.timestamp,
        datasets: [
          {
            label: "Power (µV)",
            data: cellDataObj.p,
            borderColor: "orange",
            borderWidth: 2,
            fill: false,
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
      setVWCChartData({
        labels: cellDataObj.timestamp,
        datasets: [
          {
            label: "Volumetric Water Content (VWC)",
            data: cellDataObj.vwc,
            borderColor: "blue",
            borderWidth: 2,
            fill: false,
            yAxisID: "vwcAxis",
            radius: 2,
            pointRadius: 2,
          },
          {
            label: "Electrical Conductivity (µS/cm)",
            data: cellDataObj.ec,
            borderColor: "black",
            borderWidth: 2,
            fill: false,
            yAxisID: "ecAxis",
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
      setTempChartData({
        labels: cellDataObj.timestamp,
        datasets: [
          {
            label: "Temperature",
            data: cellDataObj.temp,
            borderColor: "red",
            borderWidth: 2,
            fill: false,
            radius: 2,
            pointRadius: 2,
          },
        ],
      });
    });
  };

  function changeCell(e) {
    setSelectedCell(e.target.value);
  }

  useEffect(() => {
    updateCharts(selectedCell);
  }, [selectedCell]);

  useEffect(() => {
    setDBtnDisabled(false);
  }, [setCellData]);

  useEffect(() => {
    getCellIds().then((response) => {
      setCellIds({
        data: JSON.parse(response.data),
      });

      // setSelectedCell();
    });
  }, []);
  useEffect(() => {
    if (cellIds.data[0]) {
      updateCharts(cellIds.data[0][0]);
    }
  }, [cellIds]);

  return (
    <div className="Dashboard">
      <div onChange={changeCell}>
        {cellIds.data.map(([id, name]) => {
          return (
            <div key={id}>
              <input type="radio" value={id} name="selectCell" /> {name}
            </div>
          );
        })}
      </div>
      <button type="button" className="btn2" onClick={getCellIds}>
        GetCellIds
      </button>
      <button
        type="button"
        className="btn btn-sm btn-primary"
        onClick={() => updateCharts(selectedCell)}
      >
        GetCellData
      </button>
      <div className="grid-chart">
        <VChart data={vChartData} />
        <PwrChart data={pwrChartData} />
        <VwcChart data={vwcChartData} />
        <TempChart data={tempChartData} />
        <Button variant="contained">Hello World</Button>
      </div>
      <DownloadBtn disabled={dBtnDisabled} data={cellData} />

      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DateTimePicker
          label="Controlled picker"
          value={startDate}
          onChange={(startDate) => setStartDate(startDate)}
        />
      </LocalizationProvider>
    </div>
  );
}

export default Dashboard;
