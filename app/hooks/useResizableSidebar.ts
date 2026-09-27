"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 320;

export function useResizableSidebar() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const isResizing = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarWidth");
    if (saved) setWidth(Number(saved));
  }, []);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    if (!isResizing.current) return;
    isResizing.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    setWidth((w) => {
      localStorage.setItem("sidebarWidth", String(w));
      return w;
    });
  }, []);

  const resetWidth = useCallback(() => {
    setWidth(DEFAULT_WIDTH);
    localStorage.setItem("sidebarWidth", String(DEFAULT_WIDTH));
  }, []);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isResizing.current) return;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
      setWidth(newWidth);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [stopResizing]);

  return { width, startResizing, resetWidth };
}