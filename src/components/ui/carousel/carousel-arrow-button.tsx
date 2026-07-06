import { ComponentPropsWithRef, useCallback } from "react";
import { EmblaCarouselType } from "embla-carousel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

type UsePrevNextButtonsType = {
    onPrevButtonClick: () => void;
    onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.goToPrev();
    }, [emblaApi]);

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return;
        emblaApi.goToNext();
    }, [emblaApi]);

    return {
        onPrevButtonClick,
        onNextButtonClick,
    };
};

type PropType = ComponentPropsWithRef<"svg">;

export const PrevButton = (props: PropType) => {
    const { className, ...restProps } = props;

    return (
        <ChevronUp
            className={cn("cursor-pointer hover:text-primary hover:scale-125", className)}
            {...restProps}
        />
    );
};

export const NextButton = (props: PropType) => {
    const { className, ...restProps } = props;

    return (
        <ChevronDown
            className={cn("cursor-pointer hover:text-primary hover:scale-125", className)}
            {...restProps}
        />
    );
};
