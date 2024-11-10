import React, { useState, useEffect } from "react";
import { Check, Upload as UploadIcon, Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  stage: string;
}

const UploadProgress = ({ stage }: UploadProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage === "uploading") {
      // Simulate upload progress
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(timer);
    } else if (stage === "database") {
      setProgress(100);
    }
  }, [stage]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Upload Stage */}
      <div className="flex items-center space-x-4">
        <div
          className={`p-2 rounded-full ${
            stage === "uploading"
              ? "bg-blue-100"
              : stage === "database" || stage === "complete"
              ? "bg-green-100"
              : "bg-gray-100"
          }`}
        >
          {stage === "complete" ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <UploadIcon
              className={`w-5 h-5 ${
                stage === "uploading"
                  ? "text-primary animate-pulse"
                  : stage === "database"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Uploading File</span>
            {stage === "uploading" && (
              <span className="text-xs text-primary">{progress}%</span>
            )}
            {(stage === "database" || stage === "complete") && (
              <span className="text-xs text-green-600">100%</span>
            )}
          </div>
          <Progress
            value={stage === "uploading" ? progress : 100}
            className="mt-2"
          />
        </div>
      </div>

      {/* Database Stage */}
      <div className="flex items-center space-x-4">
        <div
          className={`p-2 rounded-full ${
            stage === "database"
              ? "bg-blue-100"
              : stage === "complete"
              ? "bg-green-100"
              : "bg-gray-100"
          }`}
        >
          {stage === "complete" ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Database
              className={`w-5 h-5 ${
                stage === "database"
                  ? "text-primary animate-pulse"
                  : stage === "complete"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Creating Database Entry</span>
            {stage === "database" && (
              <span className="text-xs text-primary">In Progress</span>
            )}
            {stage === "complete" && (
              <span className="text-xs text-green-600">Complete</span>
            )}
          </div>
          <Progress
            value={stage === "database" || stage === "complete" ? 100 : 0}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;
