import { useMemo } from "react";
import { motion } from "framer-motion";
import { RiskLevel } from "@/types/fraud-analysis";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface RiskGaugeProps {
  probability: string;
  confidence: string;
}

export function RiskGauge({ probability, confidence }: RiskGaugeProps) {
  const probabilityValue = useMemo(() => {
    const num = parseFloat(probability.replace("%", ""));
    return isNaN(num) ? 0 : num;
  }, [probability]);

  const confidenceValue = useMemo(() => {
    const num = parseFloat(confidence);
    return isNaN(num) ? 0 : num * 100;
  }, [confidence]);

  const riskLevel: RiskLevel = useMemo(() => {
    if (probabilityValue < 30) return "low";
    if (probabilityValue < 60) return "medium";
    return "high";
  }, [probabilityValue]);

  const riskConfig = {
    low: {
      color: "text-risk-low",
      bg: "bg-risk-low",
      bgLight: "bg-risk-low/10",
      border: "border-risk-low/30",
      label: "Low Risk",
      description: "Document appears legitimate",
      Icon: CheckCircle,
    },
    medium: {
      color: "text-risk-medium",
      bg: "bg-risk-medium",
      bgLight: "bg-risk-medium/10",
      border: "border-risk-medium/30",
      label: "Medium Risk",
      description: "Some concerns detected",
      Icon: AlertCircle,
    },
    high: {
      color: "text-risk-high",
      bg: "bg-risk-high",
      bgLight: "bg-risk-high/10",
      border: "border-risk-high/30",
      label: "High Risk",
      description: "Multiple fraud indicators",
      Icon: AlertTriangle,
    },
  };

  const config = riskConfig[riskLevel];
  const needleRotation = (probabilityValue / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Gauge */}
      <div className="relative w-56 h-28 mb-6">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--risk-low))" />
              <stop offset="50%" stopColor="hsl(var(--risk-medium))" />
              <stop offset="100%" stopColor="hsl(var(--risk-high))" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="14"
            strokeLinecap="round"
          />
          
          {/* Colored arc with animation */}
          <motion.path
            d="M 20 95 A 80 80 0 0 1 180 95"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ strokeDasharray: "0 251.2" }}
            animate={{ strokeDasharray: `${(probabilityValue / 100) * 251.2} 251.2` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = (tick / 100) * 180 - 90;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 65 * Math.cos(rad);
            const y1 = 95 + 65 * Math.sin(rad);
            const x2 = 100 + 72 * Math.cos(rad);
            const y2 = 95 + 72 * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
              />
            );
          })}
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          initial={{ rotate: -90 }}
          animate={{ rotate: needleRotation }}
          transition={{ duration: 1, type: "spring", stiffness: 60, damping: 12 }}
          style={{ translateX: "-50%" }}
        >
          <div className="w-1 h-16 bg-foreground rounded-full shadow-lg" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-foreground border-4 border-background shadow-lg" />
        </motion.div>
      </div>

      {/* Value display */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <config.Icon className={cn("w-6 h-6", config.color)} />
          <span className={cn("text-5xl font-bold font-mono tracking-tight", config.color)}>
            {probability}
          </span>
        </div>
        <div className={cn("inline-flex items-center px-4 py-1.5 rounded-full border", config.bgLight, config.border)}>
          <span className={cn("text-sm font-semibold", config.color)}>
            {config.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{config.description}</p>
      </motion.div>

      {/* Confidence bar */}
      <motion.div 
        className="mt-6 w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground font-medium">AI Confidence</span>
          <span className={cn("font-mono font-semibold", config.color)}>
            {confidenceValue.toFixed(0)}%
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", config.bg)}
            initial={{ width: 0 }}
            animate={{ width: `${confidenceValue}%` }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}


# AI edit: change ui and add features


# AI edit: change ui and add features
