"use client";
import React, { useState } from "react";
import {
  FileIcon,
  Share2,
  Download,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface File {
  email: string;
  fileId: string;
  id: number;
  password: string | null;
  path: string;
  shortUrl: string;
  size: number;
  type: string;
  userName: string;
  name: string;
}

const Files = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [deletingFiles, setDeletingFiles] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const getFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sharefolio_files")
      .select("*")
      .eq("email", user?.primaryEmailAddress?.emailAddress);

    if (error) {
      toast.error(error?.message);
      setLoading(false);
    } else {
      setFiles(data);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user && user?.primaryEmailAddress?.emailAddress) {
      getFiles();
    }
  }, [user]);

  const handleShare = (fileId: string) => {
    router.push(`/file-preview/${fileId}`);
  };

  const handleDownload = async (path: string, name: string) => {
    const { data, error } = await supabase.storage.from("files").download(path);

    if (error) {
      toast.error(error?.message);
    } else {
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDelete = async (path: string, fileId: string) => {
    setDeletingFiles(fileId);
    const { error } = await supabase.storage.from("files").remove([path]);
    if (error) {
      toast.error(error.message);
      setDeletingFiles("");
    } else {
      const { error: error2 } = await supabase
        .from("sharefolio_files")
        .delete()
        .eq("fileId", fileId);

      if (error2) {
        toast.error(error2.message);
        setDeletingFiles("");
      } else {
        toast("File Deleted Successfully");
        setDeletingFiles("");
        getFiles();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-600">Loading your files...</p>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Your Files
        </h1>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-gray-50 rounded-full p-3 mb-4">
              <UploadCloud className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No files uploaded yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Get started by uploading your first file. You can upload
              documents, images, and more.
            </p>
            <a
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <UploadCloud className="h-5 w-5" />
              Upload Files
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Files</h1>

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header - Hidden on mobile */}
        <div className="hidden sm:grid grid-cols-12 py-3 px-4 bg-gray-50 border-b text-sm font-medium text-gray-600">
          <div className="col-span-6">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Actions</div>
        </div>

        <div className="divide-y">
          {files.map((file) => (
            <div key={file?.id}>
              {/* Desktop Layout */}
              <div className="hidden sm:grid grid-cols-12 py-3 px-4 items-center hover:bg-gray-50">
                <div className="col-span-6 flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-primary" />
                  <span className="truncate">{file?.name}</span>
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {file.size}
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {file?.type.split("/")[1].toUpperCase()}
                </div>
                <div className="col-span-2 flex gap-2">
                  {deletingFiles === file?.fileId ? (
                    <div className="p-1.5">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleShare(file?.fileId)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
                        title="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(file?.path, file?.name)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file?.path, file?.fileId)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
                        title="Download"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="sm:hidden p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between  gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file?.type.split("/")[1].toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {file?.fileId === deletingFiles ? (
                      <div className="p-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleShare(file.fileId)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
                          title="Share"
                        >
                          <Share2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(file.path, file?.name)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
                          title="Download"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(file.path, file?.fileId)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
                          title="Download"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Files;
