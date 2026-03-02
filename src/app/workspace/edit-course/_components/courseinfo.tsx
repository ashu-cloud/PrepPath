"use client"
import { BookOpen, Clock, Loader2, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';


function CourseInfo({ courseData, isFullyGenerated, onGenerationComplete }: any) {
    // Parsing the JSON string from the database if necessary
    const [loading, setLoading] = React.useState(false);
    const [currentGenerating, setCurrentGenerating] = useState<number | null>(null);

    const courseLayout = typeof courseData?.courseJson === 'string'
        ? JSON.parse(courseData.courseJson).course
        : courseData?.courseJson?.course;

    const onGenerateContent = async () => {
        setLoading(true);
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        const chapters = courseLayout.chapters;
        const maxRetries = 3;
        
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            let retries = 0;
            
            while (retries <= maxRetries) {
                try {
                    setCurrentGenerating(i + 1);
                    console.log(`Baking Chapter ${i + 1} (Attempt ${retries + 1})...`);
                    
                    const response = await fetch('/api/generate-course-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        courseName: courseLayout?.name || courseData?.name || "Technology",
                        chapterName: chapter.chapterName,
                        topic: chapter.topics[0], 
                        courseId: courseData.cid,
                        index: i
                    })
                });

                    if (response.status === 429) {
                        retries++;
                        if (retries > maxRetries) {
                            console.error(`Chapter ${i + 1} rate-limited ${maxRetries} times, skipping.`);
                            break; // Move to next chapter
                        }
                        const waitMs = 30000 + (retries * 5000); // Increase wait time per retry
                        console.warn(`Rate limit hit! Waiting ${waitMs / 1000}s before retry ${retries}...`);
                        await sleep(waitMs);
                        continue; // Retry this chapter
                    }

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    console.log(`✅ Chapter ${i + 1} complete.`);
                    await sleep(2000); // Brief cooldown before next chapter
                    break; // Success - move to next chapter
                    
                } catch (err) {
                    console.error(`Chapter ${i + 1} error:`, err);
                    break; // Move to next chapter on non-rate-limit errors
                }
            }
        }
        if (onGenerationComplete) onGenerationComplete();
        setCurrentGenerating(null);
        setLoading(false);
    }

    return (
        <div className="bg-[#0f0f12] rounded-2xl border border-white/[0.05] overflow-hidden shadow-2xl">
            {/* 1. Hero Image Section */}
            <div className="relative h-72 w-full">
                <Image
                    src={courseData?.bannerImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"}
                    alt="Course Banner"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent" />

                <div className="absolute bottom-6 left-8 right-8">
                    <span className="bg-violet-600/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-violet-600/30">
                        {courseData?.category || "Technology"}
                    </span>
                    <h1 className="text-4xl font-extrabold text-white mt-3 tracking-tight">
                        {courseLayout?.name || courseData?.name}
                    </h1>
                </div>
            </div>

            {/* 2. Course Meta & Action Section */}
            <div className="p-8">
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                    {courseLayout?.description || courseData?.description}
                </p>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                        {/* Duration Card */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Duration</h2>
                                <span className="text-white text-sm font-semibold">2 Hours</span>
                            </div>
                        </div>

                        {/* Modules Card */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Chapters</h2>
                                <span className="text-white text-sm font-semibold">{courseLayout?.noOfChapters || courseData?.numberOfModules}</span>
                            </div>
                        </div>

                        {/* Difficulty Card */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Level</h2>
                                <span className="text-white text-sm font-semibold capitalize">{courseData?.difficultyLevel || "Beginner"}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- ACTION BUTTON --- */}
                    {/* --- ACTION BUTTON --- */}
                    <div className="lg:w-1/4">
                        {isFullyGenerated ? (
                             <TooltipProvider>
                                 <Tooltip>
                                     <TooltipTrigger asChild>
                                         <div className="cursor-not-allowed w-full">
                                             <Button
                                                 disabled
                                                 className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-violet-600/20 px-6 py-6 text-sm font-bold text-violet-400 pointer-events-none border border-violet-500/20"
                                             >
                                                 <CheckCircle2 className="h-5 w-5" />
                                                 Content Generated
                                             </Button>
                                         </div>
                                     </TooltipTrigger>
                                     <TooltipContent side="top" className="bg-[#0f0f12] text-white border border-white/10 shadow-2xl mb-2">
                                         <p>The course is already generated</p>
                                     </TooltipContent>
                                 </Tooltip>
                             </TooltipProvider>
                        ) : (
                            <Button
                                disabled={loading}
                                onClick={onGenerateContent}
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-violet-600 px-6 py-6 text-sm font-bold text-white transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] active:scale-95"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        Generating Chapter {currentGenerating}...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
                                        Generate Content
                                    </>
                                )}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseInfo