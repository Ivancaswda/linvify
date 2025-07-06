"use client";
import React from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from "motion/react";
import Header from "@/components/Header";
import {scrollContent} from "@/constants";
import {StickyScroll} from "@/components/ui/sticky-scroll-reveal";
import {products} from "@/constants";
import LingviCard from "@/components/LingviCard";
import Navbar from "@/components/Navbar";
import Constants from "@/constants";
import {testimonials} from "@/constants";
import {InfiniteMovingCards} from "@/components/ui/infinite-moving-cards";
import Navigation from "@/components/Navigation";
import {FloatingNav} from "@/components/ui/floating-navbar";
import {useAuth} from "@/context/useAuth";
const HomePage = () => {
    const firstRow = products.slice(0, 5);
    const {user} = useAuth()
    console.log(user)
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 1000]),
        springConfig
    );
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1000]),
        springConfig
    );
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
        springConfig
    );
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        springConfig
    );
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
        springConfig
    );


    return (


        <div>


            <Navbar/>
            <FloatingNav navItems={Constants()}/>
            <div
                ref={ref}
                className="h-[300vh] mb-20 py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
            >
                <Header/>
                <motion.div
                    style={{
                        rotateX,
                        rotateZ,
                        translateY,
                        opacity,
                    }}
                    className=""
                >
                    <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
                        {firstRow.map((product) => (
                            <LingviCard
                                product={product}
                                translate={translateX}
                                key={product.title}
                            />
                        ))}
                    </motion.div>
                    <motion.div className="flex flex-row  mb-20 space-x-20 ">
                        {secondRow.map((product) => (
                            <LingviCard
                                product={product}
                                translate={translateXReverse}
                                key={product.title}
                            />
                        ))}
                    </motion.div>
                    <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
                        {thirdRow.map((product) => (
                            <LingviCard
                                product={product}
                                translate={translateX}
                                key={product.title}
                            />
                        ))}
                    </motion.div>
                </motion.div>


            </div>
            <Navigation/>

            <div className="w-full py-4">
                <StickyScroll content={scrollContent}/>
            </div>

            <div
                className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                />
            </div>


        </div>
    );
};

export default HomePage