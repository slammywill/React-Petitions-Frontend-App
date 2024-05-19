import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";

interface ISupportTierProps {
    supportTier: SupportTier;
}

const SupportTierObject = (props: ISupportTierProps) => {
    const { supportTier } = props;

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ArrowDownward />}>
                <Typography variant="h6">{supportTier.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="subtitle1">{supportTier.description}</Typography>
                <br />
                <div style={{ alignItems: "center" }}>
                    <Typography variant="subtitle1">
                        Cost: ${supportTier.cost}.00
                    </Typography>
                </div>
            </AccordionDetails>
        </Accordion>
    );
};

export default SupportTierObject;
