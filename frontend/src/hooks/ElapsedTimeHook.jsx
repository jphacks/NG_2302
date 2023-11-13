import { useRef, useState } from "react";

export const useElapsedTime = ({maxTime}) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef(null);

    const runTimerAction = ({onAction}) => {
        if (intervalRef.current !== null) return;

        intervalRef.current = setInterval(() => {
            setElapsedTime(prevTime => {
                if (prevTime >= maxTime) {
                    onAction();

                    // 経過時間リセット
                    return 0;
                }
                // インクリメント
                return prevTime + 1;
            });
        }, 1000);
    }

    const timerReset = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setElapsedTime(0);
    }

    return {elapsedTime, setElapsedTime, runTimerAction, timerReset}
}