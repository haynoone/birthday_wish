import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Check } from 'lucide-react';
import { sound } from '../../utils/sound';

interface AnimatedTerminalProps {
  lines: string[];
  typingSpeed?: number; // ms per char
  lineDelay?: number; // ms pause between lines
  onAllCompleted?: () => void;
  className?: string;
}

export const AnimatedTerminal: React.FC<AnimatedTerminalProps> = ({
  lines,
  typingSpeed = 45,
  lineDelay = 500,
  onAllCompleted,
  className = '',
}) => {
  // Array of completed full lines
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  // Current line index being typed
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  // Current text of the line currently typing
  const [currentText, setCurrentText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Reset
    setCompletedLines([]);
    setCurrentLineIndex(0);
    setCurrentText('');
    setIsFinished(false);
  }, [lines]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsFinished(true);
      if (onAllCompleted) onAllCompleted();
      return;
    }

    const targetLine = lines[currentLineIndex];
    let charIndex = 0;

    const charTimer = setInterval(() => {
      if (charIndex < targetLine.length) {
        charIndex++;
        setCurrentText(targetLine.slice(0, charIndex));
      } else {
        clearInterval(charTimer);
        // Pause before advancing to next line
        setTimeout(() => {
          setCompletedLines((prev) => [...prev, targetLine]);
          setCurrentText('');
          setCurrentLineIndex((prev) => prev + 1);
        }, lineDelay);
      }
    }, typingSpeed);

    return () => clearInterval(charTimer);
  }, [currentLineIndex, lines, typingSpeed, lineDelay, onAllCompleted]);

  const handleReplay = () => {
    sound.playPop();
    setCompletedLines([]);
    setCurrentLineIndex(0);
    setCurrentText('');
    setIsFinished(false);
  };

  const handleSkipAll = () => {
    sound.playPop();
    setCompletedLines(lines);
    setCurrentLineIndex(lines.length);
    setCurrentText('');
    setIsFinished(true);
    if (onAllCompleted) onAllCompleted();
  };

  return (
    <div
      id="animated-terminal-container"
      className={`flex flex-col bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm ${className}`}
    >
      {/* macOS Style Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600" />
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5 text-rose-400" />
          <span>valcano@fun-notes:~</span>
        </div>

        <div className="flex items-center gap-2">
          {!isFinished ? (
            <button
              onClick={handleSkipAll}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Skip
            </button>
          ) : (
            <button
              onClick={handleReplay}
              title="Replay Terminal Messages"
              className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 min-h-[260px] sm:min-h-[300px] flex flex-col justify-start space-y-3 overflow-y-auto">
        <div className="text-zinc-500 text-xs select-none">
          Special thoughts loaded ✨ • Good vibes only
        </div>

        {/* Previously completed lines */}
        {completedLines.map((line, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <span className="text-rose-400 font-bold select-none">&gt;</span>
            <span className="text-zinc-100 font-medium">{line}</span>
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 self-center ml-auto opacity-60" />
          </div>
        ))}

        {/* Currently typing line */}
        {currentLineIndex < lines.length && (
          <div className="flex items-start gap-2.5">
            <span className="text-rose-400 font-bold select-none">&gt;</span>
            <span className="text-pink-300 font-medium">{currentText}</span>
            <span className="inline-block w-2 h-4 bg-rose-400 animate-pulse" />
          </div>
        )}

        {/* Final blinking prompt when finished */}
        {isFinished && (
          <div className="flex items-center gap-2 pt-2 text-zinc-400 text-xs">
            <span className="text-emerald-400 font-bold">&gt;</span>
            <span>All birthday wishes transmitted successfully.</span>
            <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse ml-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedTerminal;
