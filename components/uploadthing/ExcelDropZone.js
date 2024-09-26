"use client";

import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useCallback } from "react";

export default function ExcelDropZone({ onUploadSuccess }) {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    if (onUploadSuccess) {
      onUploadSuccess({ type: "excel", url: acceptedFiles[0].fileUrl });
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]),
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag &apos;n&apos; drop an Excel file here, or click to select one</p>
    </div>
  );
}