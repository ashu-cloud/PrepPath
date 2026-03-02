"use client"
import React, { useState } from 'react'
import { Code2, Sparkles, Copy, Check, RotateCcw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function CodeRefactorPage() {
    const [inputCode, setInputCode] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRefactor = async () => {
        if (!inputCode) return;
        setLoading(true);
        try {
            const res = await axios.post('/api/ai-tools/refactor', {
                code: inputCode,
                language: "auto-detect"
            });
            setResult(res.data.result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                    <Code2 className="h-8 w-8 text-emerald-400" /> Smart Refactor
                </h1>
                <p className="text-gray-400 mt-2">Optimize your logic and clean up your code instantly.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* --- INPUT SIDE --- */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <Textarea 
                            placeholder="Paste your code here..."
                            className="min-h-[500px] bg-[#0d0d10] border-white/5 font-mono text-sm p-6 focus:ring-emerald-500/20"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                        />
                        <Button 
                            onClick={handleRefactor}
                            disabled={loading || !inputCode}
                            className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            Refactor Code
                        </Button>
                    </div>
                </div>

                {/* --- OUTPUT SIDE --- */}
                <div className="bg-[#0d0d10] border border-white/5 rounded-xl p-6 min-h-[500px] relative overflow-y-auto max-h-[70vh]">
                    {result ? (
                        <div className="prose prose-invert max-w-none">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={copyToClipboard}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <ReactMarkdown>{result}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                            <RotateCcw className="h-12 w-12 mb-4" />
                            <p>Refactored output will appear here...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}