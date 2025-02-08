"use client";
import { useState, useEffect } from "react";
import { db } from "./firebase"; // Ensure Firebase is initialized
import { doc, getDoc } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";

export default function Progressp() {
  const [data, setData] = useState<{ amount?: number; predicted_amount?: number }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", "budget");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { amount, predicted_amount } = docSnap.data();
          setData({ amount, predicted_amount });
        } else {
          setError("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  // Chart Data
  const chartData = [
    { name: "Budget", value: data.amount || 0 },
    { name: "Predicted", value: data.predicted_amount || 0 },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Budget vs Predicted</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ChartContainer config={{}} className="min-h-[180px] w-40 rounded-lg shadow-lg mb-3">
          <BarChart width={400} height={250} data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="value" fill="var(--color-primary)" radius={4} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}
