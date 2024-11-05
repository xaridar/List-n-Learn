import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { FullFlashcard } from '../components/FullFlashcard';

export const EditSet = () => {

    const [searchParams] = useSearchParams();
    const setID = searchParams.get('id');
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [cards, setCards] = useState([]);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const getSet = () => {
            console.log(setID);
            fetch(`/set?id=${setID}`)
                .then(res => res.json())
                .then(res => {
                    console.log(res.cards);
                    setTitle(res.title || '');
                    setCards(res.cards || []);
                    setDescription(res.description || '');
                }) 
                .catch(error => {
                    console.error('Error fetching set:', error);
                });
        };
        getSet();
    }, [setID]);



    // Handle input changes for title
    const handleTitleChange = (e) => {
        setTitle(e.target.textContent);
    };

    // Save changes to the backend
    const handleSave = async () => {
        const updatedSet = {
            id: setID,
            title,
            cards,
            description
        };
        console.log(updatedSet);

        const response = await fetch('/set', {
            method: 'POST',
            body: JSON.stringify(updatedSet),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        const json = await response.json();

        if(json.success) {
            toast.success('Set saved');
            navigate(`/view?id=${setID}`);
        }
        else {
            toast.error('Set has not been saved');
        }
    };

    return (
        <div>
            <h1 className='title' contentEditable suppressContentEditableWarning={true} onInput={handleTitleChange}>{title}</h1>
            {cards.map((c, i) => (<FullFlashcard
                            editable 
                            onTermInput = {(e) => {
                                setCards(cards => {
                                    cards[i].term = (e.target.textContent);
                                    return cards;
                                })
                            }}term={c.term} 
                            onDefInput = {(e) => {
                                setCards(cards => {
                                    cards[i].definition = (e.target.textContent);
                                    return cards;
                                })
                            }}
                            definition={c.definition} 
                            key={c._id}></FullFlashcard>
            ))}
            <button onClick={handleSave} className='save-button'>
                Save Changes
            </button>
        </div>
    );
};

export default EditSet;
