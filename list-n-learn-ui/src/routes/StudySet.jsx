import { useSearchParams } from "react-router-dom";
import React from 'react';

export const StudySet = () => {
    const [searchParams] = useSearchParams();
    const setID = searchParams.get('id');
    const starred = searchParams.get('starred') === 'true';
    return <></>;
}