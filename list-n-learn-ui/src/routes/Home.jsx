import React, {useState, useEffect} from 'react';
import { checkUser } from '../util';

export const Home = () => {
    useEffect(() => {
        const fetchUser = async () => {
            const user = localStorage.getItem('lnl-user');
            if (user) {
                if (await checkUser(user)) {
                    setUsername(user);
                    const sets = await fetch(`/sets?user=${user}`);
                    setSets(await sets.json());
                }
                else localStorage.removeItem('lnl-user');
            }
        }
        fetchUser();
    }, []);

    const [username, setUsername] = useState(null);
    const [sets, setSets] = useState([]);
    return (
        username ? <p>{sets.map(s => s.title)}</p> : <p>nah</p>
    );
}