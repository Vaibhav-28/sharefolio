import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface FilePreviewProps {
  file: File | undefined;
  removeFile: () => void;
}

const FilePreview = ({ file, removeFile }: FilePreviewProps) => {
  return (
    <div className="flex items-center gap-2 justify-between mt-5 p-2 border rounded-md border-blue-200">
      <div className="flex items-center p-2">
        <Image src="/file.png" width={50} height={50} alt="file" />
        <div className="text-left">
          <h2>{file?.name}</h2>
          <h2 className="text-[12px] text-gray-400">
            {file?.type} /{" "}
            {file?.size ? (file?.size / 10224 / 1024).toFixed(2) : ""} MB
          </h2>
        </div>
      </div>
      <X onClick={removeFile} className="text-red-500 cursor-pointer" />
    </div>
  );
};

export default FilePreview;
