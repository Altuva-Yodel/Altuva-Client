"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    getTestimonials,
    type TestimonialItem,
} from "../../apis/landingPageApi"

const PER_PAGE = 2

function SkeletonCard() {
    return (
        <div className="relative animate-pulse">
            <div className="absolute -translate-y-1/2 left-1/2 -translate-x-1/2 z-10">
                <div className="w-32 h-32 rounded-full bg-gray-300" />
            </div>

            <div className="bg-gray-200 rounded-3xl px-20 py-10 pt-20 text-center">
                <div className="h-3 bg-gray-300 rounded mb-2 w-full" />
                <div className="h-3 bg-gray-300 rounded mb-2 w-5/6 mx-auto" />
                <div className="h-3 bg-gray-300 rounded mb-6 w-4/6 mx-auto" />
                <div className="h-3 bg-gray-300 rounded w-24 mx-auto" />
            </div>
        </div>
    )
}

const slideVariants = {
    enter: { scale: 1.15, opacity: 0, zIndex: 1 },
    center: { scale: 1, opacity: 1, zIndex: 1 },
    exit: { scale: 0.75, opacity: 0, zIndex: 0 },
}

export default function ClientTestimonialsSection() {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
    const [loading, setLoading] = useState(true)

    const [startIndex, setStartIndex] = useState(0)

    useEffect(() => {
        getTestimonials()
            .then((r) => {
                if (r.success && r.data) {
                    setTestimonials(r.data)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    const visibleTestimonials = useMemo(() => {
        return testimonials.slice(startIndex, startIndex + PER_PAGE)
    }, [testimonials, startIndex])

    const canPrev = startIndex > 0
    const canNext = startIndex + PER_PAGE < testimonials.length

    const next = () => { if (!canNext) return; setStartIndex((prev) => prev + 1) }
    const prev = () => { if (!canPrev) return; setStartIndex((prev) => prev - 1) }

    if (!loading && testimonials.length === 0) return null

    return (
        <section className="py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">

                {loading ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : (
                    <div className="relative overflow-hidden min-h-[380px]">
                        <AnimatePresence initial={false} mode="popLayout">
                            <motion.div
                                key={startIndex}
                                
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="grid md:grid-cols-2 gap-8 absolute inset-0"
                            >
                                {visibleTestimonials.map((t) => (
                                    <div
                                        key={t.id}
                                        className="relative h-fit"
                                    >
                                        {/* Avatar */}
                                        <div className="absolute -translate-y-1/2 left-1/2 -translate-x-1/2 z-10">
                                            <img
                                                src={
                                                    t.avatar_url ??
                                                    "/images/avatar-default.png"
                                                }
                                                alt={t.person_name}
                                                className="w-32 h-32 rounded-full object-cover"
                                                onError={(e) => {
                                                    ; (
                                                        e.target as HTMLImageElement
                                                    ).src =
                                                        "https://placehold.co/128x128?text=👤"
                                                }}
                                            />
                                        </div>

                                        {/* Card */}
                                        <div className="bg-[#7B1E1E] text-white rounded-3xl px-20 py-10 pt-20 text-center shadow-md h-full">
                                            <p className="text-sm leading-relaxed">
                                                {t.quote}
                                            </p>

                                            <p className="mt-4 font-semibold text-sm">
                                                {t.person_name}
                                            </p>

                                            {t.designation && (
                                                <p className="text-xs text-white/70 mt-1">
                                                    {t.designation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}

                {/* Navigation */}
                {!loading && testimonials.length > PER_PAGE && (
                    <div className="flex justify-end gap-3 mt-10">
                        <button
                            onClick={prev}
                            disabled={!canPrev}
                            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition disabled:opacity-40"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <button
                            onClick={next}
                            disabled={!canNext}
                            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition disabled:opacity-40"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}