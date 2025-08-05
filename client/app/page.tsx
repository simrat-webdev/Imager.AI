"use client";
import React, { useState, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";

type GenerationState = "idle" | "generating" | "complete" | "error";

interface GenerationData {
  id: string;
  prompt: string;
  imageUrl?: string;
  progress: number;
  message: string;
  metadata?: {
    resolution?: string;
    generationTime?: number;
    model?: string;
  };
  errorMessage?: string;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generationState, setGenerationState] =
    useState<GenerationState>("idle");
  const [generationData, setGenerationData] = useState<GenerationData | null>(
    null
  );

  const handleConnectionEstablished = useCallback((data: any) => {
    console.log("Connected to server:", data.message);
  }, []);

  const handleGenerationStarted = useCallback((data: any) => {
    setGenerationState("generating");
    setGenerationData({
      id: data.generationId,
      prompt: data.prompt,
      progress: 0,
      message: "AI is thinking...",
    });
  }, []);

  const handleGenerationProgress = useCallback((data: any) => {
    setGenerationData((prev) =>
      prev
        ? {
            ...prev,
            progress: data.progress,
            message: data.message,
          }
        : null
    );
  }, []);

  const handleGenerationComplete = useCallback((data: any) => {
    setGenerationState("complete");
    setGenerationData((prev) =>
      prev
        ? {
            ...prev,
            progress: 100,
            message: "Generation complete!",
            imageUrl: `${data.imageUrl}?v=${Date.now()}`,
            // metadata: data.metadata,
          }
        : null
    );
  }, []);

  const handleGenerationError = useCallback((data: any) => {
    setGenerationState("error");
    setGenerationData((prev) =>
      prev
        ? {
            ...prev,
            errorMessage: data.message,
          }
        : null
    );
  }, []);

  const { isConnected, emit, connectionStatus } = useSocket(
    handleConnectionEstablished,
    handleGenerationStarted,
    handleGenerationProgress,
    handleGenerationComplete,
    handleGenerationError
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      alert("Please enter a description for your image.");
      return;
    }

    if (!isConnected) {
      alert("Not connected to server. Please wait for reconnection.");
      return;
    }

    // Send generation request via Socket.io
    emit("generate_image", { prompt: prompt.trim() });
  };

  const handleDownload = () => {
    if (generationData?.imageUrl) {
      const link = document.createElement("a");
      link.href = generationData.imageUrl;
      link.download = `ai-generated-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerateAnother = () => {
    setGenerationState("idle");
    setGenerationData(null);
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Header */}
      <header className="bg-white p-5 rounded-lg mb-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 m-0">
              AI Image Generator
            </h1>
            <p className="text-gray-600 mt-1 mb-0">
              Transform your ideas into stunning visuals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-400"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-400"
                  : connectionStatus === "error"
                  ? "bg-red-400"
                  : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {connectionStatus.charAt(0).toUpperCase() +
                connectionStatus.slice(1)}
            </span>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-3xl mx-auto">
        {/* Generation Form */}
        <div className="bg-white p-8 rounded-lg mb-5 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Create Your Image</h2>
          <p className="text-gray-600 mb-5">
            Describe what you want to see and watch AI bring it to life
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Image Prompt
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A majestic mountain landscape at sunset with golden clouds..."
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded resize-none text-sm font-sans focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  maxLength={500}
                  required
                  disabled={generationState === "generating"}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {prompt.length}/500
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={generationState === "generating" || !isConnected}
              className={`w-full px-6 py-3 rounded text-white font-semibold text-base transition-colors duration-200 ${
                generationState === "generating" || !isConnected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer"
              }`}
            >
              {generationState === "generating"
                ? "Generating..."
                : "Generate Image"}
            </button>
          </form>
        </div>
        {/* Image Display */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Loading State */}
          {generationState === "generating" && (
            <div className="p-10 text-center">
              <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center mb-5">
                <div>
                  <div className="text-5xl mb-3">🧠</div>
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {generationData?.message || "AI is thinking..."}
                  </p>
                  <p className="text-sm text-gray-500 m-0">
                    This usually takes 10-30 seconds
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full w-1/3 sliding-bar"></div>

                <style jsx>{`
                  .sliding-bar {
                    animation: slide 2s ease-in-out infinite;
                  }
                  @keyframes slide {
                    0% {
                      transform: translateX(-100%);
                    }
                    50% {
                      transform: translateX(300%);
                    }
                    100% {
                      transform: translateX(-100%);
                    }
                  }
                `}</style>
              </div>
            </div>
          )}
          {/* Generated Image Display */}
          {generationState === "complete" && generationData?.imageUrl && (
            <div className="p-8">
              <h3 className="text-lg font-semibold mb-2">Generated Image</h3>
              <p className="text-gray-600 mb-5">{generationData.prompt}</p>
              <div className="relative mb-5 group">
                <img
                  src={generationData.imageUrl}
                  alt="Generated AI image"
                  className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-sm">Generated</span>
                    <p className="mt-1 font-medium">Just now</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Resolution</span>
                    <p className="mt-1 font-medium">
                      {generationData.metadata?.resolution || "1024x1024"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-200"
                >
                  Download
                </button>
                <button
                  onClick={handleGenerateAnother}
                  className="bg-gray-500 hover:bg-gray-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-200"
                >
                  Generate Another
                </button>
              </div>
            </div>
          )}
          {/* Error State */}
          {generationState === "error" && (
            <div className="p-10 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Generation Failed</h3>
              <p className="text-gray-600 mb-5">
                {generationData?.errorMessage ||
                  "Something went wrong while generating your image. Please try again."}
              </p>
              <button
                onClick={handleGenerateAnother}
                className="bg-blue-500 hover:bg-blue-600 text-white border-none px-4 py-2 rounded cursor-pointer transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}
          {/* Initial/Idle State */}
          {generationState === "idle" && (
            <div className="p-10 text-center">
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
              <p className="text-gray-600">
                Enter a prompt above and click generate to create your AI image
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
