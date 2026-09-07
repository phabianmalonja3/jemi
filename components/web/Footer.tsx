import Image from "next/image";
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#102d17] text-white">

      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />

        <div className="absolute -right-40 top-20 h-[450px] w-[450px] rounded-full bg-green-400/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      {/* =====================================================
          GLASS OVERLAY
      ====================================================== */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-emerald-500/[0.04]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">

        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* =================================================
              BRAND GLASS CARD
          ================================================== */}
          <div
            className="
              lg:col-span-2
              rounded-3xl
              border border-white/10
              bg-white/[0.06]
              p-7
              backdrop-blur-2xl
              shadow-2xl
              shadow-black/20
            "
          >
            <h3 className="text-3xl font-bold tracking-tight">
              Jemigraph
            </h3>

            <p className="mt-4 max-w-md text-sm leading-7 text-white/70 sm:text-base">
              Professional photography tours capturing your
              most beautiful moments and turning unforgettable
              experiences into timeless memories.
            </p>

            {/* Social Media */}
            <div className="mt-7">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                Follow Us
              </h4>

              <div className="flex gap-3">

                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-full
                    border border-white/10
                    bg-white/[0.08]
                    backdrop-blur-xl
                    shadow-lg
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-emerald-300/30
                    hover:bg-emerald-400/20
                  "
                >
                  <FaInstagram className="text-lg" />
                </a>

                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-full
                    border border-white/10
                    bg-white/[0.08]
                    backdrop-blur-xl
                    shadow-lg
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-emerald-300/30
                    hover:bg-emerald-400/20
                  "
                >
                  <FaFacebook className="text-lg" />
                </a>

                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="
                    flex h-11 w-11 items-center justify-center
                    rounded-full
                    border border-white/10
                    bg-white/[0.08]
                    backdrop-blur-xl
                    shadow-lg
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-emerald-300/30
                    hover:bg-emerald-400/20
                  "
                >
                  <FaTwitter className="text-lg" />
                </a>

              </div>
            </div>
          </div>

          {/* =================================================
              CONTACT GLASS CARD
          ================================================== */}
          <div
            className="
              rounded-3xl
              border border-white/10
              bg-white/[0.06]
              p-7
              backdrop-blur-2xl
              shadow-2xl
              shadow-black/20
            "
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              Contact
            </h4>

            <div className="mt-6 space-y-5">

              <div>
                <p className="mb-1 text-xs text-white/40">
                  Email
                </p>

                <a
                  href="mailto:info@jemigraph.co.tz"
                  className="text-sm text-white/75 transition-colors hover:text-emerald-300"
                >
                  info@jemigraph.co.tz
                </a>
              </div>

              <div>
                <p className="mb-1 text-xs text-white/40">
                  Experience
                </p>

                <p className="text-sm leading-6 text-white/60">
                  Professional photography experiences
                  and unforgettable tours.
                </p>
              </div>

            </div>
          </div>

          {/* =================================================
              APP GLASS CARD
          ================================================== */}
          <div
            className="
              rounded-3xl
              border border-white/10
              bg-white/[0.06]
              p-7
              backdrop-blur-2xl
              shadow-2xl
              shadow-black/20
            "
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              Get Our App
            </h4>

            <p className="mt-4 text-sm leading-6 text-white/60">
              Book your photography experience directly
              from the Jemigraph mobile app.
            </p>

            <div className="mt-6 flex flex-col gap-3">

              {/* APP STORE */}
              <a
                href="https://apps.apple.com/your-app-link"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-fit
                  rounded-xl
                  border border-white/10
                  bg-black/30
                  p-1
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:bg-black/50
                "
              >
                <Image
                  src="/logos/appstore.svg"
                  alt="Download on the App Store"
                  width={160}
                  height={55}
                  className="h-[48px] w-auto"
                />
              </a>

              {/* GOOGLE PLAY */}
              <a
                href="https://play.google.com/store/apps/details?id=com.jemi.app"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-fit
                  rounded-xl
                  border border-white/10
                  bg-black/30
                  p-1
                  backdrop-blur-xl
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:bg-black/50
                "
              >
                <Image
                  src="/logos/playstore.svg"
                  alt="Get it on Google Play"
                  width={160}
                  height={55}
                  className="h-[48px] w-auto"
                />
              </a>

            </div>
          </div>

        </div>

        {/* =====================================================
            DOWNLOAD / QR GLASS PANEL
        ====================================================== */}
        <div
          className="
            mt-8
            flex flex-col
            items-center
            justify-between
            gap-7
            rounded-3xl
            border border-white/10
            bg-white/[0.07]
            p-6
            backdrop-blur-2xl
            shadow-2xl
            shadow-black/20
            sm:flex-row
            sm:p-8
          "
        >

          {/* QR */}
          <div className="flex items-center gap-5">

            <a
              href="https://play.google.com/store/apps/details?id=com.jemi.app"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                flex-shrink-0
                rounded-2xl
                border border-white/10
                bg-white
                p-2
                shadow-xl
                transition-transform duration-300
                hover:scale-105
              "
            >
              <Image
                src="/images/qr-code.png"
                alt="Scan QR code to download Jemigraph app"
                width={110}
                height={110}
                className="rounded-xl"
              />
            </a>

            <div>
              <h4 className="font-semibold text-white">
                Download Jemigraph App
              </h4>

              <p className="mt-1 max-w-sm text-sm leading-6 text-white/60">
                Scan the QR code to quickly download the
                Jemigraph app and start your photography
                journey.
              </p>
            </div>

          </div>

          {/* Download Button */}
          <a
            href="https://play.google.com/store/apps/details?id=com.jemi.app"
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-full
              rounded-2xl
              border border-white/20
              bg-white/[0.12]
              px-7
              py-3.5
              text-center
              text-sm
              font-semibold
              text-white
              shadow-lg
              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-1
              hover:border-emerald-300/40
              hover:bg-emerald-400/20
              sm:w-auto
            "
          >
            Download App
          </a>

        </div>

        {/* =====================================================
            COPYRIGHT GLASS LINE
        ====================================================== */}
        <div
          className="
            mt-10
            flex flex-col
            items-center
            justify-between
            gap-3
            border-t border-white/10
            pt-6
            text-center
            text-xs
            text-white/40
            sm:flex-row
            sm:text-left
          "
        >
          <p>
            © {new Date().getFullYear()} Jemigraph Photograph Tours.
            All rights reserved.
          </p>

          <p className="text-white/30">
            Capturing moments. Creating memories.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
