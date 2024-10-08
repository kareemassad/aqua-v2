"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import { toast } from "react-hot-toast";

export default function ExcelUpload({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div>
      <UploadButton
        endpoint="excelUploader"
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          if (res && res[0]) {
            onUploadSuccess({ type: "excel", url: res[0].url });
            toast.success("Excel file uploaded successfully!");
          }
        }}
        onUploadError={(error) => {
          setIsUploading(false);
          toast.error(`Upload failed: ${error.message}`);
        }}
      />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}