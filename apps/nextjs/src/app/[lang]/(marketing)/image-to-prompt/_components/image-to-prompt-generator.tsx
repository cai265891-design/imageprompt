"use client";

import { useState, useRef } from "react";
import "./styles.css";
import { Button } from "@saasfly/ui/button";
import { Loader2, Copy, Check } from "lucide-react";
import Image from "next/image";
import { cozeAPI } from "../../../../../lib/coze-api";
import { cozeConfig } from "../../../../../config/coze";

interface UploadedImage {
  file: File;
  preview: string;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
}

const aiModels: AIModel[] = [
  {
    id: "general",
    name: "Image Prompt",
    description: "Natural language description of the image",
  },
  {
    id: "flux",
    name: "Flux",
    description:
      "Optimized for state-of-the-art Flux AI models, concise natural language",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description:
      "Tailored for Midjourney generation with Midjourney parameters",
  },
  {
    id: "stable-diffusion",
    name: "Stable Diffusion",
    description: "Formatted for Stable Diffusion models",
  },
];

export function ImageToPromptGenerator() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null,
  );
  const [selectedModel, setSelectedModel] = useState("general");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      alert("文件大小不能超过4MB");
      return;
    }

    if (
      !["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
        file.type,
      )
    ) {
      alert("请上传PNG、JPG或WEBP格式的图片");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage({
        file,
        preview: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const generatePrompt = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setGeneratedPrompt("");

    try {
      // Map the selected model to the Coze workflow parameter
      const cozeModel = cozeConfig.modelMapping[selectedModel] || "normal";

      // Call Coze API to generate prompt (without language parameter)
      const prompt = await cozeAPI.generateImagePrompt(
        uploadedImage.file,
        cozeModel,
      );

      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error("Failed to generate prompt:", error);

      let errorMessage = "生成提示词失败，请重试。";
      if (error instanceof Error) {
        if (error.message.includes("工作流未找到")) {
          errorMessage = error.message;
        } else if (error.message.includes("机器人未找到")) {
          errorMessage = error.message;
        } else {
          errorMessage = "错误: " + error.message;
        }
      }

      alert(errorMessage);
      setGeneratedPrompt("");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedPrompt) {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Upload SVG Icon
  const UploadIcon = () => (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mx-auto mb-2"
    >
      <path
        d="M4 7a2 2 0 012-2h8l4 4v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"
        stroke="#c7d2fe"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11l2 2 4-4"
        stroke="#c7d2fe"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Preview Placeholder Icon
  const PreviewIcon = () => (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mx-auto mb-2"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      <path
        d="M8 10l2 2 3-3 5 5"
        stroke="#cbd5e1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="image-prompt-container mx-auto max-w-[1100px] p-7">
      {/* H1 Title */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Image to Prompt
      </h1>

      {/* Upload + Preview row */}
      <div className="upload-row mb-7">
        {/* Left: Upload box */}
        <div
          className={`upload-box ${dragActive ? "drag-active" : ""}`}
          aria-label="Upload area"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploadedImage && fileInputRef.current?.click()}
          style={{ cursor: !uploadedImage ? 'pointer' : 'default' }}
        >
          {uploadedImage ? (
            <div className="space-y-4 w-full">
              <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-lg">
                <Image
                  src={uploadedImage.preview}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                {uploadedImage.file.name}
              </p>
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  更换图片
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <UploadIcon />
              <p
                style={{
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                Upload a photo or drag and drop
              </p>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                PNG, JPG, or WEBP up to 4MB
              </p>
              <div className="upload-meta">点击或拖拽上传</div>
            </div>
          )}
        </div>

        {/* Right: Image preview */}
        <div className="image-preview" aria-label="Image preview">
          {uploadedImage ? (
            <div className="relative w-full h-full min-h-[180px]">
              <Image
                src={uploadedImage.preview}
                alt="Image preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="placeholder text-center">
              <PreviewIcon />
              <div
                style={{ marginTop: "8px", fontSize: "14px", color: "#94a3b8" }}
              >
                Your image will show here
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Select AI Model title */}
      <div className="section-title">Select AI Model</div>

      {/* Model cards */}
      <div className="models mb-5" role="list">
        {aiModels.map((model) => (
          <div
            key={model.id}
            className={`model-card ${selectedModel === model.id ? "selected" : ""}`}
            role="listitem"
            aria-pressed={selectedModel === model.id}
            onClick={() => setSelectedModel(model.id)}
            style={{ position: "relative" }}
          >
            {selectedModel === model.id && <div className="check">✓</div>}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3>{model.name}</h3>
            </div>
            <p>{model.description}</p>
          </div>
        ))}
      </div>

      <div className="generate-row mb-5">
        <button
          className={`btn-generate ${!uploadedImage ? "disabled" : "primary"}`}
          aria-disabled={!uploadedImage}
          onClick={generatePrompt}
          disabled={!uploadedImage || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Prompt"
          )}
        </button>
      </div>

      {/* Generated prompt area */}
      <div className="prompt-container">
        <div className="prompt-header">
          <span className="prompt-title">Generated Prompt</span>
          {generatedPrompt && (
            <button
              onClick={copyToClipboard}
              className="copy-button"
              aria-label="Copy prompt to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="copy-text">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span className="copy-text">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
        <div
          className="prompt-area"
          role="region"
          aria-label="Generated prompt"
        >
          {generatedPrompt ? (
            <div className="prompt-content">{generatedPrompt}</div>
          ) : (
            <div className="prompt-placeholder">
              Generated prompt will appear here
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
