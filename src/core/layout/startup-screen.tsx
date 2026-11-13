import { PropsWithChildren, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TypographyH1 } from "@/shared/components/ui/typography";
import { TextHoverEffect } from "@/shared/components/ui/hoverable-text";
import FluxarIcon from "@/core/assets/icons/fluxar.svg";

const DELAY = 1.7;
const CHLIDREN_DELAY = 4;

const StartupScreen = ({ children }: PropsWithChildren) => {
    const [showScreen, setShowScreen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowScreen(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background">
            <motion.div
                className="min-h-screen"
                initial={{ scale: 1.15, opacity: 0, filter: "blur(6px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, delay: CHLIDREN_DELAY, ease: [0.2, 0.8, 0.3, 1] }}
            >
                {children}
            </motion.div>

            <AnimatePresence>
                {showScreen && (
                    <motion.div
                        className="absolute inset-0 z-10 flex flex-col gap-4 items-center justify-center bg-background"
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1.6, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, delay: DELAY, ease: [0.7, 0, 0.3, 1] }}
                    >
                        <motion.div
                            className="flex h-30 w-30 items-center justify-center rounded-[22px] bg-linear-135 from-primary to-primary/40 shadow-[0_0_40px_#2383E2]"
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.3, 1] }}
                        >
                            <img src={FluxarIcon} alt="Fluxar icon" />
                        </motion.div>
                        <motion.span
                            className="text-xs tracking-[0.3em] "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <TypographyH1 className="text-8xl">
                                <TextHoverEffect text="Fluxar" />
                            </TypographyH1>
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export { StartupScreen };
