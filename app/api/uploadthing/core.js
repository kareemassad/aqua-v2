// app/api/uploadthing/core.js
import { createUploadthing } from "uploadthing/next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import * as XLSX from "@e965/xlsx";

const f = createUploadthing();

export const ourFileRouter = {
  excelUploader: f([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ])
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("Excel upload completed", file);

      const response = await fetch(file.url);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false,
      });

      // Find the first non-empty row as headers
      const headerIndex = rawData.findIndex((row) =>
        row.some((cell) => cell !== ""),
      );
      const headers = rawData[headerIndex];

      // Process the data
      const products = rawData
        .slice(headerIndex + 1)
        .filter((row) => row.some((cell) => cell !== "")) // Remove empty rows
        .map((row) => {
          const product = {};
          headers.forEach((header, index) => {
            if (header) {
              product[header.trim()] = row[index]
                ? row[index].toString().trim()
                : "";
            }
          });
          return product;
        });

      console.log("Parsed data:", products);

      return { uploadedBy: metadata.userId, parsedData: products };
    }),
};
