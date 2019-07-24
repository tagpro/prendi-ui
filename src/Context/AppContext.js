import React, { createContext, useReducer, useState } from 'react';
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
    UPDATE_CANVAS: 'updateCanvas',
    SAVE_CANVAS: 'saveCanvas',
    UPDATE_COLOR: 'updateColor',
    INCREMENT_CLICKS: 'incrementClicks',
};


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
            console.log('action.data')
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

export default function PaintContextProvider(props) {
    const [context] = useState(initialContext);
    const [state, dispatch] = useReducer(reducer, context);
    let value = { state, dispatch };

    return (
        <PaintContext.Provider value={value}>
            {props.children}
        </PaintContext.Provider>
    );
}

const PaintContextConsumer = PaintContext.Consumer;

export { PaintContext, PaintContextProvider, PaintContextConsumer };