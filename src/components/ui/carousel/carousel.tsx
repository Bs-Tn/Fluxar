import { ComponentProps, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    EmblaCarouselType,
    EmblaEventListType,
    EmblaEventModelType,
    EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { SlideType } from "../../functionnal/layout/sidebar";
import { NextButton, PrevButton, usePrevNextButtons } from "./carousel-arrow-button";
import { RootContext } from "@/App";
import { RootContextType } from "@/types/context";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max);

type PropType = {
    slides: SlideType[];
    options?: EmblaOptionsType;
} & ComponentProps<"div">;

const ProjectCarousel = (props: PropType) => {
    const { slides, options, className } = props;

    const { setSelectedProjectCategory } = useContext<RootContextType>(RootContext);
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);

    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        const index = emblaApi.selectedSnap();

        setSelectedIndex(index);
        setSelectedProjectCategory(slides[index].path);
    }, []);

    const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
            return slideNode.querySelector(".embla__slide__number") as HTMLElement;
        });
    }, []);

    const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.snapList().length;
    }, []);

    const tweenScale = useCallback(
        <EventType extends keyof EmblaEventListType>(
            emblaApi: EmblaCarouselType,
            event?: EmblaEventModelType<EventType>
        ) => {
            const engine = emblaApi.internalEngine();
            const scrollProgress = emblaApi.scrollProgress();
            const slidesInView = emblaApi.slidesInView();
            const isScrollEvent = event?.type === "scroll";
            const minScale = 0;
            const maxScale = 1.25;

            emblaApi.snapList().forEach((scrollSnap, snapIndex) => {
                let diffToTarget = scrollSnap - scrollProgress;
                const slidesInSnap = engine.scrollSnapList.slidesBySnap[snapIndex];

                slidesInSnap.forEach((slideIndex) => {
                    if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopItem) => {
                            const target = loopItem.target();

                            if (slideIndex === loopItem.index && target !== 0) {
                                const sign = Math.sign(target);

                                if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
                                if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
                            }
                        });
                    }

                    const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
                    const clampedTweenValue = numberWithinRange(tweenValue, 0, 1);
                    const scaleTarget = minScale + (maxScale - minScale) * clampedTweenValue;

                    const tweenNode = tweenNodes.current[slideIndex];
                    tweenNode.style.transform = `scale(${scaleTarget})`;
                });
            });
        },
        []
    );

    useEffect(() => {
        if (!emblaApi) return;

        setTweenNodes(emblaApi);
        setTweenFactor(emblaApi);
        tweenScale(emblaApi);

        emblaApi
            .on("reinit", setTweenNodes)
            .on("reinit", setTweenFactor)
            .on("reinit", tweenScale)
            .on("scroll", tweenScale)
            .on("slidefocus", tweenScale)
            .on("select", onSelect);
    }, [emblaApi, tweenScale]);

    return (
        <div className={cn("embla__controls", className)}>
            <div className="embla__buttons">
                <PrevButton
                    className="w-full h-12 flex justify-center"
                    onClick={onPrevButtonClick}
                />
                <div className="cursor-pointer embla">
                    <div className="embla__viewport" ref={emblaRef}>
                        <div className="embla__container">
                            {slides.map((slide, index) => (
                                <div className="embla__slide" key={`${index} - ${slide.path}`}>
                                    <div
                                        className={cn(
                                            "embla__slide__number flex flex-col gap-1 items-center",
                                            index === selectedIndex &&
                                                "text-primary font-bold border-primary transition-colors duration-300 ease-in-out"
                                        )}
                                    >
                                        <span>{slide.icon}</span>
                                        <span>{slide.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <NextButton
                    className="w-full h-12 flex justify-center"
                    onClick={onNextButtonClick}
                />
            </div>
        </div>
    );
};

export default ProjectCarousel;
