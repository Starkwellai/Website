import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  onScrolledToBottom: () => void;
  hasScrolledToBottom: boolean;
}

export function LegalDocumentModal({
  isOpen,
  onClose,
  title,
  content,
  onScrolledToBottom,
  hasScrolledToBottom,
}: LegalDocumentModalProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    // Calculate scroll progress percentage
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);

    // Consider "bottom" as 95% or more to account for rounding issues
    if (progress >= 95 && !hasScrolledToBottom) {
      onScrolledToBottom();
    }
  };

  // Reset scroll progress when modal opens
  useEffect(() => {
    if (isOpen) {
      setScrollProgress(0);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-blue-900">{title}</DialogTitle>
          <DialogDescription>
            Please read the entire document and scroll to the bottom to continue.
          </DialogDescription>
        </DialogHeader>

        {!hasScrolledToBottom && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
            <div className="text-amber-600 text-sm">
              📜 Please scroll to the bottom to enable acceptance
            </div>
            <div className="ml-auto text-xs text-amber-700">
              {Math.round(scrollProgress)}%
            </div>
          </div>
        )}

        {hasScrolledToBottom && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="size-4 text-green-600" />
            <div className="text-green-700 text-sm">
              You may now close this window and accept the agreement
            </div>
          </div>
        )}

        <div
          className="flex-1 border rounded-lg overflow-hidden"
          onScroll={handleScroll}
          ref={scrollAreaRef}
          style={{
            overflowY: "auto",
            maxHeight: "calc(90vh - 250px)",
          }}
        >
          <div className="p-6 prose prose-sm max-w-none">
            {content}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {hasScrolledToBottom ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="size-4" />
                Document reviewed
              </span>
            ) : (
              <span>Scroll to bottom to continue</span>
            )}
          </div>
          <Button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
