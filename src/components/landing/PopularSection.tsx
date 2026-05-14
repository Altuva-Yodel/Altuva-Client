import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getPopularSections } from "@/apis/landingPageApi"
import type { PopularSectionItem } from "@/apis/landingPageApi"
import useCustomerStore from "@/stores/customerStore"
import useCartStore from "@/stores/cartStore"
import LoginPromptModal from "@/components/basic/LoginPromptModal"

const PopularSection = () => {
    const navigate = useNavigate()
    const { customer } = useCustomerStore()
    const { cart, addItem } = useCartStore()
    const [sections, setSections] = useState<PopularSectionItem[]>([])
    const [activeChoice, setActiveChoice] = useState(0)
    const [showLoginModal, setShowLoginModal] = useState(false)

    useEffect(() => {
        getPopularSections().then(res => {
            if (res.success && res.data?.length) setSections(res.data)
        })
    }, [])

    if (sections.length === 0) return null

    const active = sections[activeChoice]

    const handleAddToCart = (e: React.MouseEvent, productId: number) => {
        e.stopPropagation()
        if (!customer) { setShowLoginModal(true); return }
        addItem(productId)
    }

    const getQty = (productId: number) => cart?.items.find(i => i.product_id === productId)?.quantity ?? 0

    return (
        <>
            {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} redirectAfter="/" />}

            <div className="flex justify-center p-4">
                <div className="relative flex max-w-7xl bg-[#F7FF83] mt-10 rounded-md overflow-hidden">
                    <div className="relative flex w-full max-w-[1440px] mx-auto bg-[#F7FF83] overflow-hidden">
                        <div className="flex flex-col py-10 px-10 w-full">

                            {/* Heading */}
                            <h3 className="text-4xl font-bold">People's Choice</h3>

                            {/* Category tabs */}
                            <div className="flex gap-4 mt-4">
                                {sections.map((s, i) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setActiveChoice(i)}
                                        className={`px-8 pt-2.5 pb-2 rounded-full border font-extrabold ${activeChoice === i ? "bg-black text-white border-black" : "border-neutral-800"}`}
                                    >
                                        {s.category}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="relative mt-10 pb-32 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeChoice}
                                        className="flex justify-between gap-20 w-full"
                                        initial="initial" animate="animate" exit="exit"
                                    >
                                        {/* Products */}
                                        <motion.div
                                            className="flex gap-10 w-7/12"
                                            variants={{
                                                initial: { x: -120, opacity: 0 },
                                                animate: { x: 0, opacity: 1 },
                                                exit: { x: -120, opacity: 0 },
                                            }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        >
                                            {[active.product_1, active.product_2].filter(Boolean).map((product, i) => {
                                                if (!product) return null
                                                const qty = getQty(product.id)
                                                return (
                                                    <div key={i} className="flex flex-col gap-2 min-w-1/2">
                                                        <div
                                                            className="h-auto rounded-3xl overflow-hidden cursor-pointer"
                                                            onClick={() => navigate(`/product/${product.slug}`)}
                                                        >
                                                            <img src={product.primary_image} alt={product.name} className="w-full" />
                                                        </div>

                                                        {qty > 0 ? (
                                                            <div
                                                                className="flex items-center justify-between bg-[#166534] text-white rounded-lg overflow-hidden h-10 w-fit mx-auto px-1"
                                                                onClick={e => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    className="w-9 h-full flex items-center justify-center text-lg hover:bg-white/10"
                                                                    onClick={() => useCartStore.getState().updateItem(product.id, qty - 1)}
                                                                >−</button>
                                                                <span className="text-sm font-semibold px-3">{qty}</span>
                                                                <button
                                                                    className="w-9 h-full flex items-center justify-center text-lg hover:bg-white/10"
                                                                    onClick={() => useCartStore.getState().updateItem(product.id, qty + 1)}
                                                                >+</button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="w-fit mx-auto py-2 px-16 rounded-lg bg-[#166534] text-white"
                                                                onClick={e => handleAddToCart(e, product.id)}
                                                            >
                                                                Add To Cart
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </motion.div>

                                        {/* Text */}
                                        <motion.div
                                            className="flex flex-col w-5/12 mt-10"
                                            variants={{
                                                initial: { x: 120, opacity: 0 },
                                                animate: { x: 0, opacity: 1 },
                                                exit: { x: 120, opacity: 0 },
                                            }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                        >
                                            <h2 className="font-bold text-5xl whitespace-pre-line">
                                                {active.title.replace(/\\n/g, '\n')}
                                            </h2>
                                            {active.subtitle && (
                                                <p className="text-lg text-neutral-800 mt-2 whitespace-pre-line">
                                                    {active.subtitle.replace(/\\n/g, '\n')}
                                                </p>
                                            )}
                                            <button
                                                className="w-fit px-8 py-3 rounded-full bg-black text-white mt-4"
                                                onClick={() => navigate(active.cta_url)}
                                            >
                                                {active.cta_text.toUpperCase()}
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Tree decoration */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeChoice + "-tree"}
                            className="absolute bottom-0 left-0"
                            initial={{ y: 120, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 120, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <img src="/images/land-tree.png" alt="Land Tree" />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
}

export default PopularSection
