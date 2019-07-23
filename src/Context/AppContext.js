import React, { createContext, useReducer, useState } from 'react';
const initialContext = () => {
    return {};
};

export const DISPATCH_TYPE = {
    RESET: 'reset'
};


const reducer = (state, action) => {
    switch (action.type) {
        case DISPATCH_TYPE.RESET: {
            return initialContext;
        }
        default:
            return state;
    }
};

const ExplorerContext = createContext(initialContext);

export default function ExplorerContextProvider(props) {
    const [context] = useState(initialContext);
    const [state, dispatch] = useReducer(reducer, context);
    let value = { state, dispatch };

    return (
        <ExplorerContext.Provider value={value}>
            {props.children}
        </ExplorerContext.Provider>
    );
}

const ContextOneConsumer = ExplorerContext.Consumer;

export { ExplorerContext, ExplorerContextProvider, ContextOneConsumer };