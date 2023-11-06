// gatsby-browser.js
import React from 'react';
import { PageStateProvider } from './src/components/context/PageStateContext';

export const wrapRootElement = ({ element }) => (
    <PageStateProvider>{element}</PageStateProvider>
);
