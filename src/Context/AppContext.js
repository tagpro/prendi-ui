import React, { createContext, useReducer, useState, useEffect } from 'react';
const axios = require('axios');
const BASE_URL = 'http://localhost:8080/api/v1';
const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const initialContext = () => {
    return {
        save: false,
        color: 'red',
        totalClicks: 0,
        sessionClicks: 0,
        baseURL: null
    };
};

export const DISPATCH_TYPE = {
    RESET: 'reset',
    SAVE: 'save',
    SAVE_CANVAS: 'saveCanvas',
    SAVED_CANVAS: 'savedCanvas',
    LOAD_CANVAS: 'loadCanvas',
    UPDATE_COLOR: 'updateColor',
    INCREMENT_CLICKS: 'incrementClicks',
    CLEAR: 'clear',
    CLEARED: 'cleared',
    UNDO: 'undo',
    UNDO_COMPLETE: 'undoed',
};

let loadCanvas = function () {
    instance.get('/entity').then((res) => {
        value.dispatch({
            type: DISPATCH_TYPE.LOAD_CANVAS,
            data: res.data
        });
    }).catch((error) => {
        alert('Could not load canvas from server. Please see if the backend server is up and running.');
    })
}

let uploadCanvas = function (dataURL) {
    // I am assuming that our service would work and will be up 100% of the time.
    // This can be improved by handling errors in the reducer and dispatching to a error handling component.
    instance.post('/entity', {
        canvas: dataURL,
        clickcount: value.state.totalClicks
    }).then(() => {
        value.dispatch({
            type: DISPATCH_TYPE.SAVED_CANVAS
        })
    }).catch(() => {
        alert('Could not save the canvas. Please see if the backend server is up and running.');
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
            // console.log(action.data)
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
        case DISPATCH_TYPE.INCREMENT_CLICKS:

            return {
                ...state,
                totalClicks: state.totalClicks + 1,
                sessionClicks: state.sessionClicks + 1,
            }
        case DISPATCH_TYPE.LOAD_CANVAS: {
            return {
                ...state,
                baseURL: action.data.canvas,
                totalClicks: action.data.clickcount || 0,
            }
        }
        case DISPATCH_TYPE.CLEAR:
            return {
                ...state,
                clear: true
            }
        case DISPATCH_TYPE.CLEARED:
            return {
                ...state,
                clear: false,
                totalClicks: 0,
                sessionClicks: 0,
            }
        case DISPATCH_TYPE.UNDO:
            return {
                ...state,
                undo: true
            }

        case DISPATCH_TYPE.UNDO_COMPLETE:
            return {
                ...state,
                undo: false
            }
        default:
            return state;
    }
};

const PaintContext = createContext(initialContext);

// Value of context provider
let value = {};

export default function PaintContextProvider(props) {
    const [context] = useState(initialContext);
    const [state, dispatch] = useReducer(reducer, context);
    value = { state, dispatch };
    useEffect(() => {
        loadCanvas();
    }, [])
    return (
        <PaintContext.Provider value={value}>
            {props.children}
        </PaintContext.Provider>
    );
}

const PaintContextConsumer = PaintContext.Consumer;

export { PaintContext, PaintContextProvider, PaintContextConsumer };