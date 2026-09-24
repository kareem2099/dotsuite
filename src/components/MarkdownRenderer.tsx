"use client";

import React, { useState, useEffect, useMemo, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-docker";

import {
  Check,
  Copy,
  ExternalLink,
  Info,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  AlertCircle,
  Clock,
  Code2,
  FileText,
  Eye,
} from "lucide-react";

function GitHubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}


interface MarkdownRendererProps {
  content: string;
  githubRepo?: string;
  branch?: string;
  className?: string;
  showToolbar?: boolean;
  docTitle?: string;
}

// Helper to resolve relative GitHub URLs and proxy external images for reliable loading
function resolveGitHubUrl(
  url: string,
  repo: string | undefined,
  branch: string = "main",
  isImage: boolean
): string {
  if (!url) return url;
  if (
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.startsWith("#") ||
    url.startsWith("mailto:")
  ) {
    return url;
  }

  // Clean leading "./" or "/"
  const cleanPath = url.replace(/^\.?\//, "");

  if (isImage) {
    // If absolute HTTP/HTTPS URL
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const shouldProxy =
        url.includes("raw.githubusercontent.com") ||
        url.includes("user-images.githubusercontent.com") ||
        url.includes("camo.githubusercontent.com") ||
        url.includes("avatars.githubusercontent.com") ||
        url.includes("shields.io") ||
        url.includes("buymeacoffee.com") ||
        url.includes("badgen.net");

      if (shouldProxy) {
        return `/api/proxy-image?url=${encodeURIComponent(url)}`;
      }
      return url;
    }

    // Relative image in GitHub repo
    if (repo) {
      return `/api/proxy-image?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(cleanPath)}&branch=${encodeURIComponent(branch)}`;
    }
    return url;
  }

  // If not image (link / href)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (repo) {
    return `https://github.com/${repo}/blob/${branch}/${cleanPath}`;
  }
  return url;
}

// Code Block with Syntax Highlighting & One-Click Copy
function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children || "").replace(/\n$/, "");

  // Extract language from className (e.g. "language-typescript")
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1].toLowerCase() : "";

  // Highlight syntax using Prism
  const highlightedCode = useMemo(() => {
    if (!language) return null;
    try {
      const grammar = Prism.languages[language];
      if (grammar) {
        return Prism.highlight(codeString, grammar, language);
      }
    } catch {
      // fallback to plain text if highlighting fails
    }
    return null;
  }, [codeString, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // If this is an inline code snippet without language inside a paragraph/list
  const isInline = !className && !codeString.includes("\n");
  if (isInline) {
    return (
      <code className="px-1.5 py-0.5 text-xs sm:text-sm font-mono rounded-md bg-(--card-bg) border border-(--card-border) text-(--primary) font-medium">
        {children}
      </code>
    );
  }

  const displayLang = language ? language.toUpperCase() : "CODE";

  return (
    <div className="relative my-4 rounded-xl border border-(--card-border) bg-[#0d1117] text-[#e6edf3] shadow-lg overflow-hidden group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs select-none">
        <div className="flex items-center gap-2 text-[#8b949e]">
          <Code2 className="w-3.5 h-3.5 text-(--primary)" />
          <span className="font-mono font-semibold tracking-wider text-[11px] text-[#c9d1d9]">
            {displayLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] active:scale-95 border border-[#30363d] rounded-md transition-all duration-150 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#8b949e] group-hover:text-white transition-colors" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="overflow-x-auto p-4 text-xs sm:text-sm font-mono leading-relaxed">
        {highlightedCode ? (
          <pre className="!bg-transparent !p-0 !m-0 !border-0 font-mono">
            <code
              className={`language-${language} !bg-transparent !p-0 !text-inherit font-mono`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        ) : (
          <pre className="!bg-transparent !p-0 !m-0 !border-0 font-mono">
            <code className="!bg-transparent !p-0 !text-inherit font-mono">{codeString}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

// GitHub-Style Callouts / Alerts Parser
function parseGitHubAlert(rawChildren: ReactNode): {
  type: "note" | "tip" | "important" | "warning" | "caution" | null;
  content: ReactNode;
} {
  if (!rawChildren) return { type: null, content: rawChildren };

  // Convert children to inspect text
  const childrenArray = React.Children.toArray(rawChildren);
  const firstChild = childrenArray[0];

  if (React.isValidElement<{ children?: ReactNode }>(firstChild) && firstChild.props?.children) {
    const innerChildren = React.Children.toArray(firstChild.props.children);
    const firstText = innerChildren[0];

    if (typeof firstText === "string") {
      const alertRegex = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;
      const match = firstText.match(alertRegex);

      if (match) {
        const alertType = match[1].toLowerCase() as
          | "note"
          | "tip"
          | "important"
          | "warning"
          | "caution";

        const remainingFirstText = firstText.replace(alertRegex, "");
        const newInner = [remainingFirstText, ...innerChildren.slice(1)].filter(
          (item) => item !== ""
        );

        const newFirstChild = React.cloneElement(firstChild, {}, ...newInner);
        const newChildren = [newFirstChild, ...childrenArray.slice(1)];

        return { type: alertType, content: newChildren };
      }
    }
  }

  return { type: null, content: rawChildren };
}

// GitHub Alert Component
function GitHubAlert({
  type,
  children,
}: {
  type: "note" | "tip" | "important" | "warning" | "caution";
  children: ReactNode;
}) {
  const configs = {
    note: {
      title: "Note",
      icon: Info,
      borderColor: "border-blue-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500 dark:text-blue-400",
    },
    tip: {
      title: "Tip",
      icon: Sparkles,
      borderColor: "border-emerald-500",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-500 dark:text-emerald-400",
    },
    important: {
      title: "Important",
      icon: AlertCircle,
      borderColor: "border-purple-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500 dark:text-purple-400",
    },
    warning: {
      title: "Warning",
      icon: AlertTriangle,
      borderColor: "border-amber-500",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-500 dark:text-amber-400",
    },
    caution: {
      title: "Caution",
      icon: ShieldAlert,
      borderColor: "border-red-500",
      bgColor: "bg-red-500/10",
      textColor: "text-red-500 dark:text-red-400",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={`my-4 p-4 rounded-xl border-l-4 ${config.borderColor} ${config.bgColor} border border-(--card-border) shadow-xs`}
    >
      <div className={`flex items-center gap-2 font-semibold text-sm mb-1.5 ${config.textColor}`}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{config.title}</span>
      </div>
      <div className="text-sm text-(--foreground) opacity-95 leading-relaxed [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

export default function MarkdownRenderer({
  content,
  githubRepo,
  branch = "main",
  className = "",
  showToolbar = true,
  docTitle,
}: MarkdownRendererProps) {
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");
  const [copiedMd, setCopiedMd] = useState(false);

  // Calculate estimated reading time
  const readingTime = useMemo(() => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content]);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (err) {
      console.error("Failed to copy markdown:", err);
    }
  };

  if (!content) return null;

  return (
    <div className={`w-full ${className}`}>
      {/* Optional Toolbar Header */}
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-(--card-border)">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-(--text-muted)">
            <FileText className="w-4 h-4 text-(--primary)" />
            {docTitle ? (
              <span className="font-semibold text-(--foreground)">{docTitle}</span>
            ) : (
              <span className="font-semibold text-(--foreground)">Documentation</span>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min read
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-(--card-bg) border border-(--card-border) text-xs">
              <button
                type="button"
                onClick={() => setViewMode("rendered")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === "rendered"
                    ? "bg-(--primary) text-(--primary-text) font-semibold shadow-xs"
                    : "text-(--text-muted) hover:text-(--foreground)"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("raw")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  viewMode === "raw"
                    ? "bg-(--primary) text-(--primary-text) font-semibold shadow-xs"
                    : "text-(--text-muted) hover:text-(--foreground)"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Raw</span>
              </button>
            </div>

            {/* Copy Full Markdown */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-(--foreground) bg-(--card-bg) hover:bg-(--card-border) border border-(--card-border) rounded-lg transition-all"
              title="Copy raw markdown"
            >
              {copiedMd ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-(--text-muted)" />
                  <span className="hidden sm:inline">Copy MD</span>
                </>
              )}
            </button>

            {/* GitHub Link */}
            {githubRepo && (
              <a
                href={`https://github.com/${githubRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-(--foreground) bg-(--card-bg) hover:bg-(--card-border) border border-(--card-border) rounded-lg transition-all"
                title="View repository on GitHub"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GitHub</span>
                <ExternalLink className="w-3 h-3 text-(--text-muted)" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {viewMode === "raw" ? (
        <div className="relative rounded-xl border border-(--card-border) bg-[#0d1117] text-[#e6edf3] p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
          <pre className="!bg-transparent !p-0 !m-0">
            <code>{content}</code>
          </pre>
        </div>
      ) : (
        <div className="prose max-w-none readme-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              // Custom Code & Pre
              code({ className, children, ...props }) {
                return (
                  <CodeBlock className={className} {...props}>
                    {children}
                  </CodeBlock>
                );
              },
              pre({ children }) {
                // Return children directly since CodeBlock renders its own wrapper
                return <>{children}</>;
              },

              // Custom Blockquote (with GitHub alert support)
              blockquote({ children }) {
                const { type, content: alertContent } = parseGitHubAlert(children);
                if (type) {
                  return <GitHubAlert type={type}>{alertContent}</GitHubAlert>;
                }
                return (
                  <blockquote className="my-4 border-l-4 border-(--primary) pl-4 py-1 italic text-(--text-muted) bg-(--card-bg)/50 rounded-r-lg">
                    {children}
                  </blockquote>
                );
              },

              // Custom Links (External links in new tab, resolve relative GitHub links)
              a({ href, children, ...props }) {
                const hrefStr = typeof href === "string" ? href : "";
                const resolvedHref = resolveGitHubUrl(hrefStr, githubRepo, branch, false);
                const isExternal =
                  resolvedHref.startsWith("http://") || resolvedHref.startsWith("https://");

                // Check if link contains badge/image to style cleanly without external link icon
                const hasImageChild = React.Children.toArray(children).some((child) => {
                  if (React.isValidElement(child)) {
                    if (child.type === "img") return true;
                    const cp = child.props as Record<string, unknown>;
                    if (cp && ("src" in cp || "alt" in cp)) return true;
                    if (cp && cp.children) {
                      return React.Children.toArray(cp.children as ReactNode).some(
                        (gc) =>
                          React.isValidElement(gc) &&
                          (gc.type === "img" || "src" in ((gc.props as Record<string, unknown>) || {}))
                      );
                    }
                  }
                  return false;
                });

                if (hasImageChild) {
                  return (
                    <a
                      href={resolvedHref}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="inline-block align-middle my-0.5 mx-0.5 hover:opacity-80 transition-opacity"
                      {...props}
                    >
                      {children}
                    </a>
                  );
                }

                return (
                  <a
                    href={resolvedHref}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-0.5 text-(--primary) hover:underline font-medium break-words transition-colors"
                    {...props}
                  >
                    <span>{children}</span>
                    {isExternal && (
                      <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-70 ml-0.5" />
                    )}
                  </a>
                );
              },

              // Custom Images (Badge support, resolve relative GitHub images)
              img({ src, alt, ...props }) {
                const srcStr = typeof src === "string" ? src : "";
                const resolvedSrc = resolveGitHubUrl(srcStr, githubRepo, branch, true);
                const isBadge =
                  srcStr.includes("img.shields.io") ||
                  srcStr.includes("shields.io") ||
                  srcStr.includes("badge") ||
                  srcStr.includes("actions/workflows") ||
                  srcStr.includes("buymeacoffee") ||
                  srcStr.includes("visual-studio-marketplace") ||
                  srcStr.includes("badgen.net");

                if (isBadge) {
                  return (
                    <img
                      src={resolvedSrc}
                      alt={alt || "badge"}
                      loading="lazy"
                      className="inline-block align-middle my-1 mx-0.5 max-h-6 transition-transform hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = "true";
                          if (srcStr.startsWith("http")) {
                            target.src = srcStr;
                          }
                        }
                      }}
                      {...props}
                    />
                  );
                }

                const cleanPath = srcStr.replace(/^\.?\//, "");

                return (
                  <span className="block my-6 overflow-hidden rounded-xl border border-(--card-border) bg-(--card-bg) shadow-md">
                    <img
                      src={resolvedSrc}
                      alt={alt || "image"}
                      loading="lazy"
                      className="w-full h-auto object-contain max-h-[600px] mx-auto transition-transform duration-300 hover:scale-[1.01]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback && githubRepo) {
                          target.dataset.triedFallback = "true";
                          // Fallback to jsDelivr CDN
                          target.src = `https://cdn.jsdelivr.net/gh/${githubRepo}@${branch}/${cleanPath}`;
                        }
                      }}
                      {...props}
                    />
                    {alt && (
                      <span className="block text-center text-xs text-(--text-muted) py-2 border-t border-(--card-border) bg-(--background)/50 font-medium">
                        {alt}
                      </span>
                    )}
                  </span>
                );
              },

              // Enhanced Tables
              table({ children }) {
                return (
                  <div className="my-6 w-full overflow-x-auto rounded-xl border border-(--card-border) shadow-xs">
                    <table className="w-full text-left border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                );
              },
              thead({ children }) {
                return (
                  <thead className="bg-(--card-bg) text-(--foreground) font-semibold border-b border-(--card-border)">
                    {children}
                  </thead>
                );
              },
              th({ children }) {
                return (
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-(--text-muted) font-semibold">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="px-4 py-3 border-t border-(--card-border) text-(--foreground) leading-relaxed">
                    {children}
                  </td>
                );
              },
              tr({ children }) {
                return (
                  <tr className="hover:bg-(--card-bg)/60 transition-colors">
                    {children}
                  </tr>
                );
              },

              // Keyboard shortcuts <kbd>
              kbd({ children }) {
                return (
                  <kbd className="px-2 py-0.5 text-xs font-mono font-semibold text-(--foreground) bg-(--card-bg) border border-(--card-border) border-b-2 rounded-md shadow-xs mx-0.5 inline-block">
                    {children}
                  </kbd>
                );
              },

              // Collapsible Sections <details> & <summary>
              details({ children, ...props }) {
                return (
                  <details
                    className="my-4 p-4 rounded-xl border border-(--card-border) bg-(--card-bg)/30 open:bg-(--card-bg)/70 transition-all duration-200 group"
                    {...props}
                  >
                    {children}
                  </details>
                );
              },
              summary({ children, ...props }) {
                return (
                  <summary
                    className="cursor-pointer font-semibold text-(--foreground) hover:text-(--primary) transition-colors select-none outline-hidden"
                    {...props}
                  >
                    {children}
                  </summary>
                );
              },

              // Horizontal Rule
              hr() {
                return <hr className="my-8 border-0 border-t border-(--card-border)" />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
