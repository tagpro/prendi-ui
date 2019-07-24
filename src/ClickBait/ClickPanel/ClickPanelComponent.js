import React, { useState, useContext } from 'react';
import './ClickPanel.css';
import { PaintContext, DISPATCH_TYPE } from '../../Context/AppContext';

export default function ClickPanelComponent() {
    let { state, dispatch } = useContext(PaintContext);

    const selectedText = function (event) {
        dispatch({
            type: DISPATCH_TYPE.UPDATE_COLOR,
            data: {
                color: event.target.value
            }
        });
    }

    const save = function () {
        dispatch({ type: DISPATCH_TYPE.SAVE });
    }

    const clear = function () {
        dispatch({ type: DISPATCH_TYPE.CLEAR });
    }

    const undo = function () {
        dispatch({ type: DISPATCH_TYPE.UNDO });
    }
    return (
        <div>
            <div className="panel-wrapper">
                <div className="panel-color-selector">
                    Choose your Color
                    <select value={state.color} onChange={selectedText}>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                        <option value="black">Black</option>
                    </select>
                </div>
                <div className="panel-save">
                    <button onClick={save}>Save</button>
                    <button onClick={clear}>Clear</button>
                    <button onClick={undo}>Undo</button>
                </div>
                <div className="panel-click-counter">
                    <div>
                        <span>Total Clicks: {state.totalClicks}</span>
                    </div>
                    <div>
                        <span>Clicks in this session: {state.sessionClicks}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}