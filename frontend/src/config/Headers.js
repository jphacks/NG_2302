export const withAuthHeader = (token) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'withCredentials': true,
            "Access-Control-Allow-Origin": "*",
        }
    }
}

export const urlEncodedHeader = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'withCredentials': true,
        "Access-Control-Allow-Origin": "*",
    }
}