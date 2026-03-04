
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Copy, Check, RefreshCw, MessageSquare, Send,
  Coffee, Briefcase, Heart, AlertCircle, PenTool, Languages,
  CheckCircle2, Edit3, User, Zap, Trash2,
  CheckCheck, Share2, MousePointerClick, ShieldCheck,
  FileText, Palette, Download, RotateCcw
} from 'lucide-react';
import { generateMessageParts } from './geminiService';
import { MessageTone, MessageParts, SelectedParts } from './types';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<MessageTone>(MessageTone.PROFESSIONAL);
  const [responderName, setResponderName] = useState(() => localStorage.getItem('reply_ai_name') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MessageParts | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<SelectedParts>({
    greeting: 'Dear Partner', body: '', thanks: '', closing: ''
  });
  const [copied, setCopied] = useState(false);
  const [lastCopiedId, setLastCopiedId] = useState<string | null>(null);

  const theme = useMemo(() => {
    const map = {
      [MessageTone.PROFESSIONAL]: {
        primary: '#334155',
        accent: 'slate',
        gradient: 'from-slate-600 to-slate-800',
        bgSoft: 'bg-slate-50',
        bgCard: 'bg-slate-100/50',
        border: 'border-slate-200',
        text: 'text-slate-600',
        glow: 'shadow-slate-200/50',
      },
      [MessageTone.FRIENDLY]: {
        primary: '#15803d',
        accent: 'emerald',
        gradient: 'from-emerald-500 to-green-700',
        bgSoft: 'bg-emerald-50/50',
        bgCard: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        glow: 'shadow-emerald-200/50',
      },
      [MessageTone.CASUAL]: {
        primary: '#c2410c',
        accent: 'orange',
        gradient: 'from-orange-500 to-red-700',
        bgSoft: 'bg-orange-50/50',
        bgCard: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-700',
        glow: 'shadow-orange-200/50',
      },
      [MessageTone.APOLOGETIC]: {
        primary: '#7c3aed',
        accent: 'violet',
        gradient: 'from-violet-500 to-indigo-700',
        bgSoft: 'bg-violet-50/50',
        bgCard: 'bg-violet-50',
        border: 'border-violet-200',
        text: 'text-violet-700',
        glow: 'shadow-violet-200/50',
      }
    };
    return map[tone];
  }, [tone]);

  useEffect(() => {
    localStorage.setItem('reply_ai_name', responderName);
  }, [responderName]);

  const handleGenerate = async () => {
    if (!responderName.trim()) {
      setError("Please enter an organization signature.");
      return;
    }
    if (!topic.trim()) {
      setError("Please describe the intent of the message.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await generateMessageParts(topic, tone);
      setResults(data);
      setSelected({
        greeting: 'Dear Partner',
        body: data.bodies[0] || '',
        thanks: data.thanks[0] || '',
        closing: data.closings[0] || 'Best regards'
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTopic('');
    setResults(null);
    setError(null);
    setSelected({
      greeting: 'Dear Partner', body: '', thanks: '', closing: ''
    });
    setIsEditing(false);
  };

  const getFullText = () => {
    return `${selected.greeting}\n\n${selected.body}\n\n${selected.thanks}\n\n${selected.closing}\n${responderName}`.trim();
  };

  const copyFullText = () => {
    navigator.clipboard.writeText(getFullText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDraft = () => {
    const element = document.createElement("a");
    const file = new Blob([getFullText()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ReplyAI_Draft_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const copyPartial = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setLastCopiedId(id);
    setTimeout(() => setLastCopiedId(null), 1500);
  };

  return (
    <div className={`min-h-screen tone-transition ${theme.bgSoft} text-slate-900`}>
      <nav className="glass sticky top-0 z-50 border-b border-slate-200 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl text-white shadow-xl bg-gradient-to-br ${theme.gradient} animate-float`}>
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-800">REPLY.AI</h1>
                <span className={`px-2 py-0.5 rounded-full ${theme.bgCard} ${theme.text} text-[8px] font-black uppercase tracking-widest border ${theme.border}`}>
                  v1.2.1 Speed Optimized
                </span>
              </div>
              <p className={`text-[9px] font-bold uppercase tracking-[0.1em] ${theme.text}`}>Chromatic Workspace • Collective Voice</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 ${theme.bgCard} border ${theme.border} rounded-xl text-[10px] font-black text-slate-600`}>
              <Languages size={14} className={theme.text} />
              ENG MULTI-PLURAL MODE
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-1.5 rounded-[2.5rem] border ${theme.border} shadow-2xl transition-all duration-500 bg-white`}>
            <div className={`p-8 rounded-[2.2rem] space-y-10 transition-colors duration-500 ${theme.bgSoft}`}>
              <section className="space-y-10">
                <div className="space-y-3">
                  <label className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${theme.text}`}>
                    <User size={14} /> Organization Signature
                  </label>
                  <input 
                    type="text" 
                    value={responderName}
                    onChange={(e) => setResponderName(e.target.value)}
                    placeholder="e.g. The IT Support Team"
                    className={`w-full px-6 py-4 bg-white rounded-2xl border-2 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300 focus:border-${theme.accent}-500 focus:ring-4 focus:ring-${theme.accent}-100/50 shadow-sm`}
                  />
                </div>

                <div className="space-y-3">
                  <label className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${theme.text}`}>
                    <Palette size={14} /> Workspace Tone
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(MessageTone).map(t => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group ${
                          tone === t 
                          ? `bg-white border-${theme.accent}-500 shadow-lg shadow-${theme.accent}-200/50 scale-[1.05]` 
                          : 'border-white bg-white/40 text-slate-400 hover:bg-white hover:border-slate-200'
                        }`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-widest ${tone === t ? 'text-slate-900' : 'text-slate-400'}`}>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${theme.text}`}>
                      <MessageSquare size={14} /> Conversation Intent
                    </label>
                    <button 
                      onClick={handleReset}
                      className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw size={10} /> Reset All
                    </button>
                  </div>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Briefly state what we need to communicate..."
                    className={`w-full h-40 px-6 py-5 bg-white rounded-2xl border-2 transition-all outline-none resize-none font-medium text-slate-700 leading-relaxed text-sm focus:border-${theme.accent}-500 focus:ring-4 focus:ring-${theme.accent}-100/50 shadow-sm`}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                      loading 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300' 
                      : `bg-slate-900 text-white hover:shadow-${theme.accent}-200 hover:-translate-y-1`
                    }`}
                  >
                    {loading ? <RefreshCw size={18} className="animate-spin" /> : <><Send size={18} /> Compose Response</>}
                  </button>
                </div>

                {error && <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border-2 border-red-100 text-red-700">
                  <AlertCircle size={18} />
                  <p className="text-[11px] font-black uppercase tracking-tight">{error}</p>
                </div>}
              </section>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          {!results ? (
            <div className={`h-full min-h-[600px] flex flex-col items-center justify-center border-4 border-dashed ${theme.border} rounded-[4rem] bg-white/60 p-12 text-center group transition-all duration-700 hover:bg-white`}>
               <div className={`p-12 bg-white rounded-full shadow-2xl ${theme.glow} text-slate-100 mb-10 transition-all duration-700 group-hover:scale-110`}>
                  <FileText size={80} strokeWidth={1} className={theme.text} />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Ready for Composition</h3>
               <p className={`text-sm max-w-xs mt-4 font-bold italic leading-relaxed ${theme.text}`}>"Great teams speak with one clear, professional voice."</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="space-y-12">
                <header className="flex items-end justify-between px-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Variations</h2>
                    <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${theme.text}`}>Refined Plural Expressions</p>
                  </div>
                  <button onClick={() => setResults(null)} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.2em]">
                    <Trash2 size={16} /> Discard Results
                  </button>
                </header>

                <div className="space-y-12">
                  <div className="space-y-5">
                    <h4 className={`text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 px-4 ${theme.text}`}>
                      <div className={`w-2 h-2 rounded-full ${theme.accent === 'slate' ? 'bg-slate-500' : `bg-${theme.accent}-500`}`}></div>
                      01. Select Central Message
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
                      {results.bodies.map((b, i) => (
                        <div 
                          key={i} 
                          onClick={() => setSelected({...selected, body: b})}
                          className={`group relative p-1 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer flex flex-col h-full ${
                            selected.body === b 
                            ? `border-${theme.accent}-500 bg-white shadow-2xl ${theme.glow} scale-[1.03]` 
                            : `border-transparent ${theme.bgCard} hover:border-${theme.accent}-200 hover:bg-white`
                          }`}
                        >
                           <div className={`flex-grow px-8 py-10 text-[14px] font-bold text-slate-700 leading-relaxed`}>
                             {b}
                           </div>
                           <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <button 
                                onClick={(e) => { e.stopPropagation(); copyPartial(b, `body-${i}`); }} 
                                className={`p-2.5 rounded-xl transition-all shadow-sm ${lastCopiedId === `body-${i}` ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'}`}
                              >
                                {lastCopiedId === `body-${i}` ? <Check size={14}/> : <Copy size={14}/>}
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-5">
                      <h4 className={`text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 px-4 ${theme.text}`}>
                        <div className={`w-2 h-2 rounded-full ${theme.accent === 'slate' ? 'bg-slate-500' : `bg-${theme.accent}-500`}`}></div>
                        02. Professional Courtesy
                      </h4>
                      <div className="space-y-3 px-2">
                        {results.thanks.map((t, i) => (
                          <button 
                            key={i} 
                            onClick={() => setSelected({...selected, thanks: t})}
                            className={`w-full text-left px-6 py-4.5 rounded-2xl border-2 text-[12px] font-bold transition-all ${
                              selected.thanks === t 
                              ? `border-${theme.accent}-500 bg-white shadow-lg ${theme.text} translate-x-2` 
                              : `border-transparent ${theme.bgCard} text-slate-500 hover:border-slate-200 hover:bg-white`
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-5">
                      <h4 className={`text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-3 px-4 ${theme.text}`}>
                        <div className={`w-2 h-2 rounded-full ${theme.accent === 'slate' ? 'bg-slate-500' : `bg-${theme.accent}-500`}`}></div>
                        03. Exit Strategy
                      </h4>
                      <div className="space-y-3 px-2">
                        {results.closings.map((c, i) => (
                          <button 
                            key={i} 
                            onClick={() => setSelected({...selected, closing: c})}
                            className={`w-full text-left px-6 py-4.5 rounded-2xl border-2 text-[12px] font-bold transition-all ${
                              selected.closing === c 
                              ? `border-${theme.accent}-500 bg-white shadow-lg ${theme.text} translate-x-2` 
                              : `border-transparent ${theme.bgCard} text-slate-500 hover:border-slate-200 hover:bg-white`
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-24 relative px-2 group">
                {!isEditing && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-default pointer-events-none">
                    <MousePointerClick size={14} /> Click anywhere on station to copy full draft
                  </div>
                )}

                <div 
                  onClick={() => !isEditing && copyFullText()}
                  className={`bg-white rounded-[3rem] border transition-all duration-700 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] ${
                    copied ? 'border-emerald-500 scale-[0.99] shadow-emerald-200/40' : `border-${theme.accent}-100`
                  } ${!isEditing ? 'cursor-copy' : 'cursor-default'}`}
                >
                  <div className={`h-14 flex items-center justify-between px-10 ${theme.bgCard} border-b ${theme.border}`}>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/40"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400/40"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400/40"></div>
                    </div>
                    <div className="flex items-center gap-2">
                       <PenTool size={14} className={theme.text} />
                       <span className={`text-[10px] font-black uppercase tracking-[0.5em] italic ${theme.text}`}>Live Draft Station</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }} 
                        className={`p-2 rounded-lg transition-all ${isEditing ? `bg-${theme.accent}-600 text-white shadow-lg` : 'text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-100'}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); downloadDraft(); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-100"
                        title="Download as TXT"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyFullText(); }}
                        className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-100'}`}
                      >
                        {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="p-12 md:p-24 space-y-12 font-serif leading-relaxed text-slate-800 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] relative">
                    {copied && (
                      <div className="absolute inset-0 bg-emerald-50/10 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none animate-in fade-in duration-300">
                        <div className="bg-emerald-600 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4">
                          <CheckCheck size={32} />
                          <span className="text-xl font-black uppercase tracking-widest">Draft Copied!</span>
                        </div>
                      </div>
                    )}

                    <div className={`border-b-2 ${theme.border} pb-10 space-y-4`}>
                      <div className="flex items-center gap-4 text-sm font-bold text-slate-300">
                        <span className={`px-2 py-0.5 rounded ${theme.bgCard} ${theme.text} text-[10px] uppercase font-black`}>Subj</span> 
                        <span className={`font-black text-lg ${theme.text}`}>Ref: Outbound Partnership Inquiry ({tone})</span>
                      </div>
                    </div>

                    <div className="text-xl md:text-2xl space-y-10 min-h-[400px]">
                       <p className="font-bold text-slate-900">{selected.greeting},</p>
                       <div className="relative group/content">
                        {isEditing ? (
                          <textarea 
                            value={selected.body}
                            onChange={(e) => setSelected({...selected, body: e.target.value})}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full min-h-[250px] ${theme.bgSoft} p-8 rounded-3xl border-4 border-dashed ${theme.border} focus:outline-none focus:border-${theme.accent}-400 font-serif text-xl md:text-2xl leading-relaxed shadow-inner transition-all`}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap leading-[1.8] tracking-tight font-medium text-slate-800">{selected.body}</p>
                        )}
                        {!isEditing && <div className={`absolute -left-10 top-0 w-2 h-full bg-gradient-to-b ${theme.gradient} rounded-full opacity-30`}></div>}
                       </div>
                       <p className={`italic font-sans text-lg leading-relaxed ${theme.text} opacity-80 border-l-4 ${theme.border} pl-6`}>{selected.thanks}</p>
                       <div className={`pt-12 border-t-2 ${theme.border} space-y-2`}>
                         <p className="font-bold text-slate-900">{selected.closing},</p>
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white shadow-lg`}>
                               <Zap size={14} fill="currentColor" />
                            </div>
                            <p className={`font-sans font-black text-sm uppercase tracking-[0.5em] ${theme.text}`}>{responderName || '[The Team]'}</p>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className={`p-8 ${theme.bgCard} flex flex-col md:flex-row gap-6 items-center justify-between border-t ${theme.border}`}>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collaborative Draft Protocol</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); copyFullText(); }} 
                      className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 ${
                        copied ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-black hover:-translate-y-1'
                      }`}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />} 
                      {copied ? 'Copied' : 'Export Full Response'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between text-slate-400 gap-8">
        <div className="flex items-center gap-4 group">
          <div className={`p-3 bg-white rounded-2xl border ${theme.border} shadow-lg group-hover:rotate-12 transition-transform`}>
            <ShieldCheck size={20} className={theme.text} />
          </div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] leading-none">
            REPLY.AI <span className={`mx-2 text-slate-300`}>|</span> <span className={theme.text}>v1.2 Chromatic Engine</span>
          </div>
        </div>
        <div className="flex gap-10">
          {['Policy', 'Logs', 'Help'].map(item => (
            <button key={item} className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-slate-800">
              {item}
            </button>
          ))}
        </div>
      </footer>
      <style>{`.cursor-copy { cursor: copy; }`}</style>
    </div>
  );
};

export default App;
