import { useState } from "react";
import { useNavigate } from "react-router";
import { OnboardingLayout } from "../components/OnboardingLayout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Upload, FileText, CheckCircle2, X, FileCheck } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export function DocumentUpload() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleSubmit = () => {
    // In a real app, this would upload the files to a server
    navigate("/success");
  };

  return (
    <OnboardingLayout currentStep={2} totalSteps={2} onBack={() => navigate(-1)}>
      <div className="max-w-3xl mx-auto">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">Upload Insurance Documents</CardTitle>
            <CardDescription>
              Securely upload your insurance cards and other healthcare documents. All files are encrypted and HIPAA compliant.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-blue-600 bg-blue-50"
                  : "border-blue-200 hover:border-blue-400 bg-blue-50/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Upload className="size-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-blue-900 mb-1">
                    Drag and drop your files here
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    or click to browse
                  </p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Choose Files</span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, PDF (Max 10MB per file)
                </p>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-blue-900 flex items-center gap-2">
                  <FileCheck className="size-5" />
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="size-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">{file.name}</p>
                          <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-5 text-green-600" />
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Continue to Dashboard
              </Button>
              {uploadedFiles.length === 0 && (
                <Button
                  variant="ghost"
                  onClick={handleSubmit}
                  className="text-gray-600"
                >
                  Skip for Now
                </Button>
              )}
            </div>

            <p className="text-xs text-center text-gray-500">
              You can always add more documents later from your account settings
            </p>
          </CardContent>
        </Card>
      </div>
    </OnboardingLayout>
  );
}
