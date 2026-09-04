import React, { useEffect, useState, useRef } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number; // ms per char (default ~60ms)
  onComplete?: () => void;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 60,
  onComplete,
  className = '',
  cursorClassName = 'text-rose-500',
  showCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        currentIndex++;
        setDisplayedText(text.slice(0, currentIndex));
      } else {
        clearInterval(interval);
        setIsFinished(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span>{displayedText}</span>
      {showCursor && (
        <span
          className={`inline-block ml-1 font-mono font-bold select-none ${cursorClassName} ${
            isFinished ? 'animate-pulse' : 'opacity-100'
          }`}
        >
          |
        </span>
      )}
    </span>
  );
};

export default TypingEffect;
