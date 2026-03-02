"use client"
import React from 'react'
import { BookOpenCheck, CheckCircle2, Gift, PlayCircle } from 'lucide-react';

function ChapterTopicList({courseData}: {courseData: any}) {

    let courseLayout;
    try {
        let jsonString = courseData?.courseJson;
        if (typeof jsonString === 'string') {
            // Strip out markdown formatting if present
            jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
            courseLayout = JSON.parse(jsonString)?.course;
        } else {
            courseLayout = courseData?.courseJson?.course;
        }
    } catch (e) {
        console.error("Failed to parse course JSON:", e);
        courseLayout = null;
    }

    const chapters = courseLayout?.chapters || [];
  return (
    <div className="mt-16 flex flex-col items-center">
      {/* Section Title */}
      <div className="mb-12 text-center">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-violet-400">
            Curriculum
        </h2>
        <h3 className="mt-2 text-3xl font-extrabold text-white">Your Learning Path</h3>
      </div>

      <div className="relative w-full max-w-3xl px-4">
        {/* The "Glowy Path" connecting chapters */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-violet-500/50 via-violet-500/10 to-transparent" />

        <div className="flex flex-col gap-16">
          {chapters.map((chapter: any, index: number) => (
            <div key={index} className="relative flex flex-col items-center">
              
              {/* 1. Chapter Card */}
              <div className="group relative z-10 w-full rounded-2xl border border-white/[0.05] bg-[#0f0f12] p-6 shadow-2xl transition-all hover:border-violet-500/30 hover:bg-[#13131a]">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-400 border border-violet-500/20 mb-4">
                    {index + 1}
                  </div>
                  
                  <h2 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                    {chapter.chapterName}
                  </h2>
                  
                  <div className="mt-3 flex gap-4 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <PlayCircle className="h-3.5 w-3.5" /> {chapter.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <BookOpenCheck className="h-3.5 w-3.5" /> {chapter.topics?.length} Topics
                    </span>
                  </div>
                </div>

                {/* 2. Nested Topics List (Vertical Timeline style) */}
                <div className="mt-8 space-y-4">
                  {chapter.topics?.map((topic: string, i: number) => (
                    <div key={i} className="flex flex-col items-center">
                        {/* Connecting line between topics */}
                        <div className="h-6 w-[1px] bg-white/[0.05]" />
                        
                        <div className="flex items-center gap-3 w-full rounded-lg bg-white/[0.02] border border-white/[0.03] p-3 hover:bg-white/[0.04] transition-colors">
                            <CheckCircle2 className="h-4 w-4 text-violet-500/40" />
                            <span className="text-sm text-gray-400">{topic}</span>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Optional: Gift/Milestone icon at the end of large chapters */}
              {index === chapters.length - 1 && (
                <div className="mt-16 flex flex-col items-center">
                    <div className="h-12 w-[2px] bg-gradient-to-b from-violet-500/20 to-transparent" />
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <Gift className="h-6 w-6" />
                    </div>
                    <span className="mt-3 font-bold text-emerald-400 uppercase tracking-widest text-[10px]">Course Finished</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChapterTopicList
