import { useState, useEffect } from "react";

// On charge tous les SVG une seule fois, en dehors du hook (lazy import)
const flagModules = import.meta.glob("@/core/assets/flags/*.svg", { import: "default" });

export const useFlag = (iso2: string) => {
    const [src, setSrc] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!iso2) {
            setSrc(undefined);
            setLoading(false);
            return;
        }

        setLoading(true);

        const key = `/src/core/assets/flags/${iso2.toUpperCase()}.svg`; // adapte le chemin exact
        const loader = flagModules[key];

        if (!loader) {
            setSrc(undefined);
            setLoading(false);
            return;
        }

        let cancelled = false;
        loader()
            .then((module: unknown) => {
                if (!cancelled) setSrc(module as string);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [iso2]);

    return { src, loading };
};
