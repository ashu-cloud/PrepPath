"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, BookOpen, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import hljs from 'highlight.js';

export default function StudyPage() {
    // Bulletproof courseId extraction
    const params = useParams();
    const courseId = params?.courseId || params?.id || params?.courseid;
    
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Data Fetching Logic (Single Source of Truth)
    useEffect(() => {
        if (!courseId) {
            setLoading(false);
            setError("No valid course ID found in the URL.");
            return;
        }

        const fetchStudyData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [courseRes, lessonRes] = await Promise.all([
                    axios.get(`/api/courses?courseId=${courseId}`),
                    axios.get(`/api/get-lessons?courseId=${courseId}`)
                ]);
                
                setCourse(courseRes.data);
                setLessons(lessonRes.data);
            } catch (err: any) {
                console.error("Error fetching study data:", err);
                setError(err.response?.data?.error || "Failed to load course data. Check your database connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudyData();
    }, [courseId]);

    // 2. UI Side Effects (Scroll & Syntax Highlighting)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activeIdx]);

    useEffect(() => {
        hljs.highlightAll();
    }, [activeIdx, lessons]);

    // 3. Mark Chapter as Completed
    const markChapterCompleted = async () => {
        const currentContent = lessons.find(l => l.chapterId === activeIdx);
        if (!currentContent) return;
        
        try {
            await axios.post('/api/mark-chapter-completed', {
                courseId: courseId,
                chapterId: activeIdx
            });

            setLessons(prev => prev.map(lesson => 
                lesson.chapterId === activeIdx 
                    ? { ...lesson, isCompleted: true } 
                    : lesson
            ));

            const courseLayout = typeof course?.courseJson === 'string' 
                ? JSON.parse(course.courseJson).course 
                : course?.courseJson?.course;
            const chapters = courseLayout?.chapters || [];

            if (activeIdx < chapters.length - 1) {
                setActiveIdx(activeIdx + 1);
            }
        } catch (error) {
            console.error("Failed to mark completed:", error);
        }
    };

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

    if (error) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-[#070708] gap-4 text-white p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-2">
                    <span className="text-2xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-red-400">Something went wrong</h2>
                <p className="text-gray-400 max-w-md">{error}</p>
                <Button 
                    onClick={() => router.push('/workspace/dashboard')}
                    className="mt-4 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                >
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const courseLayout = typeof course?.courseJson === 'string' 
        ? JSON.parse(course.courseJson).course 
        : course?.courseJson?.course;

    const chapters = courseLayout?.chapters || [];
    const currentContent = lessons.find(l => l.chapterId === activeIdx);

    return (
        <div className="flex h-screen w-full bg-[#070708] text-white overflow-hidden">
            {/* SIDEBAR NAVIGATION */}
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

                <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                    {chapters.map((chapter: any, index: number) => {
                        const lessonData = lessons.find(l => l.chapterId === index);
                        const isGenerated = !!lessonData;
                        const isCompleted = lessonData?.isCompleted;
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
                                    isCompleted 
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                                    : isActive 
                                    ? "border-violet-500 bg-violet-500 text-white" 
                                    : isGenerated
                                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                        : "border-white/10 text-white/40"
                                }`}>
                                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                                </div>
                                <div>
                                    <span className={`text-sm block font-medium ${isActive ? "text-violet-300" : "text-gray-300"}`}>
                                        {chapter.chapterName}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* MAIN CONTENT VIEWER */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto relative scroll-smooth no-scrollbar">
                <div className="mx-auto max-w-4xl p-6 md:p-12 lg:py-16">
                    {currentContent ? (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {/* YOUTUBE VIDEO */}
                            {currentContent.videoId && (
                                <div className="mb-12 w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-black">
                                    <div className="relative w-full aspect-video">
                                        <iframe 
                                            src={`https://www.youtube.com/embed/${currentContent.videoId}?rel=0`} 
                                            title="YouTube video player" 
                                            allowFullScreen
                                            className="absolute top-0 left-0 w-full h-full"
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {/* HTML CONTENT */}
                            <div className="bg-[#0f0f12] border border-white/5 rounded-3xl p-8 md:p-12 shadow-xl pb-12">
                                <article 
                                    className="prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: currentContent.content }} 
                                />

                                <div className="mt-12 flex justify-end border-t border-white/10 pt-8">
                                    {currentContent.isCompleted ? (
                                        <Button disabled className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold gap-2">
                                            <CheckCircle2 className="h-4 w-4" /> Completed
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={markChapterCompleted}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 px-6 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:scale-105"
                                        >
                                            <CheckCircle2 className="h-4 w-4" /> Mark as Completed
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
                            <BookOpen className="h-10 w-10 text-gray-600 mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-3">Chapter Not Found</h2>
                            <p className="text-gray-500 max-w-sm">Please return to the editor to generate content for this chapter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}