"use client"

import React, { useEffect, useState } from 'react'
import { Search, Sparkles, BookOpen, ChevronRight, Globe, Filter } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import { Input } from '@/components/ui/input'

interface Course {
  cid: string
  name: string
  description?: string
  numberOfModules?: number
  difficultyLevel?: string
  category?: string
}

export default function ExplorePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/all-courses');
      
      // Ensure we received an array
      if (Array.isArray(res.data)) {
        setCourses(res.data);
      } else {
        console.error("API did not return an array:", res.data);
        setCourses([]);
      }
    } catch (error) {
      console.error("Failed to fetch explore courses:", error);
      setCourses([]); // Set to empty array to prevent .map() crash
    } finally {
      setLoading(false);
    }
  };
  fetchAllCourses();
}, []);

  // Filter logic for search
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-violet-400 mb-4">
          <Globe className="h-3 w-3" /> Community Library
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Explore New <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Horizons</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover thousands of AI-generated courses created by learners worldwide. Pick a topic and start your journey instantly.
        </p>
      </div>

      {/* --- SEARCH & FILTERS --- */}
      <div className="mb-10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-violet-400 transition-colors" />
              <Input 
                placeholder="Search courses (e.g. Next.js, System Design, Physics)..."
                className="pl-12 bg-[#13131a] border-white/5 h-12 rounded-xl focus:border-violet-500/50 focus:ring-violet-500/20"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
          
      </div>

      {/* --- COURSE GRID --- */}
      {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
              ))}
          </div>
      ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-white font-bold text-lg">No matches found</h3>
              <p className="text-gray-500">Try a different keyword or generate this course yourself!</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link
              key={course.cid}
              href={`/workspace/edit-course/${course.cid}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#13131a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-[0_20px_60px_rgba(139,92,246,0.1)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-lg bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                  {course.category || 'General'}
                </span>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">
                  {course.difficultyLevel}
                </span>
              </div>

              <h3 className="mb-2 font-display text-[1rem] font-bold leading-tight text-white line-clamp-2">
                {course.name}
              </h3>

              <p className="mb-6 line-clamp-3 text-[0.8rem] leading-relaxed text-gray-500">
                {course.description || "An AI-powered roadmap to mastering this topic."}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-1.5 text-[0.7rem] font-medium text-gray-400">
                  <BookOpen className="h-3.5 w-3.5 text-violet-500" />
                  {course.numberOfModules} Chapters
                </div>
                <div className="flex items-center gap-1 text-[0.75rem] font-bold text-violet-400 group-hover:translate-x-1 transition-transform">
                  View Roadmap <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}