"use client"

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const userId = 13; // Replace with dynamic userId if needed

export default function AttendanceTrend() {
  const [chartData, setChartData] = useState([]);

  const chartConfig = {
    checkInTime: {
      label: "Check-In Time",
      color: "hsl(var(--chart-1))",
    },
  } as ChartConfig;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/attendance/history?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        console.log(data)
        setChartData(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trends</CardTitle>
        <CardDescription>Check-in times over the past days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 4, right: 4 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              domain={[2, 10]} //working time (in ethiopian time)
              tickFormatter={(value) =>
                `${Math.floor(value)}:${((value % 1) * 60).toFixed(0).padStart(2, "0")}`
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="checkInTime"
              fill="var(--color-checkInTime)" //color
              barSize={90} //  bar width
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        
        <div className="leading-none text-muted-foreground">
          daily check-in times
        </div> 
      </CardFooter>
    </Card>
  );
}