import Image from 'next/image'
import React from 'react'
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-[#25632D] text-white py-12 px-4 border-t border-[#1f5226]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* =====================================================
            BRAND
        ====================================================== */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold mb-4">
            Jemigraph
          </h3>

          <p className="text-white/75 max-w-sm leading-relaxed">
            Professional photography tours capturing your
            best moments worldwide with passion.
          </p>
        </div>

        {/* =====================================================
            CONTACT + APP DOWNLOAD
        ====================================================== */}
        <div>
          <h4 className="font-bold mb-4">
            Contact
          </h4>

          <a
            href="mailto:info@jemigraph.co.tz"
            className="text-white/75 text-sm hover:text-white transition-colors"
          >
            info@jemigraph.co.tz
          </a>

          <h4 className="font-bold mt-6 mb-3">
            Get our App
          </h4>

          {/* APP DOWNLOADS */}
          <div className="flex flex-col gap-3">

            {/* APP STORE */}
            <a
              href="https://apps.apple.com/your-app-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-fit"
            >
              <Image
                src="/logos/appstore.svg"
                alt="Download on the App Store"
                width={160}
                height={55}
                className="w-auto h-[50px] hover:opacity-80 transition-opacity"
              />
            </a>

            {/* GOOGLE PLAY */}
            <a
              href="https://play.google.com/store/apps/details?id=com.jemi.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-fit"
            >
              <Image
                src="/logos/playstore.svg"
                alt="Get it on Google Play"
                width={160}
                height={55}
                className="w-auto h-[50px] hover:opacity-80 transition-opacity"
              />
            </a>

          </div>
        </div>

        {/* =====================================================
            QR CODE + SOCIAL MEDIA
        ====================================================== */}
        <div className="flex flex-col gap-6">

          {/* QR CODE */}
          <div>
            <h4 className="font-bold mb-3">
              Scan to Download
            </h4>

            <a
              href="https://play.google.com/store/apps/details?id=com.jemi.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <div className="bg-white p-2 rounded-xl w-fit hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/qr-code.png"
                  alt="Scan QR code to download Jemigraph app"
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </div>
            </a>

            <p className="text-white/60 text-xs mt-2 max-w-[160px] leading-relaxed">
              Scan this QR code to download the Jemigraph app.
            </p>
          </div>

          {/* SOCIAL MEDIA */}
          <div>
            <h4 className="font-bold mb-3">
              Follow Us
            </h4>

            <div className="flex gap-4">

              {/* INSTAGRAM */}
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>

              {/* FACEBOOK */}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>

              {/* TWITTER / X */}
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-white hover:text-emerald-200 transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>

            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          COPYRIGHT
      ====================================================== */}
      <div className="max-w-6xl mx-auto text-center text-white/60 text-xs mt-12 pt-6 border-t border-white/20">
        &copy; {new Date().getFullYear()} Jemigraph Photograph Tours.
        All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
