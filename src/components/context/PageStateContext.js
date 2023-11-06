// src/context/PageStateContext.js

import React, { createContext, useState } from 'react';

export const PageStateContext = createContext();

export const PageStateProvider = ({ children }) => {
    const [pageState, setPageState] = useState('entering');

    const setPageEntering = () => {
        setPageState('entering');
    };

    const setPageActive = () => {
        setPageState('active');
    };

    const setPageExiting = () => {
        setPageState('exiting');
    };

    return (
        <PageStateContext.Provider
            value={{
                pageState,
                setPageEntering,
                setPageActive,
                setPageExiting,
            }}
        >
            {children}
        </PageStateContext.Provider>
    );
};
