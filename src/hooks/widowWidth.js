import { useState, useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';

function useWindowWidth() {
    const initialWidth = isBrowser ? window.innerWidth : 0;
    const [windowWidth, setWindowWidth] = useState(initialWidth);

    useEffect(() => {
        if (!isBrowser) return;
        const handleResize = () => {
            setWindowWidth(isBrowser ? window.innerWidth : 0);
        };

        window.addEventListener('resize', handleResize);
        { console.log("windowWidth") }
        { console.log(windowWidth) }
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowWidth;
}

export default useWindowWidth;
