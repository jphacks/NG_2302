import { useState } from "react";
import { TextField } from "@mui/material";
import { VolumeMeter } from "../components/VolumeMeter";
import { customTextField } from "../styles/CustomTextField";
import { Dictaphone } from "../components/Dictaphone";

export const Test = () => {
    const [multiplier, setMultiplier] = useState(3000);

    return (
        <>
            <TextField
                id="multiplier"
                sx={customTextField}
                label="倍率"
                type="number"
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        const num = event.target.value;
                        setMultiplier(num); 
                    }
                }}
            />
            <Dictaphone />
            <VolumeMeter multiplier={multiplier} />
        </>
    );
}