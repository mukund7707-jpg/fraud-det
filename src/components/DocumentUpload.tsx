import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, X, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  onFileSelect: (file: File) => void;
  uploadedFile: File | null;
  previewUrl: string | null;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function DocumentUpload({
  onFileSelect,
  uploadedFile,
  previewUrl,
  onClear,
  isAnalyzing,
}: DocumentUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  if (uploadedFile && previewUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card rounded-2xl overflow-hidden"
      >
        <div className="absolute top-4 right-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            disabled={isAnalyzing}
            className={cn(
              "p-2.5 rounded-xl bg-background/90 backdrop-blur-xl border border-border/50",
              "hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-300",
              "shadow-lg",
              isAnalyzing && "opacity-50 cursor-not-allowed"
            )}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="relative">
          <img
            src={previewUrl}
            alt="Document preview"
            className="w-full h-auto max-h-[450px] object-contain"
          />
          
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/70 backdrop-blur-md flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4">
                  {/* Animated scanner effect */}
                  <div className="relative w-24 h-24">
                    {/* Outer ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-primary/20"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* Spinning ring */}
                    <motion.div
                      className="absolute inset-2 rounded-full border-4 border-primary border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Center icon */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Sparkles className="w-8 h-8 text-primary" />
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <p className="text-base font-semibold text-foreground mb-1">Analyzing Document</p>
                    <p className="text-sm text-muted-foreground">AI is scanning for fraud indicators...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-4 border-t border-border/50 bg-muted/20 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <FileImage className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{uploadedFile.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
              </p>
            </div>
            {!isAnalyzing && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-risk-low/10 border border-risk-low/20">
                <div className="w-2 h-2 rounded-full bg-risk-low" />
                <span className="text-xs font-medium text-risk-low">Uploaded</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "relative premium-card rounded-2xl",
        "hover:border-primary/40 transition-all duration-300",
        "cursor-pointer group overflow-hidden"
      )}
    >
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className="flex flex-col items-center justify-center py-16 px-8">
        {/* Icon container */}
        <motion.div 
          className="relative mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300">
            <Upload className="w-9 h-9 text-primary" />
          </div>
          <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2 heading-display">
          Upload Document
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
          Drag and drop your document here, or click to browse files
        </p>
        
        {/* File type badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {["JPG", "PNG", "PDF", "WEBP"].map((type) => (
            <span
              key={type}
              className="px-2.5 py-1 rounded-lg bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


# AI edit: change ui and add features


# AI edit: change ui and add features
