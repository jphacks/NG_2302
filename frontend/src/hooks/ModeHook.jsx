import { useContext, createContext } from 'react';
import { ModeTypes } from '../config/ModeTypes';

export const ModeContext = createContext();

export const useModeContext = () => {
    const { mode, setMode } = useContext(ModeContext);

    const isDjMode = () => {
        return mode === ModeTypes.DJ;
    }

    const isUserMode = () => {
        return mode === ModeTypes.USER;
    }

    return { mode, setMode, isDjMode, isUserMode }
}