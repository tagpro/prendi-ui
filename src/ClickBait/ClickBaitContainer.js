import React from 'react';
import ClickPanelComponent from './ClickPanel/ClickPanelComponent';
import ClickAreaComponent from './ClickArea/ClickAreaComponent';

import './ClickBait.css';

export default function ClickBaitContainer() {
    return (
        <div>
            <div className="click-panel">
                <ClickPanelComponent></ClickPanelComponent>
            </div>
            <div className="click-area">
                <ClickAreaComponent></ClickAreaComponent>
            </div>
        </div>
    )
}