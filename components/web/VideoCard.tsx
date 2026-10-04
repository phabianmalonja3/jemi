
"use client";

import React, { useState } from "react";

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
  const [embedError, setEmbedError] = useState(false);

  const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;
  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return (
    <div className="w-full bg-surface rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">

      {/* ===================================================== */}
      {/* MOBILE + DESKTOP CONTENT                              */}
      {/* ===================================================== */}

      <div className="flex flex-col md:flex-row">

        {/* ================================================= */}
        {/* VIDEO PLAYER                                      */}
        {/* ================================================= */}

        <div className="relative w-full md:w-80 lg:w-96 shrink-0 aspect-video md:aspect-auto md:h-52 lg:h-56 bg-black overflow-hidden">

          {!embedError ? (
            <iframe
              src={embedUrl}
              title={title}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onError={() => setEmbedError(true)}
            />
          ) : (
            /* ============================================= */
            /* FALLBACK                                      */
            /* ============================================= */

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 group block"
            >
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-colors duration-300" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 ml-1"
                  >
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l10.48-6.86a1 1 0 0 0 0-1.72L9.52 4.28A1 1 0 0 0 8 5.14Z" />
                  </svg>

                </div>
              </div>

              {/* Fallback Text */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="inline-flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs md:text-sm">
                  <span className="text-red-500">
                    ▶
                  </span>

                  <span>
                    Watch on YouTube
                  </span>
                </div>
              </div>
            </a>
          )}
        </div>

        {/* ================================================= */}
        {/* CONTENT                                           */}
        {/* ================================================= */}

        <div className="flex flex-col justify-center p-4 md:p-5 lg:p-6 min-w-0 flex-1">

          {/* Category */}
          <div className="flex items-center gap-2 mb-2">

            <span className="text-red-500 text-[11px] md:text-xs font-medium">
              YouTube Tutorial
            </span>

            <span className="text-gray-600">
              •
            </span>

            <span className="text-gray-500 text-[11px] md:text-xs">
              Jemigraph
            </span>

          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-base md:text-lg lg:text-xl line-clamp-2 leading-snug mb-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-gray-400 text-xs md:text-sm line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}

          {/* Watch on YouTube */}
          <div className="mt-3">

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary text-xs md:text-sm font-medium hover:underline transition-colors"
            >
              Watch on YouTube

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M13.5 5.25a.75.75 0 0 1 .75-.75h4.19l-5.72-5.72a.75.75 0 0 1 1.06-1.06l5.72 5.72V5.25a.75.75 0 0 1-.75.75h-5.25a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
                <path
                  d="M5.25 6.75A2.25 2.25 0 0 0 3 9v9.75A2.25 2.25 0 0 0 5.25 21h9.75a2.25 2.25 0 0 0 2.25-2.25V15a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 .75-.75H9a.75.75 0 0 0 0-1.5H5.25Z"
                />
              </svg>

            </a>

          </div>

        </div>
      </div>
    </div>
  );
}

