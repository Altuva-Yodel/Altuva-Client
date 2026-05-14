import { bentoItems } from "@/constants/bentoGridData";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";


export default function HomePromoBento() {
    return (
        <section className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 rounded-md overflow-hidden">

                {bentoItems.map((item) => (
                    <div
                        key={item.id}
                        className={`relative overflow-hidden group ${item.size === "large"
                            ? "md:col-span-2"
                            : ""
                            }`}
                    >
                        {/* Image */}
                        <img
                            src={item.image}
                            alt={item.title || "promo"}
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        {
                            item.size != 'large' &&
                            <div
                                className={`absolute bottom-6 right-6 flex flex-col justify-end`}
                            >
                                {/* Button */}
                                <NavLink to={item.link}>
                                    <button className="flex items-center gap-1 bg-yellow-200/70 hover:bg-yellow-200 text-stone-900 px-5 pt-2.5 pb-2 rounded-full font-semibold shadow border border-white">
                                        Order Now <ArrowRight size={20} />
                                    </button>
                                </NavLink>
                            </div>
                        }
                    </div>
                ))}

            </div>
        </section>
    );
}