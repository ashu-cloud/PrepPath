"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, BookOpen, ChevronLeft, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import hljs from 'highlight.js';

export default function StudyPage() {
    const { courseId } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeIdx]);

    useEffect(() => {
        hljs.highlightAll();
    }, [activeIdx, lessons]);

    useEffect(() => {
        if (!courseId) return;

        const fetchStudyData = async () => {
            setLoading(true);
            try {
                // Fetch both the course structure and the generated lesson content simultaneously
                const [courseRes, lessonRes] = await Promise.all([
                    axios.get(`/api/courses?courseId=${courseId}`),
                    axios.get(`/api/get-lessons?courseId=${courseId}`)
                ]);
                
                setCourse(courseRes.data);
                setLessons(lessonRes.data);
            } catch (error) {
                console.error("Error fetching study data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudyData();
    }, [courseId]);

    // Show a sleek loading screen while fetching
    if (loading) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-[#070708] gap-4 text-white">
                <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
                <p className="animate-pulse font-mono text-sm tracking-widest text-gray-500 uppercase">
                    Loading Course Environment...
                </p>
            </div>
        );
    }

    // Safely parse the AI-generated course JSON structure
    const courseLayout = typeof course?.courseJson === 'string' 
        ? JSON.parse(course.courseJson).course 
        : course?.courseJson?.course;

    const chapters = courseLayout?.chapters || [];
    
    // Find the generated content (HTML + Video) for the currently selected chapter
    const currentContent = lessons.find(l => l.chapterId === activeIdx);

    return (
        <div className="flex h-screen w-full bg-[#070708] text-white overflow-hidden">
            
            {/* --- SIDEBAR NAVIGATION --- */}
            <div className="hidden md:flex w-80 flex-col border-r border-white/5 bg-[#0f0f12]">
                <div className="p-6 border-b border-white/5">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.push(`/workspace/edit-course/${courseId}`)}
                        className="mb-6 flex w-fit items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 -ml-4"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Editor
                    </Button>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">
                        Course Curriculum
                    </h2>
                    <h1 className="text-lg font-bold leading-tight line-clamp-2">
                        {courseLayout?.name || course?.name}
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chapters.map((chapter: any, index: number) => {
                        const isGenerated = lessons.some(l => l.chapterId === index);
                        const isActive = activeIdx === index;

                        return (
                            <button
                                key={index}
                                onClick={() => setActiveIdx(index)}
                                className={`w-full group flex items-start gap-3 rounded-xl p-3 text-left transition-all ${
                                    isActive 
                                    ? "bg-violet-600/10 border border-violet-500/30" 
                                    : "bg-transparent hover:bg-white/[0.02] border border-transparent"
                                }`}
                            >
                                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                                    isActive 
                                    ? "border-violet-500 bg-violet-500 text-white" 
                                    : isGenerated
                                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                        : "border-white/10 text-white/40"
                                }`}>
                                    {isGenerated && !isActive ? <CheckCircle2 className="h-3 w-3" /> : index + 1}
                                </div>
                                <div>
                                    <span className={`text-sm block font-medium ${isActive ? "text-violet-300" : "text-gray-300"}`}>
                                        {chapter.chapterName}
                                    </span>
                                    {!isGenerated && (
                                        <span className="text-[10px] text-gray-600 uppercase tracking-wider mt-1 block">
                                            Not Generated
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- MAIN CONTENT VIEWER --- */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto relative scroll-smooth">
                <div className="mx-auto max-w-4xl p-6 md:p-12 lg:py-16">
                    
                    {/* Header for Mobile (Shows when sidebar is hidden) */}
                    <div className="md:hidden mb-8">
                         <Button 
                            variant="ghost" 
                            onClick={() => router.push(`/workspace/edit-course/${courseId}`)}
                            className="mb-4 flex items-center gap-2 text-gray-400"
                        >
                            <ChevronLeft className="h-4 w-4" /> Back
                        </Button>
                        <h2 className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">Chapter {activeIdx + 1}</h2>
                        <h1 className="text-2xl font-bold">{chapters[activeIdx]?.chapterName}</h1>
                    </div>

                    {currentContent ? (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            
                            {/* --- YOUTUBE VIDEO PLAYER --- */}
                            {currentContent.videoId && (
                                <div className="mb-12 w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-black">
                                    <div className="relative w-full aspect-video">
                                        <iframe 
                                            src={`https://www.youtube.com/embed/${currentContent.videoId}?rel=0`} 
                                            title="YouTube video player" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                            allowFullScreen
                                            className="absolute top-0 left-0 w-full h-full"
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {/* --- AI GENERATED HTML CONTENT --- */}
                            <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-8 md:p-12 shadow-xl">
                               <article 
                                    className="prose prose-invert max-w-none
                                    
                                    /* --- HEADINGS --- */
                                    prose-headings:font-sans prose-headings:tracking-tight
                                    prose-h1:text-4xl prose-h1:font-extrabold prose-h1:bg-gradient-to-r prose-h1:from-violet-400 prose-h1:via-fuchsia-400 prose-h1:to-cyan-400 prose-h1:bg-clip-text prose-h1:text-transparent prose-h1:mb-10
                                    prose-h2:text-2xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-12 prose-h2:pb-3 prose-h2:border-b prose-h2:border-white/10
                                    prose-h3:text-xl prose-h3:font-semibold prose-h3:text-violet-300 prose-h3:tracking-wide
                                    
                                    /* --- PARAGRAPHS & LISTS --- */
                                    prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-[1.05rem]
                                    prose-a:text-violet-400 prose-a:decoration-violet-400/30 hover:prose-a:decoration-violet-400 prose-a:underline-offset-4
                                    prose-strong:text-white prose-strong:font-semibold
                                    prose-ul:text-gray-300 prose-ul:list-disc prose-ul:pl-6
                                    prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:pl-6
                                    prose-li:marker:text-violet-500
                                    
                                    /* --- CALLOUT BOXES (Blockquotes) --- */
                                    prose-blockquote:border-l-4 prose-blockquote:border-violet-500 prose-blockquote:bg-violet-500/10 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-violet-200 prose-blockquote:shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]
                                    
                                    /* --- CODE BLOCKS (Already setup, just adding shadow) --- */
                                    prose-pre:p-0 prose-pre:bg-[#0d0d10] prose-pre:m-0 prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10 prose-pre:overflow-hidden prose-pre:shadow-2xl
                                    prose-code:font-mono prose-code:text-[0.9rem]"

                                    dangerouslySetInnerHTML={{ __html: currentContent.content }} 
                                />
                            </div>
                        </div>
                    ) : (
                        
                        // --- EMPTY STATE (Content Not Generated Yet) ---
                        <div className="flex h-[60vh] flex-col items-center justify-center text-center animate-in fade-in duration-500">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/[0.02] border border-white/[0.05] mb-6 shadow-2xl">
                                <BookOpen className="h-10 w-10 text-gray-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Chapter not baked yet</h2>
                            <p className="text-gray-500 max-w-sm mb-8">
                                The content for <span className="text-gray-300 font-semibold">"{chapters[activeIdx]?.chapterName}"</span> hasn't been generated. 
                            </p>
                            <Button 
                                onClick={() => router.push(`/workspace/edit-course/${courseId}`)}
                                className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Return to Editor to Generate
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}