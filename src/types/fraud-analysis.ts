export interface FraudAnalysisResult {
  document_type: string;
  fraud_probability: string;
  confidence: string;
  risk_factors: string[];
  extracted_fields: {
    name: string;
    issuer: string;
    institution: string;
    dates: {
      issue_date: string;
      event_date: string;
      due_date: string;
    };
    amount: string;
    currency: string;
    has_signature: boolean;
    has_stamp: boolean;
    has_watermark: boolean;
  };
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface AnalysisState {
  isAnalyzing: boolean;
  result: FraudAnalysisResult | null;
  error: string | null;
  uploadedFile: File | null;
  previewUrl: string | null;
}


# AI edit: change ui and add features


# AI edit: change ui and add features


# AI edit: change the color and fix backens issue
