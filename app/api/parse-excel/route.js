import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import ExcelJS from "exceljs";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Received body:", body);

    if (!body || !body.fileUrl) {
      throw new Error("No fileUrl provided in the request body");
    }

    const { fileUrl } = body;

    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];
    const data = [];

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const rowData = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const header = worksheet.getRow(1).getCell(colNumber).text.trim();
          rowData[header] = cell.text || ''; // Use empty string for null or undefined values
        });
        data.push(rowData);
      }
    });

    console.log("Parsed data:", data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error processing Excel file:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}