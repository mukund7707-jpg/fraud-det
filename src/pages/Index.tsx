import { motion } from "framer-motion";
import { DocumentUpload } from "@/components/DocumentUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { useDocumentAnalysis } from "@/hooks/useDocumentAnalysis";
import { Button } from "@/components/ui/button";
import { Shield, Scan, AlertTriangle, FileSearch, Activity, Zap, Lock, Eye } from "lucide-react";

const Index = () => {
  const {
    isAnalyzing,
    result,
    error,
    uploadedFile,
    previewUrl,
    handleFileSelect,
    clearFile,
    analyzeDocument,
  } = useDocumentAnalysis();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background pattern */}
      <div className="fixed inset-0 dot-pattern opacity-30 pointer-events-none" />
      
      {/* Animated Gradient orbs */}
      <motion.div 
        className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-data-cyan/10 rounded-full blur-[100px] pointer-events-none"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Header */}
      <header className="relative border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <Shield className="w-6 h-6 text-primary" />
                <motion.div 
                  className="absolute inset-0 rounded-xl bg-primary/20 blur-xl -z-10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-foreground heading-display tracking-tight">
                  FraudScreen
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI-Powered Document Verification
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-risk-low/10 border border-risk-low/20">
                <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse" />
                <span className="text-xs font-medium text-risk-low">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-12">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants} 
            className="text-center mb-12 perspective-1000"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-foreground mb-5 heading-display"
              initial={{ opacity: 0, rotateX: -15, y: 50 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              Document Fraud Detection
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Automated analysis for medical certificates, invoices, ID documents, and bank statements.
              Upload a file to check for tampering, forgery, and inconsistencies.
            </motion.p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { icon: Eye, label: "OCR Extraction" },
              { icon: Lock, label: "Metadata Analysis" },
              { icon: AlertTriangle, label: "Fraud Detection" },
              { icon: Activity, label: "Pattern Matching" },
            ].map(({ icon: Icon, label }, index) => (
              <motion.div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 cursor-default"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  transition: { duration: 0.2 }
                }}
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Upload */}
            <motion.div 
              variants={itemVariants} 
              className="space-y-5"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="p-2 rounded-lg bg-primary/10"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FileSearch className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground heading-display">
                    Upload Document
                  </h3>
                </div>
                {uploadedFile && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Button
                      onClick={analyzeDocument}
                      className="glow-button bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      Analyze Document
                    </Button>
                  </motion.div>
                )}
              </div>

              <DocumentUpload
                onFileSelect={handleFileSelect}
                uploadedFile={uploadedFile}
                previewUrl={previewUrl}
                onClear={clearFile}
                isAnalyzing={isAnalyzing}
              />

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 backdrop-blur"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-destructive/20">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    </div>
                    <div>
                      <p className="font-semibold text-destructive">Analysis Error</p>
                      <p className="text-sm text-destructive/80 mt-1">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Column - Results */}
            <motion.div variants={itemVariants} className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground heading-display">
                  Analysis Results
                </h3>
              </div>

              {result ? (
                <AnalysisResults result={result} />
              ) : (
                <motion.div 
                  className="premium-card flex flex-col items-center justify-center py-16 px-8 rounded-xl relative overflow-hidden"
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 2,
                    rotateX: 2,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-data-cyan/5 opacity-50" />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Shield className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  </motion.div>
                  <p className="text-muted-foreground text-center text-sm relative z-10">
                    Upload a document to see analysis results
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Info Cards */}
          <motion.div variants={itemVariants} className="mt-16 grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: FileSearch,
                title: "Supported Documents",
                description: "Medical certificates, invoices, government IDs, bank statements, and other financial documents (PDF, JPG, PNG)."
              },
              {
                icon: Shield,
                title: "Detection Methods",
                description: "Checks for image manipulation, font inconsistencies, metadata tampering, and template reuse across submissions."
              },
              {
                icon: Activity,
                title: "Report Output",
                description: "Provides fraud probability score, risk level classification, identified suspicious patterns, and extracted text data."
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="p-6 rounded-xl bg-card border border-border/50 relative overflow-hidden group"
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.03,
                  rotateY: 5,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-data-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div 
                      className="p-2 rounded-lg bg-muted"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="w-5 h-5 text-foreground" />
                    </motion.div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/50 mt-20 py-8 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            Document verification system for crowdfunding platforms
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


# AI edit: change ui and add features
