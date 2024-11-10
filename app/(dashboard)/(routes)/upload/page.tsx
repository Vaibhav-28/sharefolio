"use client";
import React, { useState } from "react";
import UploadForm from "./_components/UploadForm";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import UploadProgress from "./_components/UploadStage";
import { useUser } from "@clerk/nextjs";
import crypto from "crypto";
import { useRouter } from "next/navigation";

const Upload = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadStage, setUploadStage] = useState("");
  const { user } = useUser();

  function generateFileId() {
    return crypto.randomBytes(4).toString("hex");
  }

  const uploadFile = async (file: File | undefined) => {
    setLoading(true);
    setUploadStage("uploading");
    if (file) {
      const { data, error } = await supabase.storage
        .from("files")
        .upload(
          `${user?.primaryEmailAddress?.emailAddress}/${file?.name}`,
          file
        );
      if (error) {
        toast.error(error?.message);
        setLoading(false);
      } else {
        setUploadStage("database");
        let fileId = "";
        let shortUrl;
        let unique = false;

        while (!unique) {
          fileId = generateFileId();

          const { data: data2, error: error2 } = await supabase
            .from("sharefolio_files")
            .select("fileId")
            .eq("fileId", fileId);

          if (error2) {
            toast.error(error2?.message);
          }

          if (!data2 || data2.length === 0) {
            unique = true;
            shortUrl = process.env.NEXT_PUBLIC_BASE_URL + "f/" + fileId;
          }
        }
        const { error: error3 } = await supabase
          .from("sharefolio_files")
          .insert([
            {
              name: file?.name,
              path: data?.path,
              type: file?.type,
              size: file?.size,
              userName: user?.fullName,
              email: user?.primaryEmailAddress?.emailAddress,
              fileId,
              shortUrl,
            },
          ]);
        if (error3) {
          toast.error(error3?.message);
          setLoading(false);
        } else {
          setUploadStage("complete");
          toast("File uploaded successfully");
          setTimeout(() => {
            setUploadStage("");
            setLoading(false);
            router.push(`file-preview/${fileId}`);
          }, 1000);
        }
      }
    }
  };
  return (
    <div className="p-5 px-8 md:px-28">
      <h2 className="text-[20px] p-5 text-center">
        Start <strong className="text-primary"> Uploading </strong> Files to
        <strong className="text-primary"> Share </strong> them
      </h2>
      <UploadForm
        uploadClick={uploadFile}
        setUploadStage={setUploadStage}
        loading={loading}
      />
      {uploadStage && <UploadProgress stage={uploadStage} />}
    </div>
  );
};

export default Upload;
