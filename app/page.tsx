"use client";

import React, { useState, useEffect } from "react";
import { Play, Mic, Volume2, ChevronDown } from "lucide-react";

import vocabularyData from "@/data/vocabulary.json";
import conversationData from "@/data/conservation.json";
import { LessonItem } from "@/lesson";

export default function ChineseLearningApp() {
  const [activeTab, setActiveTab] = useState<"conversation" | "vocabulary">(
    "conversation"
  );
  const [activeItem, setActiveItem] = useState<number | null>(null);

  // LOGIC CHANGE: Select the correct JSON data based on the activeTab
  const items: LessonItem[] =
    activeTab === "conversation" ? conversationData : vocabularyData;

  // Text to Speech Function
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
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-100 tracking-wide">
            Chinese Practice
          </h1>
          <div className="flex gap-2 text-xs font-medium">
            <button
              onClick={() => {
                setActiveTab("conversation");
                setActiveItem(null); // Reset active item when switching tabs
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === "conversation"
                  ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              Conversation
            </button>
            <button
              onClick={() => {
                setActiveTab("vocabulary");
                setActiveItem(null); // Reset active item when switching tabs
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === "vocabulary"
                  ? "bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              Vocabulary
            </button>
          </div>
        </header>

        {/* List Container */}
        <div className="space-y-4 pb-32">
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() =>
                setActiveItem(activeItem === item.id ? null : item.id)
              }
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                activeItem === item.id
                  ? "bg-slate-800/80 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                  : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
              }`}
            >
              {/* Background decorative character */}
              <div className="absolute -right-4 -top-4 text-9xl font-serif text-slate-700/10 pointer-events-none select-none">
                {item.chinese.charAt(0)}
              </div>

              <div className="p-4 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-cyan-500/80 bg-cyan-950/30 px-2 py-1 rounded">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <h3 className="text-lg text-slate-100 font-medium font-burmese">
                      {item.burmese}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform ${
                      activeItem === item.id ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <div className="mt-1 pl-[3.2rem]">
                  <p className="text-xl font-bold text-cyan-400 tracking-wider">
                    {item.chinese}
                  </p>

                  {/* Expanded Content */}
                  <div
                    className={`grid transition-all duration-300 ease-out overflow-hidden ${
                      activeItem === item.id
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Pinyin</p>
                        <p className="text-lg text-white font-medium">
                          {item.pinyin}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handlePlayAudio(item.chinese, e)}
                          className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg transition-transform active:scale-95"
                        >
                          <Play className="w-5 h-5 ml-1" fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Bar */}
        {activeItem && (
          <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center z-50 pointer-events-none">
            <div className="bg-[#1e293b] border border-slate-600/50 text-white rounded-2xl shadow-2xl p-4 w-full max-w-md flex items-center justify-between pointer-events-auto backdrop-blur-lg">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-widest">
                  Now Playing
                </span>
                <span className="font-bold text-cyan-400 truncate max-w-[150px]">
                  {items.find((i) => i.id === activeItem)?.chinese}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    const item = items.find((i) => i.id === activeItem);
                    if (item) handlePlayAudio(item.chinese, e);
                  }}
                  className="p-3 rounded-full bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20 transition-colors"
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
