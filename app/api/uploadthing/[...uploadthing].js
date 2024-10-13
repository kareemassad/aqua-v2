// app/api/uploadthing/[...uploadthing].js
import ourFileRouter from "@/app/uploadthing";
import { createNextRouteHandler } from "uploadthing/react";

const handler = createNextRouteHandler({
  router: ourFileRouter,
});

export { handler as GET, handler as POST };
