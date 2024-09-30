// app/uploadthing.js
import { createUploadthing } from "uploadthing/next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";

const f = createUploadthing();

// Define file routers for product images and Excel files
export const ourFileRouter = {
  productImage: f({
    image: {
      maxFileSize: "5MB",
      acceptedFileTypes: ["image/jpeg", "image/png", "image/jpg"],
    },
  })
    .middleware(async ({ _req, userId }) => {
      const session = await getServerSession(authOptions);
      if (!session) {
        throw new Error("Unauthorized");
      }
      return { userId: userId };
    })
    .onUploadComplete(async ({ _metadata, file }) => {
      console.log("Image uploaded:", file.url);
    }),

  excelFile: f({
    excel: {
      maxFileSize: "10MB",
      acceptedFileTypes: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
    },
  })
    .middleware(async ({ _req, userId }) => {
      const session = await getServerSession(authOptions);
      if (!session) {
        throw new Error("Unauthorized");
      }
      return { userId: userId };
    })
    .onUploadComplete(async ({ _metadata, file }) => {
      console.log("Excel file uploaded:", file.url);
    }),
};