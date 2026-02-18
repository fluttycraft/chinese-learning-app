"use client";

import React, { useState, useMemo } from "react";
import {
  Play,
  Volume2,
  ChevronDown,
  GraduationCap,
  Eye,
  EyeOff,
  BookOpen,
  MessageSquare,
} from "lucide-react";

import vocabData from "@/data/vocab.json";
import patternsData from "@/data/patterns.json";

type Tab = "vocab" | "patterns";

interface Pattern {
  id: number;
  hsk_level: number;
  pattern: string;
  pinyin: string;
  myanmar: string;
  structure: string;
  examples: { chinese: string; pinyin: string; myanmar: string }[];
}

export default function ChineseLearningApp() {
  const [activeTab, setActiveTab] = useState<Tab>("vocab");
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [hskLevel, setHskLevel] = useState<number>(1);
  const [showHskFilter, setShowHskFilter] = useState<boolean>(false);
  const [showChinese, setShowChinese] = useState<boolean>(true);
  const [activePattern, setActivePattern] = useState<number | null>(null);

  const items = useMemo(() => {
    if (showHskFilter) {
      return vocabData.filter((item) => item.hsk_level === hskLevel);
    }
    return vocabData;
  }, [showHskFilter, hskLevel]);

  const patterns = useMemo(() => {
    return (patternsData as Pattern[]).filter((p) => p.hsk_level === 1);
  }, []);

  const handlePlayAudio = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-md pt-4 pb-4 mb-2">
          {/* Tab Bar */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => { setActiveTab("vocab"); setActiveItem(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "vocab"
                  ? "bg-cyan-600 border-cyan-500 text-white shadow-lg"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen size={14} />
              Vocabulary
            </button>
            <button
              onClick={() => { setActiveTab("patterns"); setActivePattern(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "patterns"
                  ? "bg-violet-600 border-violet-500 text-white shadow-lg"
                  : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare size={14} />
              Patterns
            </button>

            {activeTab === "vocab" && (
              <>
                <button
                  onClick={() => setShowChinese(!showChinese)}
                  className={`p-2 rounded-xl border transition-all ml-auto ${
                    showChinese
                      ? "bg-slate-800 border-slate-700 text-slate-400"
                      : "bg-cyan-600 border-cyan-500 text-white"
                  }`}
                  title={showChinese ? "Hide Chinese" : "Show Chinese"}
                >
                  {showChinese ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => { setShowHskFilter(!showHskFilter); setActiveItem(null); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] uppercase tracking-wider font-bold transition-all ${
                    showHskFilter
                      ? "bg-cyan-600 border-cyan-500 text-white shadow-lg"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GraduationCap size={14} />
                  HSK
                </button>
              </>
            )}
          </div>

          {/* HSK Level Selector (vocab tab only) */}
          {activeTab === "vocab" && showHskFilter && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <button
                  key={level}
                  onClick={() => { setHskLevel(level); setActiveItem(null); }}
                  className={`flex-shrink-0 w-12 h-10 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    hskLevel === level
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                      : "bg-slate-800/40 border-slate-700 text-slate-500"
                  }`}
                >
                  <span className="text-[10px] leading-none opacity-70">HSK</span>
                  <span className="text-sm font-bold">{level}</span>
                </button>
              ))}
            </div>
          )}

          {/* Count bar */}
          <div className="text-xs text-slate-500 mt-1">
            {activeTab === "vocab"
              ? `${items.length} words`
              : `${patterns.length} patterns · HSK 1`}
          </div>
        </header>

        {/* ── VOCAB TAB ── */}
        {activeTab === "vocab" && (
          <div className="space-y-3 pb-32">
            {items.length > 0 ? (
              items.map((item, index: number) => (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(activeItem === index ? null : index)}
                  className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeItem === index
                      ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                      : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
                  }`}
                >
                  {showChinese && (
                    <div className="absolute -right-4 -top-4 text-9xl font-serif text-slate-700/10 pointer-events-none select-none">
                      {item.word.charAt(0)}
                    </div>
                  )}
                  <div className="p-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-cyan-500/80 bg-cyan-950/30 px-2 py-1 rounded min-w-[2rem] text-center">
                        {item.id.toString().padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xl font-bold tracking-wider transition-all duration-300 ${
                          showChinese
                            ? "text-cyan-400"
                            : "text-transparent bg-slate-700/30 rounded blur-md select-none w-fit px-2"
                        }`}>
                          {item.word}
                        </p>
                        <p className="text-sm text-slate-300 mt-0.5 truncate">{item.myanmar}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${activeItem === index ? "rotate-180" : ""}`} />
                    </div>
                    <div className={`grid transition-all duration-300 ease-out overflow-hidden ${activeItem === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="min-h-0 space-y-3">
                        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Pinyin</p>
                            <p className="text-lg text-white font-medium">{item.pinyin}</p>
                          </div>
                          <button
                            onClick={(e) => handlePlayAudio(item.word, e)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg transition-transform active:scale-95"
                          >
                            <Play className="w-5 h-5 ml-1" fill="currentColor" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No words found in this category.</p>
              </div>
            )}
          </div>
        )}

        {/* ── PATTERNS TAB ── */}
        {activeTab === "patterns" && (
          <div className="space-y-4 pb-32">
            {patterns.map((pattern, index) => (
              <div
                key={pattern.id}
                onClick={() => setActivePattern(activePattern === index ? null : index)}
                className={`rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                  activePattern === index
                    ? "bg-slate-800/80 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                    : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
                }`}
              >
                <div className="p-4">
                  {/* Pattern header */}
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-violet-400/80 bg-violet-950/30 px-2 py-1 rounded min-w-[2rem] text-center mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xl font-bold text-violet-300 tracking-wide">{pattern.pattern}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{pattern.pinyin}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handlePlayAudio(pattern.pattern, e)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg transition-transform active:scale-95"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${activePattern === index ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Myanmar explanation always visible */}
                  <div className="mt-2 ml-10">
                    <p className="text-sm text-amber-300/90">{pattern.myanmar}</p>
                  </div>

                  {/* Expanded: structure + examples */}
                  <div className={`grid transition-all duration-300 ease-out overflow-hidden ${activePattern === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="min-h-0 space-y-3">
                      {/* Structure */}
                      <div className="bg-violet-950/30 rounded-lg p-3 border border-violet-800/30">
                        <p className="text-[10px] text-violet-400 uppercase tracking-widest font-bold mb-1">ပုံစံ (Structure)</p>
                        <p className="text-sm text-slate-300">{pattern.structure}</p>
                      </div>

                      {/* Examples */}
                      <div className="space-y-2">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">ဥပမာများ (Examples)</p>
                        {pattern.examples.map((ex, i) => (
                          <div key={i} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-base text-cyan-300 font-medium">{ex.chinese}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{ex.pinyin}</p>
                                <p className="text-sm text-slate-300 mt-1">{ex.myanmar}</p>
                              </div>
                              <button
                                onClick={(e) => handlePlayAudio(ex.chinese, e)}
                                className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-cyan-700/60 hover:bg-cyan-600 text-white transition-colors mt-0.5"
                              >
                                <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Bar (vocab tab) */}
        {activeTab === "vocab" && activeItem !== null && (
          <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-50 pointer-events-none">
            <div className="bg-[#1e293b]/90 border border-slate-600/50 text-white rounded-2xl shadow-2xl p-4 w-full max-w-md flex items-center justify-between pointer-events-auto backdrop-blur-xl">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  {showHskFilter ? `HSK Level ${hskLevel}` : "Vocabulary"}
                </span>
                <span className={`font-bold transition-all ${showChinese ? "text-cyan-400" : "text-slate-500 italic"}`}>
                  {showChinese ? items[activeItem]?.word : "Character Hidden"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    const item = items[activeItem];
                    if (item) handlePlayAudio(item.word, e);
                  }}
                  className="p-3 rounded-full bg-red-500 hover:bg-red-400 text-white shadow-lg transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
