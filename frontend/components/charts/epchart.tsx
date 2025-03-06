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

const AttendanceTrend = () => {
  const [chartData, setChartData] = useState([]);
  const [token, setToken] = useState<string | null>(null);

  const chartConfig = {
    checkInTime: {
      label: "Check-In Time",
      color: "hsl(var(--chart-1))",
    },
  } as ChartConfig;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/attendance/history`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();

        // Process time data
        const processedData = data.map((entry) => ({
          ...entry,
          checkIn: convertTimeToHours(entry.checkIn),
          date: entry.date.split("-")[2], // Extract day from date
        }));

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchData();
  }, [token]);

  // Helper function to convert time string to hours (float)
  const convertTimeToHours = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  return (
<div className="w-full mt-24 flex flex-row">
  <Card className="w-full ">
        <CardHeader>
          <CardTitle>Attendance Chart</CardTitle>
          <CardDescription>Check-ins over the past 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value} // Display day as-is
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const hours = Math.floor(value);
                  const minutes = ((value % 1) * 60).toFixed(0);
                  return `${hours}:${minutes.toString().padStart(2, "0")}`;
                }}
                domain={[8, 21]} // Set domain from 8:00 AM to 9:00 PM
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="checkIn"
                fill="var(--color-checkInTime)"
                radius={4}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing check-ins for the last 30 days
          </div>
        </CardFooter>
      </Card>
      </div>
     
  )
};

export default AttendanceTrend;
