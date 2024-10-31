import { useSearchParams } from "react-router-dom";
import React from 'react';

export const EditSet = () => {
    const [searchParams] = useSearchParams();
    const setID = searchParams.get('id');
    return <></>;
}