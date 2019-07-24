import React, {useState, useContext} from 'react';
import './ClickPanel.css';
import { PaintContext, DISPATCH_TYPE } from '../../Context/AppContext';

export default function ClickPanelComponent() {
    let [clicks, setClicks] = useState(0);
    let [sessionClicks, setSessionClicks] = useState(0);
    let {state, dispatch} = useContext(PaintContext);

    let selectedText = function(event) {
        dispatch({
            type: DISPATCH_TYPE.UPDATE_COLOR,
            data: {
                color: event.target.value
            }
        });
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
                    <button>Save</button>
                    <button>Undo</button>
                </div>
                <div className="panel-click-counter">
                    <div>
                        <span>Total Clicks: {clicks}</span>
                    </div>
                    <div>
                        <span>Clicks in this session: {sessionClicks}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}