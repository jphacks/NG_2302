import { useState, createContext } from "react";

// Contextオブジェクトを生成する
export const ModeContext = createContext();

// ModeProviderで囲んだ範囲が再レンダリングされるので、
// 影響範囲に気を付ける。
// 生成したContextオブジェクトのProviderを定義する
export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState(0)

    return (
        <ModeContext.Provider value={{
            mode,
            setMode
        }}>
            {children}
        </ModeContext.Provider>
    );
}