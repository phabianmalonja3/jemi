"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

export default function BookingSuccessPage() {

    const router = useRouter();
    const params = useSearchParams();

    const bookingId = params.get("bookingId");
    const address = params.get("address");
    const time = params.get("time");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center"
            >

                {/* ICON */}
                <div className="flex justify-center mb-4">
                    <FaCheckCircle className="text-emerald-600 text-6xl" />
                </div>

                {/* TITLE */}
                <h1 className="text-2xl font-bold text-zinc-800">
                    Booking Successful!
                </h1>

                <p className="text-zinc-500 mt-2">
                    Your photographer has received your request.
                </p>

                {/* DETAILS */}
                <div className="mt-6 text-left space-y-3 bg-emerald-50 p-4 rounded-xl">

                    {bookingId && (
                        <p>
                            <span className="font-bold">Booking ID:</span>{" "}
                            {bookingId}
                        </p>
                    )}

                    {address && (
                        <p>
                            <span className="font-bold">Location:</span>{" "}
                            {address}
                        </p>
                    )}

                    {time && (
                        <p>
                            <span className="font-bold">Time:</span>{" "}
                            {time}
                        </p>
                    )}

                </div>

                {/* BUTTONS */}
                <div className="mt-6 space-y-3">

                    <button
                        onClick={() => router.push("/photographers")}
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700"
                    >
                        Book Another Photographer
                    </button>

                    <button
                        onClick={() => router.push("/")}
                        className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800"
                    >
                        Go Home
                    </button>

                </div>

            </motion.div>

        </div>
    );
}