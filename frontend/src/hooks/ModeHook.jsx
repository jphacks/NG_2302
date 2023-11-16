import { ModeTypes } from '../config/ModeTypes';

export class ModeStorage {
    constructor() {
        this.mode = sessionStorage.getItem('mode');
    }

    setMode = (mode) => {
        sessionStorage.setItem('mode', mode);
    }

    isDjMode = () => {
        return this.mode === ModeTypes.DJ;
    }

    isUserMode = () => {
        return this.mode === ModeTypes.USER;
    }
}