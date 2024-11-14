import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { FullFlashcard } from '../components/FullFlashcard';
import EditSet from './EditSet';
import ( EditSet)

export const NewSet = () => {
    const [searchParams] = useSearchParams();
    const setID = searchParams.get('id');
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [cards, setCards] = useState([]);
    const [description, setDescription] = useState('');
}