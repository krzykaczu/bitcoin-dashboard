import React, { useEffect, useState, useRef, SyntheticEvent } from 'react';
import NewsFeed from '../../components/news-feed';
import Container from '../../components/container';
import { withResizeDetector } from 'react-resize-detector';
import { ENDPOINTS, convertURL } from '../../utils/endpoint';
import { ResizeDetectorChartProps } from '../interfaces';
import { useFetch } from '../../hooks';
import { get, isNull, isEmpty } from 'lodash-es';
import { newsDataFormatter } from '../../utils/formatter';
import { NewsItem } from '../../components/news-feed/news-feed';
import { Map } from 'immutable';
import Loader from '../../components/loader';
// import useInfiniteScroll from '../../hooks/useInfiniteScroll';

export interface State {
    current: string;
    count: number;
    next: string;
    previous: string;
    results: NewsItem[];
}

const initialState: Map<string, State[keyof State]> = Map({
    current: ENDPOINTS.NEWS,
    count: null,
    next: null,
    previous: null,
    results: [],
});

const BitcoinNewsFeed = ({ width, height }: ResizeDetectorChartProps) => {
    const [state, setState] = useState(initialState);

    const [fetchingResult, fetchingError] = useFetch((state.toJS() as State).current, newsDataFormatter);

    const bottomBoundaryRef = useRef<HTMLDivElement>(null);
    // useInfiniteScroll(bottomBoundaryRef, setState, state.set('current', state.get('next')));

    useEffect(() => {
        if (!isNull(fetchingResult) && get(state.toJS(), ['results']).length <= 40) {
            const convertedFetchingResult = {
                // ...((fetchingResult as unknown) as State),
                current: state.get('current'),
                count: fetchingResult.count,
                results: [...(state.get('results') as NewsItem[]), ...fetchingResult.results],
                next: ((fetchingResult as unknown) as State).next
                    ? convertURL(((fetchingResult as unknown) as State).next)
                    : null,
                previous: ((fetchingResult as unknown) as State).previous
                    ? convertURL(((fetchingResult as unknown) as State).previous)
                    : null,
            };

            /*setState(state.merge(convertedFetchingResult));*/
            setState(Map(convertedFetchingResult));
        }
    }, [fetchingResult]);

    /*const previousHandler = (e: SyntheticEvent) => {
        e.stopPropagation();
        setState(state.set('current', state.get('previous')));
    };*/

    const nextHandler = (e: SyntheticEvent) => {
        e.stopPropagation();
        setState(state.set('current', state.get('next')));
    };

    return (
        <Container ref={bottomBoundaryRef} width={width} height={height}>
            <h1>News</h1>
            {console.log(get(state.toJS(), ['results']))}
            {console.log(get(state.toJS(), ['results']).length)}
            {fetchingError && <p className="error">{fetchingError}</p>}
            {!isEmpty(get(state.toJS(), ['results'])) ? (
                <NewsFeed results={(get(state.toJS(), ['results']) as unknown) as NewsItem[]} />
            ) : (
                <Loader />
            )}
            {/*<button onClick={previousHandler}>Previous</button>*/}
            <button onClick={nextHandler}>Next</button>
        </Container>
    );
};

export default withResizeDetector(BitcoinNewsFeed);
