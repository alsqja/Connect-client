import { useGetDailyPaymentChart } from "../../hooks/adminApi";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DateSelector } from "../../components/DateSelector";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { chartType, getDataType } from "./data";


export const AdminChart = () => {
  const [getDailySaleChart, getDailySaleChartRes] = useGetDailyPaymentChart();
  const [getDailySecondSaleChart, getDailySecondSaleChartRes] = useGetDailyPaymentChart();
  const [chartData, setChartData] = useState<any>([]);
  const [newChartData, setNewChartData] = useState<getDataType[]>([]);
  const [oldChartData, setOldChartData] = useState<getDataType[]>([]);
  const [searchDate, setSearchDate] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState("sales");

  useEffect(() => {
    getDailySaleData();
  }, []);

  useEffect(() => {
    getDailySaleData();
  }, [searchDate, setSearchDate, activeChart]);

  const getDailySaleData = useCallback(() => {
    const targetDate = searchDate ? new Date(searchDate) : new Date();
    const startDate = dayjs(targetDate).startOf("month").format("YYYY-MM-DD");
    const endDate = dayjs(targetDate).endOf("month").format("YYYY-MM-DD")

    getDailySaleChart(startDate, endDate);

    getDailySecondSaleChart(
      dayjs(startDate).subtract(1, "months").format("YYYY-MM-DD"),
      dayjs(startDate).subtract(1, "day").format("YYYY-MM-DD")
    );
  }, [getDailySaleChart, getDailySecondSaleChart, searchDate]);

  useEffect(() => {
    if (getDailySaleChartRes.data) {
      setNewChartData(getDailySaleChartRes.data.data);
    }
    if (getDailySecondSaleChartRes.data) {
      setOldChartData(getDailySecondSaleChartRes.data.data);
    }
  }, [getDailySaleChartRes, getDailySecondSaleChartRes]);

  useEffect(() => {
    const newMonth = dayjs(searchDate ? searchDate : Date.now()).startOf("month");
    const oldMonth = newMonth.subtract(1, "month").startOf("month");

    const daysInMonth = newMonth.daysInMonth();
    const daysInPrevMonth = oldMonth.daysInMonth();
    const maxDays = Math.max(daysInMonth, daysInPrevMonth);

    const newDataMap = new Map();
    const oldDataMap = new Map();

    newChartData.forEach(({ date, sales, cumulativeSales }: getDataType) => {
      newDataMap.set(dayjs(date).date(), { sales, cumulativeSales });
    });

    oldChartData.forEach(({ date, sales, cumulativeSales }: getDataType) => {
      oldDataMap.set(dayjs(date).date(), { sales, cumulativeSales });
    });

    const mergedMap: chartType[] = [];

    for (let i = 1; i <= maxDays; i++) {
      const newEntry = newDataMap.get(i) || { sales: 0, cumulativeSales: 0 };
      const oldEntry = oldDataMap.get(i) || { sales: 0, cumulativeSales: 0 };

      mergedMap.push({
        date: `${i} 일`,
        newData: activeChart === "sales" ? newEntry.sales : newEntry.cumulativeSales,
        oldData: activeChart === "sales" ? oldEntry.sales : oldEntry.cumulativeSales,
        newLabel: `${newMonth.date(i).format("YYYY-MM-DD")}`,
        oldLabel: `${oldMonth.date(i).format("YYYY-MM-DD")}`
      });
    }
    setChartData(mergedMap);
  }, [newChartData, oldChartData]);


  const formatY = (data: number) => {
    return data.toLocaleString("ko-KR").toString().replace(/,000$/, "") + "천원";
  }

  const formatLegend = (value: string) => {
    const legendMap = {
      newData: `${dayjs(searchDate ?? Date.now()).format("MM")} 월`,
      oldData: `${dayjs(searchDate ?? Date.now()).subtract(1, "month").format("MM")} 월`
    };
    return legendMap[value as keyof typeof legendMap] || value;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const newData = payload.find((p: any) => p.dataKey === "newData");
      const oldData = payload.find((p: any) => p.dataKey === "oldData");

      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          {(newData && newData.payload.newLabel !== "") &&
              <p style={{ color: "#8884d8" }}>{`${newData.payload.newLabel}: ${newData.value.toLocaleString("ko-KR")}`}</p>}
          {(oldData && oldData.payload.oldLabel !== "") &&
              <p style={{ color: "#aaaaaa" }}>{`${oldData.payload.oldLabel}: ${oldData.value.toLocaleString("ko-KR")}`}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Wrapper>
        <Title>매출 통계</Title>
        <FilterTab>
          <DateSelector initialDate={searchDate} onDateChange={setSearchDate} type="month" />
          <NavStyle defaultActiveKey={activeChart}>
            <NavItem>
              <NavLink
                eventKey="sales"
                onClick={() => setActiveChart("sales")}>매출금액</NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                eventKey="cumulativeSales"
                onClick={() => setActiveChart("cumulativeSales")}>누적금액</NavLink>
            </NavItem>
          </NavStyle>
        </FilterTab>
        <ResponsiveContainer width="95%" height="80%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 30 }}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatY} />
            <Tooltip formatter={formatY} content={<CustomTooltip />} />
            <Line type={activeChart === "sales" ? "monotone" : "linear"} dataKey="newData" fill="#8884d8"
                  stroke="#8884d8" />
            <Line type={activeChart === "sales" ? "monotone" : "linear"} dataKey="oldData" stroke="#aaaaaa" />
            <Legend formatter={formatLegend} />
          </LineChart>
        </ResponsiveContainer>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  width: 95%;
  background-color: white;
  height: calc(100vh - 160px);
  padding: 20px;
  scrollbar-width: none;
  overflow: scroll;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FilterTab = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin-right: 150px;
`

const Title = styled.div`
  font-size: 25px;
  margin-bottom: 20px;
`;

const NavStyle = styled(Nav)`
  border: 1px solid #f9f9f9;
  margin-left: 10px;
  margin-bottom: 20px;
  
  .nav-item {
    border: 1px solid var(--button-active-color);
    width: 100px;
    text-align: center;
    
    &:first-child {
      border-right: none;
      border-radius: 5px 0 0 5px;
    }
    
    &:last-child {
      border-radius: 0 5px 5px 0;
    }
    
    .nav-link {
      color: #282c34;
    }
    
    .nav-link.active {
      background-color: var(--main-color);
    }
    
    & :hover, :focus {
      background-color: var(--main-color-5);
    }
  }
`