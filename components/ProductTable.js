"use client";

import { useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

registerAllModules();

export default function ProductTable({ data }) {
  const hotRef = useRef(null);

  const columns = [
    { data: "name", title: "Name" },
    { data: "sell_price", title: "Sell Price" },
    { data: "cost_price", title: "Cost Price" },
    { data: "inventory", title: "Inventory" },
    { data: "description", title: "Description" },
  ];

  return (
    <div className="mt-4">
      <HotTable
        ref={hotRef}
        data={data}
        columns={columns}
        colHeaders={true}
        rowHeaders={true}
        width="100%"
        height="auto"
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  );
}