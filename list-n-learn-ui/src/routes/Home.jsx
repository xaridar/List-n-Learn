import React, {useState, useEffect} from 'react';
import { checkUser } from '../util';

export const Home = () => {
    useEffect(() => {
        const fetchUser = async () => {
            const user = localStorage.getItem('lnl-user');
            if (user) {
                if (await checkUser(user)) {
                    console.log(checkUser(user));
                    setUsername(user);
                }
                else localStorage.removeItem('lnl-user');
            }
        }
        fetchUser();
    }, []);

    const [username, setUsername] = useState(null);
    const [cards, setCards] = useState([]);
    return (
        username ? <p>{username}</p> : <p>nah</p>
    );
}