import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FRAUD_SCREENING_PROMPT = `You are an AI system designed to perform fraud screening for documents uploaded to crowdfunding platforms. Users may upload various documents such as medical certificates, prescriptions, fee receipts, invoices, quotations, ID proof, hospital bills, police reports, insurance papers, affidavits, bank statements, passbooks, and other supporting documents.

Goal:
You do NOT approve or deny fundraising requests. You ONLY detect fraud risk signals and provide a Fraud Probability Score with explanations.

Tasks:

1. OCR + Content Extraction:
   - Identify the type of document
   - Extract key information including: names, issuer, institution, dates, locations, monetary values, signatures, seals, stamps, watermarks, reference numbers, diagnosis/claim reason (if applicable), and currency.

2. Structural & Authenticity Checks:
   - Check if the document follows a realistic format for its type
   - Check for letterhead, official seal, watermark, QR code, signature, serial number, and institutional identifiers
   - Detect inconsistencies in fonts, alignment, kerning, color, shadows, or layering that indicate digital manipulation or copy-paste activity

3. Contextual Consistency:
   - Check date consistency (e.g., event/date/issue mismatch)
   - Check issuer-context alignment (e.g., medical claim document not issued by a medical authority)
   - Check monetary amount patterns for plausibility
   - Check if the document purpose aligns with a typical crowdfunding need

4. Tampering & Manipulation Indicators:
   - Flag digital editing artifacts
   - Detect signature duplication from known patterns
   - Detect reused seals or templates
   - Detect ELA/JPEG noise inconsistencies
   - Detect missing texture for signatures/stamps (flat vs pen pressure)
   - Detect document stitched from multiple different sources

5. Duplicate & Reuse Screening:
   - Detect identical or near-identical text, numbers, or patterns against previously processed documents
   - Detect template reuse from known fraudulent documents (if history available)
   - Use hashes and extracted fingerprints to identify cloning

6. CROWDFUNDING FRAUD PATTERN CHECK (Important):
   Check for the following risk signals commonly found in crowdfunding scams:
   - Overinflated bills or inflated invoice pricing
   - Fake or exaggerated diagnosis/injury stories
   - Authentic documents with modified numbers or dates
   - Real documents but reused for multiple campaigns
   - Stock or internet images used as supporting evidence
   - Mismatched story vs document (timeline/location mismatch)
   - Vague issuer identity or unverifiable authority
   - Unusually perfect template-like documents
   - Emotional narrative unsupported by documents
   - ID mismatch between beneficiary and uploader
   - Bank account unrelated to beneficiary
   - Repeated patterns or formatting across multiple uploads
   - Nonexistent institutions or unverifiable hospitals/schools
   - Suspiciously high frequency of claims in short time

7. Output Risk Evaluation:
   Provide the results in the JSON structure below. ONLY output valid JSON, no markdown, no code blocks, no extra commentary:

{
  "document_type": "...",
  "fraud_probability": "XX%",
  "confidence": "0.XX",
  "risk_factors": [
    "reason 1",
    "reason 2",
    "reason 3"
  ],
  "extracted_fields": {
    "name": "...",
    "issuer": "...",
    "institution": "...",
    "dates": {
      "issue_date": "...",
      "event_date": "...",
      "due_date": "..."
    },
    "amount": "...",
    "currency": "...",
    "has_signature": true,
    "has_stamp": false,
    "has_watermark": false
  }
}

Only output JSON. No extra commentary, approval, denial, or emotion. Ensure the JSON is valid and parseable.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Analyzing document with AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: FRAUD_SCREENING_PROMPT
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this document for fraud indicators. Return ONLY valid JSON matching the specified structure."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'API credits exhausted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No analysis result returned' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Raw AI response:", content);

    // Parse the JSON response - handle markdown code blocks if present
    let analysisResult;
    try {
      let jsonString = content.trim();
      // Remove markdown code blocks if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.slice(7);
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.slice(3);
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.slice(0, -3);
      }
      jsonString = jsonString.trim();
      
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Content was:", content);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse analysis result',
          raw_response: content 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Analysis complete:", analysisResult);

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in analyze-document:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});


# AI edit: change ui and add features


# AI edit: change ui and add features
