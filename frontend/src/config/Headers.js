export const withAuthHeader = (token) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
}

export const urlEncodedHeader = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}