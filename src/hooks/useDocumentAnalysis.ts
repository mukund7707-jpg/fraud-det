import { useState, useCallback } from "react";
import { FraudAnalysisResult, AnalysisState } from "@/types/fraud-analysis";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const initialState: AnalysisState = {
  isAnalyzing: false,
  result: null,
  error: null,
  uploadedFile: null,
  previewUrl: null,
};

export function useDocumentAnalysis() {
  const [state, setState] = useState<AnalysisState>(initialState);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = useCallback((file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setState((prev) => ({
      ...prev,
      uploadedFile: file,
      previewUrl,
      result: null,
      error: null,
    }));
  }, []);

  const clearFile = useCallback(() => {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    setState(initialState);
  }, [state.previewUrl]);

  const analyzeDocument = useCallback(async () => {
    if (!state.uploadedFile) {
      toast.error("Please upload a document first");
      return;
    }

    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      const base64 = await fileToBase64(state.uploadedFile);

      const { data, error } = await supabase.functions.invoke("analyze-document", {
        body: {
          imageBase64: base64,
          mimeType: state.uploadedFile.type,
        },
      });

      if (error) {
        console.error("Analysis error:", error);
        throw new Error(error.message || "Analysis failed");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const result = data as FraudAnalysisResult;
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        result,
      }));

      const probability = parseFloat(result.fraud_probability.replace("%", ""));
      if (probability >= 60) {
        toast.error(`High fraud risk detected: ${result.fraud_probability}`);
      } else if (probability >= 30) {
        toast.warning(`Medium fraud risk: ${result.fraud_probability}`);
      } else {
        toast.success(`Low fraud risk: ${result.fraud_probability}`);
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Analysis failed";
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
    }
  }, [state.uploadedFile]);

  return {
    ...state,
    handleFileSelect,
    clearFile,
    analyzeDocument,
  };
}


# AI edit: change ui and add features


# AI edit: change ui and add features


# AI edit: change the color and fix backens issue


# AI edit: change the color and fix backens issue
