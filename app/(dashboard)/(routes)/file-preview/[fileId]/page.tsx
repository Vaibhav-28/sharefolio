"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Copy,
  File,
  Lock,
  Mail,
  FileText,
  Link as LinkIcon,
  FileIcon,
  Loader2,
  Check,
  InfoIcon,
} from "lucide-react";
import bcrypt from "bcryptjs";
import emailService from "@/app/_utils/GlobalApi";
import { useUser } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Params = {
  fileId: string;
};

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

interface EmailData {
  email: string;
  userName: string;
  url: string;
}

const FilePreview = () => {
  const paramsPromise = useParams<Params>();

  const { user } = useUser();
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    setUserLoading(true);
    if (user) {
      setUserLoading(false);
    }
  }, [user]);

  const [file, setFile] = useState<FileInformation>();
  const [password, setPassword] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showPasswordConfirmDialog, setShowPasswordConfirmDialog] =
    useState(false);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipClick = () => {
    setIsTooltipOpen((prev) => !prev);
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

  const handleShare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendingEmail(true);
    if (user?.fullName && file) {
      const data = {
        email,
        userName: user?.fullName,
        url: file?.shortUrl,
      } as EmailData;
      emailService
        .sendEmail(data)
        .then(() => {
          toast("Email sent successfully");
          setSendingEmail(false);
        })
        .catch((err) => {
          toast.error(err?.message);
          setSendingEmail(false);
        });
    }
  };

  const handleCopyUrl = () => {
    if (file) {
      navigator.clipboard.writeText(file?.shortUrl);
      setShowCopiedAlert(true);
      setTimeout(() => setShowCopiedAlert(false), 2000);
    }
  };

  const getFileIcon = () => {
    switch (file?.type) {
      case "application/pdf":
        return <FileText className="w-8 h-8 text-primary" />;
      default:
        return <File className="w-8 h-8 text-primary" />;
    }
  };

  const handlePasswordSave = async () => {
    setShowPasswordConfirmDialog(false);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { error } = await supabase
      .from("sharefolio_files")
      .update({ password: hashedPassword })
      .eq("fileId", file?.fileId);

    if (error) {
      toast.error(error?.message);
    } else {
      toast("Password updated successfully");
    }
  };

  if (loading || userLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 mt-12">
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <FileIcon className="w-12 h-12 text-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="font-medium text-gray-900">
                  Preparing Your File
                </h3>
                <p className="text-sm text-gray-500">
                  Just a moment while we get everything ready...
                </p>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <div className="h-2.5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-2.5 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 mt-12">
      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl">
            Share File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 border border-gray-100 rounded-lg p-4 bg-white shadow-sm">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate mb-1">
                {file?.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary/60"></span>
                  {file?.type.split("/")[1].toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary/60"></span>
                  {file?.size} B
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-primary" />
              Share URL
            </Label>
            <div className="flex gap-2">
              <Input
                value={file?.shortUrl}
                readOnly
                className="bg-gray-50 font-mono text-sm"
                onChange={() => {}}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
                className="hover:bg-primary hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <Label className="font-medium">Password Protection</Label>
            </div>
            <Switch
              checked={isPasswordProtected}
              onCheckedChange={setIsPasswordProtected}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {isPasswordProtected && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top duration-300">
              <Label className="text-sm font-medium">Set Password</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPasswordConfirmDialog(true)}
                  className="hover:bg-primary hover:text-white transition-colors"
                  disabled={!password}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleShare} className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Share via Email
                </Label>
                <TooltipProvider>
                  <Tooltip
                    open={isTooltipOpen}
                    onOpenChange={setIsTooltipOpen}
                    delayDuration={300}
                  >
                    <TooltipTrigger asChild>
                      <InfoIcon
                        onClick={handleTooltipClick}
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="mx-5 w-full max-w-[90vw] sm:max-w-[300px] text-sm bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        This is using a free public domain and only allows
                        sending emails to your own email address.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sendingEmail}
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                >
                  {sendingEmail ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Share"
                  )}
                </Button>
              </div>
            </div>
          </form>

          {showCopiedAlert && (
            <Alert className="bg-primary/10 border-primary/20 animate-in fade-in slide-in-from-top duration-300">
              <AlertDescription className="text-primary font-medium flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Share URL copied to clipboard!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      <AlertDialog
        open={showPasswordConfirmDialog}
        onOpenChange={setShowPasswordConfirmDialog}
      >
        <AlertDialogContent className="w-80 md:w-96 lg:w-full rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Password Update</AlertDialogTitle>
            <AlertDialogDescription>
              This action will set a new password for this file and will reset
              any previously set password for the file. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordSave}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FilePreview;
