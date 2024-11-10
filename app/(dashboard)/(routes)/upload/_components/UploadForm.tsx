"use client";
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import FilePreview from "./FilePreview";
import { Loader2 } from "lucide-react";

interface UploadFormProps {
  uploadClick: (arg0: File | undefined) => void;
  loading: boolean;
  setUploadStage: (arg0: string) => void;
}

const UploadForm = ({
  uploadClick,
  loading,
  setUploadStage,
}: UploadFormProps) => {
  const [file, setFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files) {
      if (e.target?.files[0]?.size <= 2000000) {
        setFile(e.target.files[0]);
      } else {
        toast("file size should be less than 2MB");
      }
    }
  };

  const removeFile = () => {
    setFile(undefined);
    setUploadStage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input value to allow re-selection
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 "
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-primary "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 ">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 ">
              SVG, PNG, JPG or GIF (Max Size : 2MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            onChange={onFileSelect}
            id="dropzone-file"
            type="file"
            className="hidden"
          />
        </label>
      </div>
      {file && <FilePreview file={file} removeFile={removeFile} />}
      <Button
        onClick={() => uploadClick(file)}
        disabled={!file || loading}
        className="w-[30%] mt-5 rounded-full"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Upload"}
      </Button>
    </div>
  );
};

export default UploadForm;
