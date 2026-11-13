import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { buttonVariants } from "../button";

type Direction = "bottom" | "top" | "left" | "right";

// Position cachée du texte selon la direction (il glisse depuis là)
const hiddenOffset: Record<Direction, { x: number; y: number }> = {
    bottom: { x: 0, y: -12 }, // glisse depuis le haut vers le bas
    top: { x: 0, y: 12 }, // glisse depuis le bas vers le haut
    left: { x: 12, y: 0 }, // glisse depuis la droite vers la gauche
    right: { x: -12, y: 0 }, // glisse depuis la gauche vers la droite
};

// Disposition du conteneur selon la direction
const containerLayout: Record<Direction, string> = {
    bottom: "flex-col",
    top: "flex-col-reverse",
    left: "flex-row-reverse",
    right: "flex-row",
};

const smoothSpring = { type: "spring", stiffness: 300, damping: 26 } as const;

type Props = {
    direction: Direction;
} & ButtonPrimitive.Props &
    VariantProps<typeof buttonVariants>;

// const AnimatedButton = ({
//     className,
//     direction,
//     variant = "default",
//     size = "default",
//     ...props
// }: Props) => {
//     const [hovered, setHovered] = useState(false);
//     const hidden = hiddenOffset[direction];

//     return (
//         <div className={`flex items-center justify-center gap-2 ${containerLayout[direction]}`}>
//             <motion.button
//                 onHoverStart={() => setHovered(true)}
//                 onHoverEnd={() => setHovered(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={smoothSpring}
//                 className={cn(buttonVariants({ variant, size, className }))}
//             >
//                 <Plus className="size-6" />
//             </motion.button>

//             {/* Le texte émerge depuis la direction choisie */}
//             <motion.div
//                 initial={false}
//                 animate={
//                     hovered
//                         ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
//                         : { opacity: 0, x: hidden.x, y: hidden.y, filter: "blur(4px)" }
//                 }
//                 transition={smoothSpring}
//                 className="overflow-hidden"
//             >
//                 <motion.span
//                     animate={hovered ? { scale: 1 } : { scale: 0.9 }}
//                     transition={smoothSpring}
//                     className="block text-sm text-neutral-600"
//                 >
//                     Ajouter
//                 </motion.span>
//             </motion.div>
//         </div>
//     );
// };
const layout: Record<Direction, string> = {
    right: "flex-row", // le texte apparaît à droite de l'icône
    left: "flex-row-reverse", // le texte apparaît à gauche de l'icône
    bottom: "flex-col", // le texte apparaît sous l'icône
    top: "flex-col-reverse", // le texte apparaît au-dessus de l'icône
};
const AnimatedButton = ({
    className,
    direction,
    variant = "default",
    size = "default",
    ...props
}: Props) => {
    const [hovered, setHovered] = useState(false);
    // Expansion horizontale (left/right) ou verticale (top/bottom)
    const isHorizontal = direction === "left" || direction === "right";

    return (
        <motion.button
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileTap={{ scale: 0.95 }}
            transition={smoothSpring}
            className={cn(buttonVariants({ variant, size, className }), `p-3 ${layout[direction]}`)}
            //   className={`flex items-center justify-center rounded-full bg-neutral-900 text-white p-3 ${layout[direction]}`}
        >
            <Plus className="size-6 shrink-0" />

            {/* Le texte révélé par la croissance du bouton */}
            <motion.span
                initial={false}
                animate={
                    isHorizontal
                        ? {
                              width: hovered ? "auto" : 0,
                              opacity: hovered ? 1 : 0,
                              marginLeft: hovered ? 8 : 0,
                              marginRight: hovered ? 8 : 0, // symétrique pour "left"
                              filter: hovered ? "blur(0px)" : "blur(4px)",
                          }
                        : {
                              height: hovered ? "auto" : 0,
                              opacity: hovered ? 1 : 0,
                              marginTop: hovered ? 8 : 0,
                              marginBottom: hovered ? 8 : 0,
                              filter: hovered ? "blur(0px)" : "blur(4px)",
                          }
                }
                transition={smoothSpring}
                className="block overflow-hidden whitespace-nowrap text-sm"
            >
                Ajouter
            </motion.span>
        </motion.button>
    );
};

export { AnimatedButton };
