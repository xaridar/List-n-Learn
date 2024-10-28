export const checkUser = async (username) => {
    const res = await fetch(`/user?name=${username}`);
    const json = await res.json();
    return Object.keys(json).length !== 0;
}