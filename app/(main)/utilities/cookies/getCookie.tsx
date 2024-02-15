function GetCookie(name: string) {
    const cookieValue = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`));

    if (cookieValue) {
        const decodedValue = decodeURIComponent(cookieValue.split('=')[1]);
        return JSON.parse(decodedValue);
    }

    return null;
}

export default GetCookie;
