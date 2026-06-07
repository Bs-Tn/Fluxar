import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    EmblaCarouselType,
    EmblaEventListType,
    EmblaEventModelType,
    EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { SlideType } from "../functionnal/layout/sidebar";

const TWEEN_FACTOR_BASE = 0.52;

const numberWithinRange = (number: number, min: number, max: number): number =>
    Math.min(Math.max(number, min), max);

type PropType = {
    slides: SlideType[];
    options?: EmblaOptionsType;
};

const ProjectCarousel = (props: PropType) => {
    const { slides, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const tweenFactor = useRef(0);
    const tweenNodes = useRef<HTMLElement[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setSelectedIndex(emblaApi.selectedSnap());
    }, []);

    const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
            return slideNode.querySelector(
                ".embla__slide__number"
            ) as HTMLElement;
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

            emblaApi.snapList().forEach((scrollSnap, snapIndex) => {
                let diffToTarget = scrollSnap - scrollProgress;
                const slidesInSnap =
                    engine.scrollSnapList.slidesBySnap[snapIndex];

                slidesInSnap.forEach((slideIndex) => {
                    if (isScrollEvent && !slidesInView.includes(slideIndex))
                        return;

                    if (engine.options.loop) {
                        engine.slideLooper.loopPoints.forEach((loopItem) => {
                            const target = loopItem.target();

                            if (slideIndex === loopItem.index && target !== 0) {
                                const sign = Math.sign(target);

                                if (sign === -1) {
                                    diffToTarget =
                                        scrollSnap - (1 + scrollProgress);
                                }
                                if (sign === 1) {
                                    diffToTarget =
                                        scrollSnap + (1 - scrollProgress);
                                }
                            }
                        });
                    }

                    const tweenValue =
                        1 - Math.abs(diffToTarget * tweenFactor.current);
                    const scale = numberWithinRange(
                        tweenValue,
                        0,
                        1
                    ).toString();
                    const tweenNode = tweenNodes.current[slideIndex];
                    tweenNode.style.transform = `scale(${scale})`;
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
        <div className="cursor-pointer embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((slide, index) => (
                        <div
                            className="embla__slide"
                            key={`${index} - ${slide.path}`}
                        >
                            <div
                                className={cn(
                                    index === selectedIndex &&
                                        "bg-primary text-white border-primary transition-colors duration-300 ease-in-out",
                                    "embla__slide__number"
                                )}
                            >
                                {slide.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectCarousel;
