export const customTextField = {
    mt: 1,
    mb: 1,
    '& .MuiInputBase-input': {
        color: '#fff',    // 入力文字の色
    },
    '& label': {
        color: '#fff', // 通常時のラベル色
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: '#fff', // 通常時のボーダー色
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: '#fff',  // ホバー時のボーダー色
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#fff',    // 通常時のボーダー色(アウトライン)
            
        },
        '&:hover fieldset': {
            borderColor: '#b8c1ec',    // ホバー時のボーダー色(アウトライン)
        },
    },
}