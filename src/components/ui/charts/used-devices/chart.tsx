"use client";

import { compactFormat } from "@/utils/format-number";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: { name: string; amount: number }[];
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function DonutChart({ data }: PropsType) {
  const formatPercent = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 1,
    }).format(value);

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
    },
    colors: ["#1C2434", "#475569", "#94A3B8", "#CBD5E1"],
    labels: data.map((item) => item.name),
    legend: {
      show: true,
      position: "bottom",
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      formatter: (legendName, opts) => {
        const { seriesPercent } = opts.w.globals;
        return `${legendName}: ${formatPercent(seriesPercent[opts.seriesIndex] ?? 0)}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total Unit",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
              formatter: (val) => compactFormat(+val),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
      {
        breakpoint: 370,
        options: {
          chart: {
            width: 260,
          },
        },
      },
    ],
  };

  return (
    <Chart
      options={chartOptions}
      series={data.map((item) => item.amount)}
      type="donut"
      width="100%"
    />
  );
}
