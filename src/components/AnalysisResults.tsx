import { motion } from "framer-motion";
import { FraudAnalysisResult } from "@/types/fraud-analysis";
import { RiskGauge } from "./RiskGauge";
import { RiskFactors } from "./RiskFactors";
import { ExtractedFields } from "./ExtractedFields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, FileSearch, Code, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  result: FraudAnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Risk Score Card */}
      <Card className="premium-card border-border/50 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="flex items-center gap-3 text-base">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShieldAlert className="w-4 h-4 text-primary" />
            </div>
            <span className="heading-display">Fraud Risk Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8 px-6">
          <RiskGauge
            probability={result.fraud_probability}
            confidence={result.confidence}
          />
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="risks" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1 rounded-xl h-auto">
          {[
            { value: "risks", icon: ShieldAlert, label: "Risks" },
            { value: "fields", icon: FileSearch, label: "Extracted" },
            { value: "json", icon: Code, label: "JSON" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="risks" className="mt-4">
          <Card className="premium-card border-border/50 rounded-2xl">
            <CardContent className="pt-6 px-5">
              <RiskFactors
                factors={result.risk_factors}
                fraudProbability={result.fraud_probability}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="mt-4">
          <Card className="premium-card border-border/50 rounded-2xl">
            <CardContent className="pt-6 px-5">
              <ExtractedFields
                fields={result.extracted_fields}
                documentType={result.document_type}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json" className="mt-4">
          <Card className="premium-card border-border/50 rounded-2xl">
            <CardHeader className="pb-2 pt-5 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Code className="w-4 h-4 text-primary" />
                  Raw JSON Output
                </CardTitle>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    copied
                      ? "bg-risk-low/10 text-risk-low border border-risk-low/20"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground border border-border/50"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <pre className="p-4 rounded-xl bg-muted/30 border border-border/50 overflow-x-auto text-xs font-mono text-muted-foreground leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}


# AI edit: change ui and add features
