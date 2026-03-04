"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation' // 🛑 MUST use next/navigation in App Router
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sparkles, Loader2 } from 'lucide-react' // Added Loader2 for the spinner
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'; 

function AddNewCourseDialogue({ children }: { children: React.ReactNode }) {
  const router = useRouter() // Initialize the router
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  

  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    numberOfModules: 1,
    difficultyLevel: "",
    category: "",
    includeLectures: false
  })

  const onHandleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const OnGenerateCourse = async () => {
    // 1. Basic Validation
    if (!formData.courseName || !formData.category || !formData.difficultyLevel) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }
    if (formData.numberOfModules < 1 || formData.numberOfModules > 10) {
      setErrorMessage("Please select between 1 and 10 modules.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear any previous errors

    try {
      // 2. Use fetch to ensure Clerk auth cookies are sent securely
      const response = await fetch("/api/generate-course-layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 3. Catch custom errors (like 409 Duplicate or 401 Unauthorized)
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate course.");
      }

      console.log("API Response:", data);

      // 4. Route to the new page using the UUID (`cid`) returned by
      // the backend.  The earlier bug you saw (404/`courseId=6`) happened
      // because we were mistakenly navigating with the numeric PK.
      const newCourseId = data.cid;
      
      // Navigate to the edit page
      router.push(`/workspace/edit-course/${newCourseId}`);

    } catch (error: any) {
      console.error("Error generating course:", error);
      // Display the error beautifully in the UI instead of crashing
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      // 5. finally{} ensures the loading state stops spinning no matter what happens!
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px] border border-white/[0.07] bg-[#13131a] p-8 text-white shadow-2xl overflow-hidden">
          
          <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-64 rounded-full bg-violet-600/[0.12] blur-[60px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          <DialogHeader className="relative z-10">
            <DialogTitle className="font-display text-[1.5rem] font-extrabold leading-tight tracking-tight text-white">
              Create a New <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">Course</span>
            </DialogTitle>
            <DialogDescription className="text-[0.88rem] font-light leading-relaxed text-white/35">
              Fill in the details below to generate your custom learning path.
            </DialogDescription>
          </DialogHeader>

          <div className="relative z-10 flex flex-col gap-5 py-4">
            <div>
              <label className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
                 Course Name *
              </label>
              <Input
                type="text"
                placeholder="e.g. Advanced React Patterns"
                className="w-full border-white/[0.07] bg-white/[0.02] text-white placeholder:text-white/20 focus-visible:ring-violet-500"
                onChange={(e) => onHandleInputChange("courseName", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
                Course Description
              </label>
              <Textarea
                placeholder="What will you learn in this course?"
                className="w-full border-white/[0.07] bg-white/[0.02] text-white placeholder:text-white/20 focus-visible:ring-violet-500"
                onChange={(e) => onHandleInputChange("courseDescription", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
                  Modules
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="max-10"
                  className="w-full border-white/[0.07] bg-white/[0.02] text-white placeholder:text-white/20 focus-visible:ring-violet-500"
                  onChange={(e) => onHandleInputChange("numberOfModules", Number(e.target.value))}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
                  Difficulty *
                </label>
                <Select onValueChange={(value) => onHandleInputChange("difficultyLevel", value)}>
                  <SelectTrigger className="w-full border-white/[0.07] bg-white/[0.02] text-white focus:ring-violet-500">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="border-white/[0.07] bg-[#13131a] text-white">
                    <SelectItem value="beginner" className="hover:bg-white/[0.04] focus:bg-white/[0.04] focus:text-white">Beginner</SelectItem>
                    <SelectItem value="intermediate" className="hover:bg-white/[0.04] focus:bg-white/[0.04] focus:text-white">Intermediate</SelectItem>
                    <SelectItem value="advanced" className="hover:bg-white/[0.04] focus:bg-white/[0.04] focus:text-white">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-violet-400">
                Category *
              </label>
              <Input
                type="text"
                placeholder="e.g. Web Development, Data Science"
                className="w-full border-white/[0.07] bg-white/[0.02] text-white placeholder:text-white/20 focus-visible:ring-violet-500"
                onChange={(e) => onHandleInputChange("category", e.target.value)}
              />
            </div>

            <div className="mt-2 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.01] p-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[0.75rem] uppercase tracking-[0.1em] text-white">
                  Include Lectures
                </label>
                <span className="text-[0.75rem] text-white/35">Generate video/audio content</span>
              </div>
              <Switch
                checked={formData.includeLectures}
                onCheckedChange={(checked) => onHandleInputChange("includeLectures", checked)}
                className="data-[state=checked]:bg-violet-600"
              />
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <p className="text-[0.85rem] font-medium text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {errorMessage}
              </p>
            )}

            {/* Updated Button with Loading State */}
            <Button
              onClick={OnGenerateCourse}
              disabled={loading}
              className="mt-2 group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-6 text-[0.95rem] font-semibold text-white transition-all hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(139,92,246,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Architecting Course...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Course
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewCourseDialogue