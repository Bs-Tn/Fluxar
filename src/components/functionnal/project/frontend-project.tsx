import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card/card-container";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";

const FrontendProject = () => {
    return (
        <section className="pt-4">
            <TypographyH2>Projet Frontend</TypographyH2>
            <div>
                <Card className="w-full max-w-sm ">
                    <CardHeader>
                        <CardTitle>
                            <TypographyH3>Gestion Client</TypographyH3>
                        </CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent></CardContent>
                </Card>
            </div>
        </section>
    );
};

export { FrontendProject };
