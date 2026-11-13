import { useCallback, useId, useRef, type KeyboardEvent } from "react";
import { motion, scale } from "framer-motion";
import { ProjectCategoryType } from "@/shared/types/common";
import { cn } from "@/shared/lib/utils";

/** Option affichable dans le filtre. */
export type FilterOption<ProjectCategoryType> = {
    /** Valeur technique, stable, utilisée pour l'état. */
    value: ProjectCategoryType;
    /** Libellé affiché dans le bouton. */
    label: string;
};

export type FilterProps<T extends string> = {
    /** Liste des choix (idéalement définie en constante hors du composant). */
    options: readonly FilterOption<ProjectCategoryType>[];
    /** Valeur actuellement sélectionnée. */
    value: ProjectCategoryType;
    /** Appelé lorsque l'utilisateur change de choix. */
    onChange: (value: T) => void;
    /** Nom accessible du groupe (lu par les lecteurs d'écran). */
    ariaLabel: string;
};

const SPRING = { type: "spring", stiffness: 400, damping: 32 } as const;

export function Filter({ options, value, onChange, ariaLabel }: FilterProps<ProjectCategoryType>) {
    // Préfixe unique par instance : évite les collisions de layoutId
    // si le composant est utilisé plusieurs fois sur la page.
    const instanceId = useId();
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

    const focusOption = useCallback(
        (index: number) => {
            const clamped = (index + options.length) % options.length;
            buttonRefs.current[clamped]?.focus();
        },
        [options.length]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
            switch (event.key) {
                case "ArrowRight":
                case "ArrowDown":
                    event.preventDefault();
                    focusOption(index + 1);
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    event.preventDefault();
                    focusOption(index - 1);
                    break;
                case "Home":
                    event.preventDefault();
                    focusOption(0);
                    break;
                case "End":
                    event.preventDefault();
                    options.length - 1;
                    break;
            }
        },
        [focusOption, options.length]
    );

    return (
        <div role="radiogroup" aria-label={ariaLabel} className="flex gap-6 p-1.5 ">
            {options.map((option, index) => {
                const isActive = option.value === value;
                return (
                    <motion.button
                        key={option.value}
                        ref={(node) => {
                            buttonRefs.current[index] = node;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onChange(option.value)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        whileTap={{ scale: 0.94 }}
                        whileHover={{ y: isActive ? 0 : -2 }}
                        className={cn(
                            "relative isolate grid h-12 w-24 cursor-pointer place-items-center rounded-md text-sm font-semibold ",
                            "transition-colors duration-300 ",

                            isActive ? "text-white" : ""
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={`filter-active-bg-${instanceId}`}
                                transition={SPRING}
                                className="absolute inset-0 -z-10 rounded-md bg-linear-to-br from-primary to-blue-300 shadow-[0_px_18px_-8px_var(--color-primary)]"
                            />
                        )}
                        <span className="relative z-10">{option.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}
