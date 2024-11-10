"use client";
import Header from "@/app/_components/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { Download, FileText, Lock, Mail, Shield, User } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import bcrypt from "bcryptjs";

interface FileInformation {
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

type Params = {
  fileId: string;
};

const ViewFile = () => {
  const paramsPromise = useParams<Params>();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<FileInformation>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (file?.password && !password) {
      setError("Please enter the password");
    } else {
      if (file) {
        if (file?.password) {
          const isMatch = await bcrypt.compare(password, file?.password);
          if (isMatch) {
            setError("");
            const { data, error: downloadError } = await supabase.storage
              .from("files")
              .download(file?.path);

            if (downloadError) {
              toast.error(downloadError?.message);
            } else {
              const url = URL.createObjectURL(data);
              const a = document.createElement("a");
              a.href = url;
              a.download = file?.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          } else {
            setError("Please enter correct password");
          }
        } else {
          setError("");
          const { data, error: downloadError } = await supabase.storage
            .from("files")
            .download(file?.path);

          if (downloadError) {
            toast.error(downloadError?.message);
          } else {
            const url = URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.download = file?.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }
      }
    }
  };

  const getFileInfo = async (fileId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sharefolio_files")
      .select("*")
      .eq("fileId", fileId)
      .single();
    if (error) {
      toast.error(error?.message);
    }
    setFile(data);
    setLoading(false);
  };
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await paramsPromise;
      if (resolvedParams?.fileId) {
        getFileInfo(resolvedParams?.fileId);
      }
    };

    resolveParams();
  }, [paramsPromise]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-white flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-primary/20 overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="animate-pulse space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-primary/10 rounded-full w-3/4"></div>
                    <div className="h-3 bg-primary/10 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-3 bg-primary/10 rounded-full"></div>
                  <div className="h-3 bg-primary/10 rounded-full"></div>
                  <div className="h-3 bg-primary/10 rounded-full"></div>
                </div>
                <div className="h-10 bg-primary/10 rounded-xl w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="my-12 bg-gradient-to-br from-primary/5 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-primary/20 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>

          <div className="p-8 space-y-8">
            <div className="flex items-start gap-6">
              <div
                className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 
                          rounded-xl flex items-center justify-center shadow-inner"
              >
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h1
                  className="text-xl font-semibold text-gray-900 truncate"
                  title={file?.name}
                >
                  {file?.name}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-primary/5 rounded-md font-medium">
                    {file?.type.split("/")[1].toUpperCase()}
                  </span>
                  <span>•</span>
                  <span className="font-medium">{file?.size} B</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100
                          transition-transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600">
                      Uploaded by
                    </p>
                    <p className="text-sm text-gray-900 truncate">
                      {file?.userName}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100
                          transition-transform hover:scale-[1.02] "
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600">Contact</p>
                    <p className="text-sm text-gray-900 truncate">
                      {file?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {file?.password && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>This file is password protected</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to download"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                           text-sm focus:outline-none focus:ring-2 focus:ring-primary/20
                           focus:border-primary placeholder:text-gray-400"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white 
                     py-3 px-4 rounded-xl font-medium
                     flex items-center justify-center gap-2
                     shadow-lg shadow-primary/20
                     hover:shadow-xl hover:shadow-primary/30 
                     transition-all duration-300 hover:-translate-y-0.5
                     focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <Download className="w-5 h-5" />
              <span>Download File</span>
            </Button>

            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure, encrypted file transfer</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewFile;
