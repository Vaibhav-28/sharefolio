import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface FilePreviewProps {
  file: File | undefined;
  removeFile: () => void;
}

const FilePreview = ({ file, removeFile }: FilePreviewProps) => {
  return (
    <div className="flex items-center justify-between gap-2 mt-5 p-2 border rounded-md border-blue-200 overflow-hidden">
      <div className="flex items-center flex-1 min-w-0">
        <Image src="/file.png" width={50} height={50} alt="file" />
        <div className="text-left ml-2 flex-1 min-w-0">
          <h2 className="truncate">{file?.name}</h2>
          <h2 className="text-[12px] text-gray-400 truncate">
            {file?.type} /{" "}
            {file?.size ? (file?.size / 1024 / 1024).toFixed(2) : ""} MB
          </h2>
        </div>
      </div>
      <X
        onClick={removeFile}
        className="text-red-500 cursor-pointer flex-shrink-0"
      />
    </div>
  );
};

export default FilePreview;
