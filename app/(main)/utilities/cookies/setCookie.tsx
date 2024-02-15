function SetCookie(name: string, value: any, days: any) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const stringValue = JSON.stringify(value);
    document.cookie = `${name}=${encodeURIComponent(stringValue)};expires=${expires.toUTCString()};path=/`;
}

export default SetCookie;
