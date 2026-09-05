import Image from 'next/image'
import React from 'react'
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-12 px-4 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* BRAND */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold mb-4">
            Jemigraph
          </h3>

          <p className="text-zinc-400 max-w-sm">
            Professional photography tours capturing your
            best moments worldwide with passion.
          </p>
        </div>

        {/* CONTACT + APP */}
        <div>
          <h4 className="font-bold mb-4">
            Contact
          </h4>

          <p className="text-zinc-400 text-sm mb-6">
            info@jemigraph.co.tz
          </p>

          <h4 className="font-bold mb-3">
            Get our App
          </h4>

          {/* APP DOWNLOADS */}
         <div className="flex flex-col gap-3">
  {/* App Store */}
  <a
    href="https://apps.apple.com/your-app-link"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block"
  >
    <Image
      src="/logos/appstore.svg"
      alt="Download on the App Store"
      width={160}
      height={55}
      className="w-auto h-[50px] hover:opacity-80 transition-opacity"
    />
  </a>

  {/* Google Play */}
  <a
    href="https://play.google.com/store/apps/details?id=com.jemi.app"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block"
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

        {/* QR + SOCIAL */}
        <div className="flex flex-col gap-5">

          {/* QR CODE */}
          <div>
            <h4 className="font-bold mb-3">
              Scan to Download
            </h4>

            <div className="bg-white p-2 rounded-xl w-fit">
              <Image
                src="/images/qr-code.png"
                alt="Scan QR code to download Jemigraph app"
                width={120}
                height={120}
                className="rounded-lg"
              />
            </div>

            <p className="text-zinc-500 text-xs mt-2 max-w-[150px]">
              Scan this QR code to download the Jemigraph app.
            </p>
          </div>

          {/* SOCIAL MEDIA */}
          <div>
            <h4 className="font-bold mb-3">
              Follow Us
            </h4>

            <div className="flex gap-4">

              <FaInstagram
                className="text-2xl text-zinc-300 hover:text-emerald-400 cursor-pointer transition-colors"
              />

              <FaFacebook
                className="text-2xl text-zinc-300 hover:text-emerald-400 cursor-pointer transition-colors"
              />

              <FaTwitter
                className="text-2xl text-zinc-300 hover:text-emerald-400 cursor-pointer transition-colors"
              />

            </div>
          </div>

        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-zinc-500 text-xs mt-12 pt-6 border-t border-zinc-800">
        &copy; {new Date().getFullYear()} Jemigraph Photograph Tours.
        All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
