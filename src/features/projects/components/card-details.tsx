import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card/card-container";
import { Button } from "@/shared/components/ui/button";
import { ProjectDocument } from "@/shared/types/database";
import { X } from "lucide-react";

type Props = {
    open: boolean;
    onOpen: Dispatch<SetStateAction<boolean>>;
    project: ProjectDocument;
};

const MotionCard = motion.create(Card);
const MotionCardTitle = motion.create(CardTitle);

const CardDetails = ({ open, onOpen, project }: Props) => {
    const key = project._id;

    const closeCard = () => onOpen(false);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key={`overlay-${project._id}`}
                        onClick={closeCard}
                        className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    />

                    <motion.div
                        key="modal"
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4"
                    >
                        <MotionCard
                            layoutId={`card-${key}`}
                            role="dialog"
                            aria-modal="true"
                            aria-label={project.name}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            transition={{ layout: { type: "spring", stiffness: 450, damping: 40 } }}
                            className="pointer-events-auto max-h-[90vh] w-full max-w-lg overflow-y-auto pt-0"
                        >
                            <CardHeader>
                                <MotionCardTitle>{project.name}</MotionCardTitle>

                                <CardAction>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={closeCard}
                                        aria-label="Fermer"
                                    >
                                        <X />
                                    </Button>
                                </CardAction>
                            </CardHeader>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.15 } }}
                                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                className="flex flex-col gap-4"
                            >
                                <CardContent className="text-sm text-muted-foreground">
                                    <p>content en dur</p>
                                </CardContent>
                                <CardFooter className="justify-end gap-2">
                                    <Button variant="outline" onClick={closeCard}>
                                        Fermer
                                    </Button>
                                    <Button>En savoir plus</Button>
                                </CardFooter>
                            </motion.div>
                        </MotionCard>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CardDetails;
