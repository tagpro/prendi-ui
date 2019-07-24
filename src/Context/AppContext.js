import React, { createContext, useReducer, useState } from 'react';
const axios = require('axios');
const BASE_URL = 'http://localhost:8080/api/v1';
const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000
});

const initialContext = () => {
    return {
        save: false,
        color: 'red',
        totalClicks: 0,
        sessionClicks: 0,
    };
};

export const DISPATCH_TYPE = {
    RESET: 'reset',
    SAVE: 'save',
    SAVE_CANVAS: 'saveCanvas',
    SAVED_CANVAS: 'savedCanvas',
    UPDATE_COLOR: 'updateColor',
    INCREMENT_CLICKS: 'incrementClicks',
};

let uploadCanvas = function (dataURL) {
    // I am assuming that our service would work and will be up 100% of the time.
    // This can be improved by handling errors in the reducer and dispatching to a error handling component.
    instance.post('/entity', {
        canvas: dataURL,
    }).then(() => {
        value.dispatch({
            type: DISPATCH_TYPE.SAVED_CANVAS
        })
    }).catch(() => {
        console.error('Could not save the canvas');
        value.dispatch({
            type: DISPATCH_TYPE.SAVED_CANVAS
        })
    })
}

const reducer = (state, action) => {
    switch (action.type) {
        case DISPATCH_TYPE.RESET: {
            return initialContext;
        }
        case DISPATCH_TYPE.SAVE: {
            return {
                ...state,
                save: true
            }
        }
        case DISPATCH_TYPE.SAVE_CANVAS: {
            console.log(action.data)
            uploadCanvas(action.data.uri)
            return state
        }
        case DISPATCH_TYPE.SAVED_CANVAS: {
            return {
                ...state,
                save: false
            }
        }
        case DISPATCH_TYPE.UPDATE_COLOR: return {
            ...state,
            color: action.data.color
        }
        case DISPATCH_TYPE.INCREMENT_CLICKS: return {
            ...state,
            totalClicks: state.totalClicks + 1,
            sessionClicks: state.sessionClicks + 1,
        }
        default:
            return state;
    }
};

const PaintContext = createContext(initialContext);
let value = {};

export default function PaintContextProvider(props) {
    const [context] = useState(initialContext);
    const [state, dispatch] = useReducer(reducer, context);
    value = { state, dispatch };

    return (
        <PaintContext.Provider value={value}>
            {props.children}
        </PaintContext.Provider>
    );
}

const PaintContextConsumer = PaintContext.Consumer;

export { PaintContext, PaintContextProvider, PaintContextConsumer };