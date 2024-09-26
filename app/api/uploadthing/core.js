// app/api/uploadthing/core.js
import { createUploadthing } from "uploadthing/next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ _metadata, file }) => {
      console.log("Image upload completed", file);
    }),

  excelUploader: f(["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"])
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ _metadata, file }) => {
      console.log("Excel upload completed", file);
    }),
};