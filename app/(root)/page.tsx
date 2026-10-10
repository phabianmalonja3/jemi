"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

import {
  FaArrowRight,
  FaCamera,
  FaMapMarkerAlt,
  FaStar,
  FaUsers,
} from "react-icons/fa";

import {
  AlertCircle,
  Check,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import Footer from "@/components/web/Footer";
import LoadingSpinner from "@/components/web/LoadingSpinner";
import PaymentModal from "@/components/web/PaymentModal";
import TestMonies from "@/components/web/TestMonies";

// ============================================================
// GSAP
// ============================================================

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================
// TYPES
// ============================================================

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
}

// ============================================================
// HOME COMPONENT
// ============================================================

export default function Home() {
  // ==========================================================
  // REFS
  // ==========================================================

  const heroRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLElement | null>(null);

  // ==========================================================
  // STATES
  // ==========================================================

  const [isLoading, setIsLoading] = useState(true);

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================================
  // API URL
  // ==========================================================

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://172.20.10.2:8080";

  // ==========================================================
  // STATS
  // ==========================================================

  const stats = [
    {
      number: "500+",
      label: "Happy Clients",
      icon: FaUsers,
    },
    {
      number: "50+",
      label: "Tour Locations",
      icon: FaMapMarkerAlt,
    },
    {
      number: "1000+",
      label: "Photo Sessions",
      icon: FaCamera,
    },
    {
      number: "98%",
      label: "5-Star Reviews",
      icon: FaStar,
    },
  ];

  // ==========================================================
  // FETCH SUBSCRIPTION PLANS
  // ==========================================================

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setFetchingPlans(true);
        setErrorMessage("");

        const response = await axios.get<SubscriptionPlan[]>(
          `${API_URL}/subscription-plans`
        );

        setPlans(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch subscription plans:",
          error
        );

        setPlans([]);

        setErrorMessage(
          "Failed to fetch subscriptions!"
        );
      } finally {
        setFetchingPlans(false);
      }
    };

    fetchPlans();
  }, [API_URL]);

  // ==========================================================
  // INITIAL LOADING
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // ==========================================================
  // GSAP ANIMATIONS
  // ==========================================================

  useEffect(() => {
    if (isLoading) return;

    const context = gsap.context(() => {
      // ------------------------------------------------------
      // HERO BADGE
      // ------------------------------------------------------

      gsap.fromTo(
        ".hero-badge",
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 0.1,
          ease: "back.out(1.5)",
        }
      );

      // ------------------------------------------------------
      // HERO TITLE
      // ------------------------------------------------------

      gsap.fromTo(
        ".hero-title",
        {
          y: 100,
          opacity: 0,
          rotationX: -15,
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          delay: 0.2,
          ease: "power3.out",
        }
      );

      // ------------------------------------------------------
      // HERO SUBTITLE
      // ------------------------------------------------------

      gsap.fromTo(
        ".hero-subtitle",
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        }
      );

      // ------------------------------------------------------
      // HERO BUTTON
      // ------------------------------------------------------

      gsap.fromTo(
        ".hero-button",
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.8,
          ease: "back.out(1.2)",
        }
      );

      // ------------------------------------------------------
      // STATS
      // ------------------------------------------------------

      if (statsRef.current) {
        gsap.from(".stat-item", {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            toggleActions:
              "play none none reverse",
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        });
      }
    });

    return () => {
      context.revert();
    };
  }, [isLoading]);

  // ==========================================================
  // SELECT PLAN
  // ==========================================================

  const handleSelectPlan = (
    plan: SubscriptionPlan
  ) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // ==========================================================
  // PAYMENT SUCCESS
  // ==========================================================

  const handleSuccessfulPayment = (
    message: string
  ) => {
    setSuccessMessage(message);
  };

  // ==========================================================
  // RETURN
  // ==========================================================

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-900 dark:to-black">

      {/* ======================================================
          LOADING
      ====================================================== */}

      {isLoading && (
        <LoadingSpinner
          size="lg"
        />
      )}

      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <section
        ref={heroRef}
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black"
      >

        {/* ----------------------------------------------------
            HERO BACKGROUND
        ---------------------------------------------------- */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-green-400/20 blur-3xl"
          />

        </div>

        {/* ----------------------------------------------------
            HERO CONTAINER
        ---------------------------------------------------- */}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* ==================================================
                HERO VIDEO
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                x: 60,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="order-1 w-full lg:order-2"
            >

              <motion.div
                whileHover={{
                  scale: 1.015,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl"
              >

                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-auto max-h-[70vh] w-full object-contain"
                >

                  <source
                    src="/videos/hero.mp4"
                    type="video/mp4"
                  />

                  Your browser does not support the video
                  tag.

                </video>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              </motion.div>

            </motion.div>

            {/* ==================================================
                HERO CONTENT
            ================================================== */}

            <div className="relative z-10 order-2 text-center lg:order-1 lg:text-left">

              {/* ------------------------------------------------
                  BADGE
              ------------------------------------------------ */}

              <div className="hero-badge">

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">

                  <FaCamera className="text-sm text-emerald-400" />

                  <span className="text-sm font-medium tracking-wide text-white">
                    Professional Photography
                  </span>

                </div>

              </div>

              {/* ------------------------------------------------
                  TITLE
              ------------------------------------------------ */}

              <h1 className="hero-title mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">

                Capture Your

                <br />

                <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                  Perfect Moments
                </span>

              </h1>

              {/* ------------------------------------------------
                  SUBTITLE
              ------------------------------------------------ */}

              <p className="hero-subtitle mx-auto mb-8 max-w-2xl text-base text-gray-300 sm:text-lg md:text-xl lg:mx-0">

                Creating beautiful memories through
                professional photography and
                unforgettable experiences.

              </p>

              {/* ------------------------------------------------
                  BUTTON
              ------------------------------------------------ */}

              <div className="hero-button flex justify-center px-4 lg:justify-start lg:px-0">

                <Link
                  href="/photographers"
                  className="w-full sm:w-auto"
                >

                  <motion.div
                    whileHover={{
                      scale: 1.04,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >

                    <Button className="h-12 w-full rounded-full bg-gradient-to-r from-emerald-600 to-green-500 px-8 text-white shadow-xl shadow-emerald-950/40 transition-all duration-300 hover:from-emerald-500 hover:to-green-400 sm:w-auto md:h-14 md:px-10">

                      See Our Professional
                      Photographers

                      <motion.span
                        animate={{
                          x: [0, 5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      >
                        <FaArrowRight className="ml-2" />
                      </motion.span>

                    </Button>

                  </motion.div>

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          CINEMATIC IMAGE SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-white px-4 py-16 dark:bg-black md:py-24">

        <div className="mx-auto max-w-6xl">

          <motion.div
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative h-[300px] w-full overflow-hidden rounded-3xl shadow-2xl md:h-[450px] lg:h-[550px]"
          >

            {/* IMAGE */}

            <motion.div
              initial={{
                scale: 1.08,
              }}
              whileInView={{
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.25,
              }}
              transition={{
                duration: 2.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0"
            >

              <Image
                src="/images/photographers.png"
                alt="Professional photographer"
                fill
                priority
                className="object-cover"
              />

            </motion.div>

            {/* OVERLAYS */}

            <div className="pointer-events-none absolute inset-0 bg-black/30" />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* CONTENT */}

            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">

              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                }}
              >

                <h2 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl">
                  Capture Every Moment
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 md:text-lg">
                  Professional photography that turns
                  your special moments into memories
                  that last forever.
                </p>

              </motion.div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* ======================================================
          STATS SECTION
      ====================================================== */}

      <section
        ref={statsRef}
        className="bg-white px-4 py-16 dark:bg-black md:py-24"
      >

        <div className="mx-auto max-w-6xl">

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">

            {stats.map((stat, index) => {

              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="stat-item text-center"
                >

                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: 3,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/30"
                  >

                    <Icon className="text-2xl text-emerald-600" />

                  </motion.div>

                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white md:text-4xl">
                    {stat.number}
                  </h3>

                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </p>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>

      {/* ======================================================
          SUBSCRIPTION SECTION
      ====================================================== */}

      <section
        className="relative min-h-screen overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#102d17",
        }}
      >

        {/* ----------------------------------------------------
            BACKGROUND EFFECTS
        ---------------------------------------------------- */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-green-400/10 blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl"
          />

        </div>

        {/* ----------------------------------------------------
            SUBSCRIPTION CONTAINER
        ---------------------------------------------------- */}

        <div className="relative z-10 mx-auto max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
            }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">

              Choose Your{" "}

              <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">
                Subscription Package
              </span>

            </h2>

            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Pay easily through your mobile phone
              and continue enjoying our services
              seamlessly.
            </p>

            {/* ERROR MESSAGE */}

            {errorMessage && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/15 px-5 py-4 text-sm text-red-200 shadow-xl backdrop-blur-xl"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* SUCCESS MESSAGE */}

            {successMessage && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/15 px-5 py-4 text-sm text-emerald-200 shadow-xl backdrop-blur-xl"
              >
                {successMessage}
              </motion.div>
            )}

          </motion.div>

          {/* ==================================================
              PLANS
          ================================================== */}

          {fetchingPlans ? (

            <LoadingSpinner
              message="Loading Packages..."
              size="md"
            />

          ) : plans.length === 0 ? (

            /* ==================================================
                EMPTY STATE
            ================================================== */

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-black/30 p-8 text-center shadow-2xl backdrop-blur-xl"
            >

              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-400" />

              <h3 className="text-lg font-semibold text-white">
                No Packages Available
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                There are currently no active
                subscription packages available.
                Please check back later or contact
                support.
              </p>

            </motion.div>

          ) : (

            /* ==================================================
                PLAN CARDS
            ================================================== */

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              variants={{
                hidden: {},

                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            >

              {plans.map((plan) => {

                const isPopular =
                  plan.name.toUpperCase() ===
                  "QUARTERLY";

                return (
                  <motion.div
                    key={plan.id}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: 60,
                        scale: 0.95,
                      },

                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: 0.7,
                          ease: [
                            0.22,
                            1,
                            0.36,
                            1,
                          ],
                        },
                      },
                    }}
                    whileHover={{
                      y: -10,
                      scale: 1.015,
                    }}
                    className={`
                      group relative overflow-hidden
                      rounded-md p-[1px]
                      transition-all duration-500
                      ${
                        isPopular
                          ? "bg-gradient-to-b from-emerald-300/80 via-emerald-500/40 to-transparent"
                          : "bg-gradient-to-b from-white/20 via-white/10 to-transparent"
                      }
                    `}
                  >

                    {/* ------------------------------------------------
                        CARD
                    ------------------------------------------------ */}

                    <div
                      className={`
                        relative flex h-full flex-col
                        justify-between rounded-md
                        border border-white/[0.08]
                        bg-black/40 p-8
                        shadow-2xl backdrop-blur-2xl
                        ${
                          isPopular
                            ? "shadow-emerald-950/60"
                            : "shadow-black/40"
                        }
                      `}
                    >

                      {/* CARD GLOW */}

                      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl transition-all duration-500 group-hover:bg-emerald-400/20" />

                      {/* POPULAR BADGE */}

                      {isPopular && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -15,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.5,
                          }}
                          className="absolute left-1/2 top-0 -translate-x-1/2"
                        >

                          <span className="inline-flex items-center gap-1 rounded-b-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-900/30">

                            <Sparkles className="h-3 w-3" />

                            Most Popular

                          </span>

                        </motion.div>
                      )}

                      {/* ------------------------------------------------
                          PLAN CONTENT
                      ------------------------------------------------ */}

                      <div
                        className={
                          isPopular
                            ? "pt-5"
                            : ""
                        }
                      >

                        {/* PLAN NAME */}

                        <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                          {plan.name}
                        </h3>

                        {/* DESCRIPTION */}

                        <p className="mt-4 text-sm leading-6 text-slate-300">
                          {plan.description}
                        </p>

                        {/* PRICE */}

                        <div className="mt-7">

                          <span className="text-4xl font-extrabold tracking-tight text-white">

                            TZS{" "}

                            {plan.price.toLocaleString()}

                          </span>

                          <span className="ml-1 text-sm font-medium text-slate-400">

                            / {plan.durationInDays} days

                          </span>

                        </div>

                        {/* FEATURES */}

                        <ul className="mt-7 space-y-4">

                          <li className="flex items-start gap-3">

                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">

                              <Check className="h-3.5 w-3.5 text-emerald-400" />

                            </div>

                            <p className="text-sm text-slate-300">
                              Access for{" "}
                              {plan.durationInDays}{" "}
                              days
                            </p>

                          </li>

                          <li className="flex items-start gap-3">

                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">

                              <Check className="h-3.5 w-3.5 text-emerald-400" />

                            </div>

                            <p className="text-sm text-slate-300">
                              Full system
                              capabilities
                            </p>

                          </li>

                        </ul>

                      </div>

                      {/* ------------------------------------------------
                          CHOOSE PLAN BUTTON
                      ------------------------------------------------ */}

                      <div className="mt-8">

                        <motion.button
                          type="button"
                          whileHover={{
                            scale: 1.02,
                          }}
                          whileTap={{
                            scale: 0.98,
                          }}
                          onClick={() =>
                            handleSelectPlan(plan)
                          }
                          className="1
                            group/btn
                            relative
                            w-full
                            overflow-hidden
                            rounded-md
                            border
                            border-emerald-400/20
                            bg-gradient-to-r
                            from-emerald-600
                            to-green-500
                            py-3.5
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-emerald-950/30
                            transition-all
                            duration-300
                            hover:from-emerald-500
                            hover:to-green-400
                            hover:shadow-emerald-500/20
                          "
                        >

                          <span className="relative z-10">
                            Choose Plan
                          </span>

                          {/* BUTTON SHINE */}

                          <span
                            className="
                              absolute
                              inset-0
                              -translate-x-full
                              bg-gradient-to-r
                              from-transparent
                              via-white/20
                              to-transparent
                              transition-transform
                              duration-700
                              group-hover/btn:translate-x-full
                            "
                          />

                        </motion.button>

                      </div>

                    </div>

                  </motion.div>
                );
              })}

            </motion.div>
          )}

        </div>

      </section>

      {/* ======================================================
          TESTIMONIALS
      ====================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 50,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <TestMonies />
      </motion.section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />

      {/* ======================================================
          PAYMENT MODAL
      ====================================================== */}

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        selectedPlan={selectedPlan}
        onSuccessfulPayment={
          handleSuccessfulPayment
        }
      />

    </main>
  );
}
