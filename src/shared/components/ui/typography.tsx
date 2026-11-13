import { cn } from "@/shared/lib/utils";
import { ComponentProps, FC, PropsWithChildren } from "react";

const TypographyH1: FC<PropsWithChildren & ComponentProps<"h1">> = ({ children, ...props }) => {
    return (
        <h1
            {...props}
            className={cn(
                "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
                props.className
            )}
        >
            {children}
        </h1>
    );
};

const TypographyH2: FC<PropsWithChildren & ComponentProps<"h2">> = ({ children, ...props }) => {
    return (
        <h2
            {...props}
            className={cn(
                "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
                props.className
            )}
        >
            {children}
        </h2>
    );
};

const TypographyH3: FC<PropsWithChildren & ComponentProps<"h3">> = ({
    children,
    className,
    ...props
}) => {
    return (
        <h3
            {...props}
            className={cn(
                "scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0",
                className
            )}
        >
            {children}
        </h3>
    );
};

const TypographyDescription: FC<PropsWithChildren & ComponentProps<"p">> = ({
    children,
    className,
    ...props
}) => {
    return (
        <p className={cn("scroll-m-20 text-sm  tracking-tight first:mt-0", className)} {...props}>
            {children}
        </p>
    );
};

export { TypographyH1, TypographyH2, TypographyH3, TypographyDescription };
