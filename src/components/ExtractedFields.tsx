import { motion } from "framer-motion";
import { FraudAnalysisResult } from "@/types/fraud-analysis";
import {
  User,
  Building,
  Calendar,
  DollarSign,
  Stamp,
  PenTool,
  Droplets,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExtractedFieldsProps {
  fields: FraudAnalysisResult["extracted_fields"];
  documentType: string;
}

export function ExtractedFields({ fields, documentType }: ExtractedFieldsProps) {
  const FieldItem = ({
    icon: Icon,
    label,
    value,
    isBoolean,
    booleanValue,
    delay = 0,
  }: {
    icon: React.ElementType;
    label: string;
    value?: string;
    isBoolean?: boolean;
    booleanValue?: boolean;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/20 transition-colors"
    >
      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-1 font-medium">{label}</p>
        {isBoolean ? (
          <div className="flex items-center gap-2">
            {booleanValue ? (
              <>
                <CheckCircle className="w-4 h-4 text-risk-low" />
                <span className="text-sm font-medium text-risk-low">Present</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Not detected</span>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm font-mono text-foreground truncate">
            {value || "—"}
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-5">
      {/* Document Type Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">Document Type</p>
          <p className="text-base font-semibold text-foreground">{documentType}</p>
        </div>
      </motion.div>

      {/* Main Fields Grid */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <div className="w-8 h-px bg-border" />
          Key Information
          <div className="flex-1 h-px bg-border" />
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <FieldItem icon={User} label="Name" value={fields.name} delay={0.05} />
          <FieldItem icon={Building} label="Issuer" value={fields.issuer} delay={0.1} />
          <FieldItem icon={Building} label="Institution" value={fields.institution} delay={0.15} />
          <FieldItem
            icon={DollarSign}
            label="Amount"
            value={fields.amount ? `${fields.currency || ""} ${fields.amount}`.trim() : undefined}
            delay={0.2}
          />
        </div>
      </div>

      {/* Dates */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <div className="w-8 h-px bg-border" />
          Dates
          <div className="flex-1 h-px bg-border" />
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <FieldItem
            icon={Calendar}
            label="Issue Date"
            value={fields.dates?.issue_date}
            delay={0.25}
          />
          <FieldItem
            icon={Calendar}
            label="Event Date"
            value={fields.dates?.event_date}
            delay={0.3}
          />
          <FieldItem
            icon={Calendar}
            label="Due Date"
            value={fields.dates?.due_date}
            delay={0.35}
          />
        </div>
      </div>

      {/* Authentication Markers */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <div className="w-8 h-px bg-border" />
          Authentication Markers
          <div className="flex-1 h-px bg-border" />
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <FieldItem
            icon={PenTool}
            label="Signature"
            isBoolean
            booleanValue={fields.has_signature}
            delay={0.4}
          />
          <FieldItem
            icon={Stamp}
            label="Stamp/Seal"
            isBoolean
            booleanValue={fields.has_stamp}
            delay={0.45}
          />
          <FieldItem
            icon={Droplets}
            label="Watermark"
            isBoolean
            booleanValue={fields.has_watermark}
            delay={0.5}
          />
        </div>
      </div>
    </div>
  );
}


# AI edit: change ui and add features


# AI edit: change ui and add features


# AI edit: change the color and fix backens issue


# AI edit: change the color and fix backens issue
