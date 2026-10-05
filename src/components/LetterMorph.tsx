import React from 'react';
import { motion } from 'framer-motion';

interface LetterMorphProps {
  text: string;
  className?: string;
}

export const LetterMorph: React.FC<LetterMorphProps> = ({ text, className = "" }) => {
  const words = text.split(" ");

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 * i },
    }),
  };

  const childVariants: any = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(6px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };


  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex overflow-hidden">
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={letterIndex}
              variants={childVariants}
              className="inline-block bg-gradient-to-r from-red-500 via-rose-300 to-white bg-clip-text text-transparent font-black tracking-tight"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};
