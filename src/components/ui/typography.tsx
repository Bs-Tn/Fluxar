import { ComponentProps, FC, PropsWithChildren } from "react";

const TypographyH1: FC<PropsWithChildren & ComponentProps<"h1">> = ({
    children,
    ...props
}) => {
    return (
        <h1
            className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance"
            {...props}
        >
            {children}
        </h1>
    );
};

const TypographyH2: FC<PropsWithChildren & ComponentProps<"h2">> = ({
    children,
    ...props
}) => {
    return (
        <h2
            className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0"
            {...props}
        >
            {children}
        </h2>
    );
};

const TypographyH3: FC<PropsWithChildren & ComponentProps<"h3">> = ({
    children,
    ...props
}) => {
    return (
        <h2
            className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0"
            {...props}
        >
            {children}
        </h2>
    );
};

export { TypographyH1, TypographyH2, TypographyH3 };
