import { useState, useEffect } from 'react';

export function useTimeout(initVal: any, endVal: any, timeout: number) {
    const [state, setState] = useState(initVal);
    useEffect(() => {
        setTimeout(() => setState(endVal), timeout);
    }, [state, endVal, timeout]);

    return state;
}