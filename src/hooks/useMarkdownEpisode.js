import { useState, useEffect, useRef } from "react";
import { marked } from "marked";

// In-memory cache for loaded episodes
const episodeCache = new Map();

// Configure marked renderer for clean novel typography
marked.setOptions({
  gfm: true,
  breaks: true,
});

export function useMarkdownEpisode(episode) {
  const [content, setContent] = useState("");
  const [html, setHtml] = useState("");
  const [extractedTitle, setExtractedTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const loadEpisode = async (targetEpisode, isRetry = false) => {
    if (!targetEpisode) return;

    const filename = targetEpisode.filename;
    
    // Check in-memory cache first if not explicitly retrying
    if (!isRetry && episodeCache.has(filename)) {
      const cached = episodeCache.get(filename);
      setContent(cached.raw);
      setHtml(cached.html);
      setExtractedTitle(cached.title);
      setLoading(false);
      setError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    const candidateUrls = [
      `/novel/${filename}`,
      `./novel/${filename}`,
      `novel/${filename}`,
    ];

    let rawMarkdown = null;
    let lastFetchError = null;

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url, {
          signal: abortControllerRef.current.signal,
          headers: {
            "Accept": "text/markdown, text/plain, */*",
          },
        });

        if (response.ok) {
          const text = await response.text();
          // Verify it didn't return an HTML error page or 404 spa fallback
          if (text && !text.trim().startsWith("<!DOCTYPE html") && !text.trim().startsWith("<html")) {
            rawMarkdown = text;
            break;
          }
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        lastFetchError = err;
      }
    }

    if (rawMarkdown) {
      try {
        // Extract title from first line if starts with #
        const lines = rawMarkdown.split("\n");
        const firstH1 = lines.find((l) => l.trim().startsWith("# "));
        const cleanTitle = firstH1 ? firstH1.replace(/^#\s*/, "").trim() : targetEpisode.title;

        // Strip the main # heading from the parsed markdown body to avoid duplicate title in reader
        const bodyMarkdown = rawMarkdown.replace(/^#\s+[^\n]*\n+/m, "");

        const parsedHtml = marked.parse(bodyMarkdown);

        episodeCache.set(filename, {
          raw: rawMarkdown,
          html: parsedHtml,
          title: cleanTitle,
        });

        setContent(rawMarkdown);
        setHtml(parsedHtml);
        setExtractedTitle(cleanTitle);
        setLoading(false);
        setError(null);
      } catch (parseErr) {
        console.error("Error parsing markdown:", parseErr);
        setError("Gagal memproses format cerita.");
        setLoading(false);
      }
    } else {
      console.warn("Episode file not found:", filename, lastFetchError);
      setError(`File untuk ${targetEpisode.title || filename} tidak dapat dimuat.`);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEpisode(episode);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [episode?.id, episode?.filename]);

  const retry = () => {
    loadEpisode(episode, true);
  };

  return {
    content,
    html,
    extractedTitle,
    loading,
    error,
    retry,
  };
}
