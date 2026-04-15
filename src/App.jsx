import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, AlertTriangle, CheckCircle, Loader2, RefreshCw, 
  Brain, BarChart, ClipboardCheck, ChevronRight, Target, Zap, Code, Info, Search, Cpu, FileText, ArrowLeft 
} from 'lucide-react';

function App() {
  // Navigation State: 'landing', 'app', 'how-it-works'
  const [view, setView] = useState('landing'); // 'landing', 'how-it-works', 'app'
  // Existing states
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  const resultsRef = useRef(null);

  useEffect(() => {
    if (results && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [results]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setResults(null); 
    
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResults(data);
    } catch (error) {
      alert("Error: Could not analyze the image. Make sure your server is running.");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'Low': return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30';
      case 'Medium': return 'bg-[#facc15]/20 text-[#facc15] border-[#facc15]/30';
      case 'High': return 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]/30';
      case 'Critical': return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30';
      default: return 'bg-[#2a3044] text-[#e8eaf0] border-[#2a3044]';
    }
  };

  // ══════════════════════════════════════════════════════════════
  // PAGE: HOW IT WORKS
  // ══════════════════════════════════════════════════════════════
  if (view === 'how-it-works') {
    return (
      <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] font-dm p-6 md:p-12 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => setView('landing')} 
            className="text-[#7a8399] hover:text-white mb-8 flex items-center transition-colors font-syne font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </button>
          
          <h2 className="font-syne text-4xl font-bold text-white mb-6">How <span className="text-[#f97316]">CrackDetect AI</span> Works</h2>
          <p className="text-[#7a8399] text-lg mb-12 max-w-2xl">Our system leverages advanced multimodal Large Language Models (LLMs) to perform structural diagnostics that previously required manual inspection.</p>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-[#161a22] border border-[#2a3044] p-8 rounded-2xl flex items-start space-x-6">
              <div className="bg-[#f97316]/10 p-4 rounded-xl border border-[#f97316]/20 text-[#f97316]">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-syne text-xl font-bold text-white mb-2">Step 1: Visual Scanning</h3>
                <p className="text-[#7a8399] leading-relaxed">When you upload an image, our system performs high-resolution pre-processing to identify visual anomalies, surface textures, and depth patterns often associated with structural fatigue.</p>
              </div>
            </div>

            <div className="bg-[#161a22] border border-[#2a3044] p-8 rounded-2xl flex items-start space-x-6">
              <div className="bg-[#f97316]/10 p-4 rounded-xl border border-[#f97316]/20 text-[#f97316]">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-syne text-xl font-bold text-white mb-2">Step 2: Neural Analysis</h3>
                <p className="text-[#7a8399] leading-relaxed">The image is processed by Gemini 2.5 Flash. It evaluates the 'crack geometry'—analyzing width, orientation (vertical vs. horizontal), and intersection points to determine if the issue is cosmetic or structural.</p>
              </div>
            </div>

            <div className="bg-[#161a22] border border-[#2a3044] p-8 rounded-2xl flex items-start space-x-6">
              <div className="bg-[#f97316]/10 p-4 rounded-xl border border-[#f97316]/20 text-[#f97316]">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-syne text-xl font-bold text-white mb-2">Step 3: Engineering Report</h3>
                <p className="text-[#7a8399] leading-relaxed">Finally, the system generates a structured JSON report. It provides a severity score and specific engineering recommendations based on established civil engineering safety standards.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 border border-[#f97316]/20 bg-[#f97316]/5 rounded-2xl text-center">
            <h4 className="font-syne text-white font-bold mb-2">Ready to test a structure?</h4>
            <button 
              onClick={() => setView('app')}
              className="mt-4 bg-[#f97316] text-white font-syne font-bold py-4 px-10 rounded-xl hover:bg-[#ea580c] transition-all shadow-lg shadow-[#f97316]/20"
            >
              Go to Scanner
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // LANDING PAGE RENDER
  // ══════════════════════════════════════════════════════════════
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] font-dm relative overflow-hidden flex flex-col">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#f97316]/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Navigation Bar */}
        <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
          <div className="font-syne text-2xl font-bold text-white tracking-tight">
            CrackDetect <span className="text-[#f97316]">AI</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-[#7a8399]">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <button onClick={() => setView('how-it-works')} className="hover:text-white transition-colors">How it Works</button>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center px-6 relative z-10 text-center pb-20">
          
          <div className="inline-flex items-center space-x-2 bg-[#f97316]/10 border border-[#f97316]/30 px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse"></span>
            <span className="text-[#f97316] text-xs font-bold uppercase tracking-widest">v1.0 Prototype Live</span>
          </div>

          <h1 className="font-syne text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight max-w-4xl leading-[1.1]">
            Intelligent Structural Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7a8399]">at Scale.</span>
          </h1>
          
          <p className="text-[#7a8399] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Upload building surface images and let our advanced vision models detect, classify, and assess structural cracks in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
            <button 
              onClick={() => setView('app')}
              className="w-full sm:w-auto bg-[#f97316] hover:bg-[#ea580c] text-white font-syne font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center text-lg shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:-translate-y-1"
            >
              Start Analysis <ChevronRight className="w-5 h-5 ml-2" />
            </button>
            <a href="https://github.com/Ak1Anniee/AI-crack-detection" target="_blank" rel="noopener noreferrer">
                <button className="w-full sm:w-auto bg-transparent border border-[#2a3044] hover:bg-[#161a22] hover:border-[#7a8399] text-white font-syne font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center text-lg">
                View Documentation
              </button>
            </a>
          </div>

          {/* Stats / Trust Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-8 border-t border-[#2a3044]/50 max-w-4xl w-full">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center text-[#e8eaf0] font-syne font-bold text-xl mb-1">
                <Target className="w-5 h-5 text-[#f97316] mr-2" /> 99%
              </div>
              <p className="text-[#7a8399] text-sm">Accuracy Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center text-[#e8eaf0] font-syne font-bold text-xl mb-1">
                <Zap className="w-5 h-5 text-[#f97316] mr-2" /> &lt; 2s
              </div>
              <p className="text-[#7a8399] text-sm">Processing Time</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center text-[#e8eaf0] font-syne font-bold text-xl mb-1">
                <Code className="w-5 h-5 text-[#f97316] mr-2" /> JSON
              </div>
              <p className="text-[#7a8399] text-sm">Full API Export</p>
            </div>
          </div>

        </main>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // MAIN APPLICATION RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#e8eaf0] font-dm p-4 md:p-8 relative">
      
      {/* ══ FULL SCREEN PROCESSING BUFFER ══ */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0f14]/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative flex items-center justify-center w-28 h-28 mb-8">
            <div className="absolute inset-0 border-4 border-[#2a3044] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#f97316] rounded-full border-t-transparent animate-spin drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
            <div className="w-3 h-3 bg-[#f97316] rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
          </div>
          
          <h2 className="font-syne text-3xl font-bold text-white mb-3 tracking-wide">
            Analyzing Structure...
          </h2>
          <p className="text-[#7a8399] font-medium text-base tracking-wide animate-pulse">
            Scanning for micro-fractures and structural anomalies
          </p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Navigation back to landing page */}
        <button 
          onClick={() => setView('landing')} 
          className="text-[#7a8399] hover:text-white flex items-center text-sm font-medium transition-colors mb-[-1rem] pt-4"
        >
          ← Back to Home
        </button>

        {/* ══ HERO SECTION ══ */}
        <header className="text-center pb-4">
          <h1 className="font-syne text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            CrackDetect <span className="text-[#f97316]">AI</span>
          </h1>
          <p className="text-[#7a8399] text-lg max-w-2xl mx-auto">
            Upload an image of a building surface. Our advanced vision model will instantly identify cracks, assess structural severity, and provide actionable recommendations.
          </p>
        </header>

        {/* ══ STEP 1: UPLOAD ══ */}
        <section className="bg-[#161a22] border border-[#2a3044] rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="text-[#f97316] font-syne font-bold uppercase tracking-wider text-sm mb-6 flex items-center">
            <span className="w-8 h-8 rounded-full bg-[#f97316]/10 flex items-center justify-center mr-3 border border-[#f97316]/20">•</span>
            Image Upload
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#2a3044] rounded-xl cursor-pointer bg-[#1c2130] hover:border-[#f97316] transition-colors relative overflow-hidden group">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium bg-[#161a22]/80 px-4 py-2 rounded-lg backdrop-blur-sm">Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <UploadCloud className="w-12 h-12 mb-4 text-[#7a8399] group-hover:text-[#f97316] transition-colors" />
                    <p className="text-[#e8eaf0] font-medium mb-1">Drag & drop your image here</p>
                    <p className="text-[#7a8399] text-sm">or click to browse files</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h3 className="font-syne text-xl text-white font-semibold mb-2">Ready for Analysis</h3>
                <p className="text-[#7a8399] text-sm leading-relaxed">Our AI will scan the image for micro-fractures, structural displacement, and settlement signs.</p>
              </div>
              
              <button 
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-syne font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-lg shadow-[#f97316]/20 active:scale-[0.98]"
              >
                Run AI Analysis
              </button>
            </div>
          </div>
        </section>

        {/* ══ KEY FEATURES SECTION ══ */}
        <section className="pt-4 pb-8">
          <div className="text-center mb-8">
            <h2 className="font-syne text-2xl font-bold text-white">Key Features & Capabilities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161a22] p-6 rounded-xl border border-[#2a3044] text-center hover:border-[#f97316]/50 transition-colors group">
              <div className="w-14 h-14 mx-auto bg-[#f97316]/10 rounded-full flex items-center justify-center mb-4 border border-[#f97316]/20 group-hover:bg-[#f97316]/20 transition-colors">
                <Brain className="w-7 h-7 text-[#f97316]" />
              </div>
              <h3 className="font-syne text-lg text-white font-bold mb-2">Instant AI Analysis</h3>
              <p className="text-[#7a8399] text-sm">Powered by advanced vision models to detect even hairline fractures.</p>
            </div>

            <div className="bg-[#161a22] p-6 rounded-xl border border-[#2a3044] text-center hover:border-[#f97316]/50 transition-colors group">
              <div className="w-14 h-14 mx-auto bg-[#f97316]/10 rounded-full flex items-center justify-center mb-4 border border-[#f97316]/20 group-hover:bg-[#f97316]/20 transition-colors">
                <BarChart className="w-7 h-7 text-[#f97316]" />
              </div>
              <h3 className="font-syne text-lg text-white font-bold mb-2">Severity Grading</h3>
              <p className="text-[#7a8399] text-sm">Automatically classifies cracks into Low, Medium, High, or Critical risk levels.</p>
            </div>

            <div className="bg-[#161a22] p-6 rounded-xl border border-[#2a3044] text-center hover:border-[#f97316]/50 transition-colors group">
              <div className="w-14 h-14 mx-auto bg-[#f97316]/10 rounded-full flex items-center justify-center mb-4 border border-[#f97316]/20 group-hover:bg-[#f97316]/20 transition-colors">
                <ClipboardCheck className="w-7 h-7 text-[#f97316]" />
              </div>
              <h3 className="font-syne text-lg text-white font-bold mb-2">Actionable Insights</h3>
              <p className="text-[#7a8399] text-sm">Provides immediate recommendations on next steps and repair urgency.</p>
            </div>
          </div>
        </section>

        {/* ══ STEP 2 & 3: RENDERED ONLY AFTER RESULTS ══ */}
        {results && (
          <div ref={resultsRef} className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-500 scroll-mt-8">
            
            {/* ══ STEP 2: RESULTS ══ */}
            <section className="bg-[#161a22] border border-[#2a3044] rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="text-[#f97316] font-syne font-bold uppercase tracking-wider text-sm mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-[#f97316]/10 flex items-center justify-center mr-3 border border-[#f97316]/20">2</span>
                Step 2: AI Analysis Results
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-[#1c2130] p-6 rounded-xl border border-[#2a3044] mb-8">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  {results.crack_detected ? (
                    <div className="p-3 bg-[#ef4444]/20 rounded-full border border-[#ef4444]/30">
                      <AlertTriangle className="w-8 h-8 text-[#ef4444]" />
                    </div>
                  ) : (
                    <div className="p-3 bg-[#22c55e]/20 rounded-full border border-[#22c55e]/30">
                      <CheckCircle className="w-8 h-8 text-[#22c55e]" />
                    </div>
                  )}
                  <div>
                    <h2 className="font-syne text-2xl font-bold text-white">
                      {results.crack_detected ? "Structural Defect Detected" : "No Defects Found"}
                    </h2>
                    <p className="text-[#7a8399] text-sm mt-1">Scan completed successfully</p>
                  </div>
                </div>
                
                <div className={`px-5 py-2 rounded-lg font-bold border ${getSeverityStyle(results.severity)}`}>
                  {results.severity.toUpperCase()} SEVERITY
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1c2130] p-5 rounded-xl border border-[#2a3044]">
                  <div className="text-[#7a8399] text-xs uppercase tracking-wider mb-1">Crack Type</div>
                  <div className="font-syne text-xl text-white font-semibold">{results.crack_type || "N/A"}</div>
                </div>
                <div className="bg-[#1c2130] p-5 rounded-xl border border-[#2a3044]">
                  <div className="text-[#7a8399] text-xs uppercase tracking-wider mb-1">AI Confidence</div>
                  <div className="font-syne text-xl text-white font-semibold">{Math.round(results.confidence_score * 100)}%</div>
                </div>
                <div className="bg-[#1c2130] p-5 rounded-xl border border-[#2a3044]">
                  <div className="text-[#7a8399] text-xs uppercase tracking-wider mb-1">Detected Location</div>
                  <div className="font-syne text-lg text-white font-semibold truncate" title={results.location}>{results.location || "N/A"}</div>
                </div>
              </div>

              <div className="bg-[#1c2130] p-6 rounded-xl border border-[#2a3044]">
                <div className="text-[#7a8399] text-xs uppercase tracking-wider mb-3">AI Diagnostic Notes</div>
                <p className="text-[#e8eaf0] leading-relaxed italic border-l-4 border-[#f97316] pl-4">
                  "{results.notes}"
                </p>
              </div>
            </section>

            {/* ══ STEP 3: RECOMMENDATIONS ══ */}
            {results.crack_detected && (
              <section className="bg-[#161a22] border border-[#2a3044] rounded-2xl p-6 md:p-8 shadow-2xl">
                <div className="text-[#f97316] font-syne font-bold uppercase tracking-wider text-sm mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[#f97316]/10 flex items-center justify-center mr-3 border border-[#f97316]/20">3</span>
                  Step 3: Recommended Actions
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start p-5 bg-[#1c2130] border border-[#2a3044] rounded-xl hover:border-[#f97316]/30 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#f97316] text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">1</div>
                    <p className="text-[#e8eaf0] leading-relaxed pt-1">
                      <strong>Immediate Action:</strong> {results.recommendation}
                    </p>
                  </div>
                  
                  {results.severity === 'High' || results.severity === 'Critical' ? (
                    <div className="flex items-start p-5 bg-[#1c2130] border border-[#2a3044] rounded-xl hover:border-[#f97316]/30 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#f97316] text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">2</div>
                      <p className="text-[#e8eaf0] leading-relaxed pt-1">
                        <strong>Professional Review:</strong> Contact a licensed civil or structural engineer for an on-site evaluation immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-start p-5 bg-[#1c2130] border border-[#2a3044] rounded-xl hover:border-[#f97316]/30 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#f97316] text-white rounded-full flex items-center justify-center font-bold mr-4 mt-1">2</div>
                      <p className="text-[#e8eaf0] leading-relaxed pt-1">
                        <strong>Monitor Progression:</strong> Place crack gauges or tape markers to track any widening over the next 2–4 weeks.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Bottom Actions */}
            <div className="flex justify-center pb-12">
              <button 
                onClick={resetApp}
                className="flex items-center text-[#e8eaf0] hover:text-[#f97316] transition-colors py-3 px-6 rounded-xl border border-[#2a3044] hover:border-[#f97316]/50 bg-[#161a22] hover:bg-[#1c2130] font-syne font-bold shadow-lg"
              >
                <RefreshCw className="w-5 h-5 mr-3" /> Analyze New Image
              </button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <footer className="text-center text-[#7a8399] text-xs pb-8">
          <p>CrackDetect AI &nbsp;·&nbsp; Smart AI-Based Building Crack Detection System &nbsp;·&nbsp; Prototype v1.0</p>
        </footer>
      </div>
    </div>
  );
}

export default App;