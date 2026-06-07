import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

function Separator({
    className,
    orientation = "horizontal",
    ...props
}: SeparatorPrimitive.Props) {
    return (
        <SeparatorPrimitive
            data-slot="separator"
            orientation={orientation}
            className={cn(
                "shrink-0 bg-foreground",
                orientation === "horizontal" ? "h-0.5" : "w-0.3 self-stretch",
                className
            )}
            {...props}
        />
    );
}

export { Separator };
