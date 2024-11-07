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

    // Fetch set data on component mount
    useEffect(() => {
        const getSet = async () => {
            try {
                const res = await fetch(`/set?id=${setID}`);
                const data = await res.json();
                setTitle(data.title || '');
                setCards(data.cards || []);
                setDescription(data.description || '');
            } catch (error) {
                console.error('Error fetching set:', error);
            }
        };
        getSet();
    }, [setID]);

    // Handle input changes for title
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
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

        try {
            const response = await fetch('/set', {
                method: 'POST',
                body: JSON.stringify(updatedSet),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();
            if (json.success) {
                toast.success('Set saved');
                navigate(`/view?id=${setID}`);
            } else {
                toast.error('Set has not been saved');
            }
        } catch (error) {
            console.error('Error saving set:', error);
            toast.error('Failed to save changes');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="title-input"
                placeholder="Set Title"
            />
            <div></div>
            <input
                value={description}
                onChange={handleDescriptionChange}
                className="description-input"
                placeholder="Set Description"
                rows={4}
            />
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
