
import React from "react";

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export default function VideoCard({
  id,
  title,
  description,
  thumbnail,
}: VideoCardProps) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;

  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-gray-800 flex flex-row h-40 md:h-44 transition-all hover:border-primary/50">
      
      {/* =====================================================
          IMAGE
      ====================================================== */}

      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-44 md:w-64 shrink-0 overflow-hidden group"
      >
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Play Button */}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 ml-0.5"
            >
              <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l10.48-6.86a1 1 0 0 0 0-1.72L9.52 4.28A1 1 0 0 0 8 5.14Z" />
            </svg>
          </div>
        </div>
      </a>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="flex flex-col justify-center p-4 md:p-5 min-w-0">
        
        {/* Title */}

        <h3 className="text-white font-semibold text-base md:text-lg line-clamp-2 mb-2">
          {title}
        </h3>

        {/* Description */}

        <p className="text-gray-400 text-xs md:text-sm line-clamp-2">
          {description}
        </p>

        {/* Watch */}

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-xs md:text-sm font-medium hover:underline mt-2 inline-flex items-center gap-1"
        >
          Watch Video
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
