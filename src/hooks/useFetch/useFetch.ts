import { useEffect } from 'react';
import reducer from '../useThunkReducer/reducer';
import initialState from '../initialState';

import useThunkReducer from '../useThunkReducer';
import fetchData from './fetchData';

const useFetch = () => {
    const [state, enhancedDispatch] = useThunkReducer(reducer, initialState);

    useEffect(() => {
        fetchData(enhancedDispatch);
    }, [fetchData, enhancedDispatch]);

    const { result, loading, error } = state;

    return [result, loading, error];
};

export default useFetch;
