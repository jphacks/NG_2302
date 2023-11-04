// JavaScriptでEnumを定義したいがないので、
// Object.freezeを使うことで読み取り専用にする。
export const ModeTypes = Object.freeze({
    DJ: "dj",
    USER: "user"
})