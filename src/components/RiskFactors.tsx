import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskFactorsProps {
  factors: string[];
  fraudProbability: string;
}

export function RiskFactors({ factors, fraudProbability }: RiskFactorsProps) {
  const probabilityValue = parseFloat(fraudProbability.replace("%", "")) || 0;

  const getConfig = (index: number) => {
    if (probabilityValue >= 60 || index === 0) {
      return {
        Icon: AlertTriangle,
        iconColor: "text-risk-high",
        bgColor: "bg-risk-high/8",
        borderColor: "border-risk-high/20",
        dotColor: "bg-risk-high",
      };
    }
    if (probabilityValue >= 30 || index < 2) {
      return {
        Icon: AlertCircle,
        iconColor: "text-risk-medium",
        bgColor: "bg-risk-medium/8",
        borderColor: "border-risk-medium/20",
        dotColor: "bg-risk-medium",
      };
    }
    return {
      Icon: Info,
      iconColor: "text-muted-foreground",
      bgColor: "bg-muted/30",
      borderColor: "border-border",
      dotColor: "bg-muted-foreground",
    };
  };

  if (factors.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-2xl bg-risk-low/10 border border-risk-low/20 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-risk-low" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No Risk Factors Detected</p>
        <p className="text-xs text-muted-foreground">Document appears to be legitimate</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-risk-medium" />
          <h3 className="text-sm font-semibold text-foreground">Risk Factors</h3>
        </div>
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-medium",
          probabilityValue >= 60 ? "bg-risk-high/10 text-risk-high border border-risk-high/20" :
          probabilityValue >= 30 ? "bg-risk-medium/10 text-risk-medium border border-risk-medium/20" :
          "bg-muted text-muted-foreground border border-border"
        )}>
          {factors.length} {factors.length === 1 ? 'issue' : 'issues'} found
        </span>
      </div>

      {/* Factors list */}
      <div className="space-y-2.5">
        {factors.map((factor, index) => {
          const config = getConfig(index);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border",
                config.bgColor,
                config.borderColor
              )}
            >
              <div className={cn("p-1.5 rounded-lg", config.bgColor)}>
                <config.Icon className={cn("w-4 h-4", config.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">{factor}</p>
              </div>
              <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", config.dotColor)} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


# AI edit: change ui and add features


# AI edit: change ui and add features


# AI edit: change the color and fix backens issue
