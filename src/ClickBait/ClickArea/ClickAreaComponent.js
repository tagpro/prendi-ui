import React, { useRef, useEffect, useContext } from 'react';
import { PaintContext, DISPATCH_TYPE } from './../../Context/AppContext';
import './ClickArea.css'
let lastStroke = [];

export default function ClickAreaComponent(props) {
    let canvasRef = useRef(null);
    let sketchRef = useRef(null);
    let { state, dispatch } = useContext(PaintContext);
    useCanvas(canvasRef, sketchRef, dispatch);
    useEffect(() => {
        if (state.save) {
            dispatch({
                type: DISPATCH_TYPE.SAVE_CANVAS,
                data: {
                    uri: canvasRef.current.toDataURL()
                }
            });
        }
    }, [state.save])

    useEffect(() => {
        let canvas = canvasRef.current;
        if (canvas) {
            let ctx = canvas.getContext('2d');
            ctx.strokeStyle = state.color;
        }
    }, [state.color])
    return (
        <div ref={sketchRef} id="sketch">
            <canvas ref={canvasRef} id="paint"></canvas>
        </div>
    )
}

function useCanvas(canvasRef, sketchRef, dispatch) {
    useEffect(() => {
        let canvas = canvasRef.current;
        var ctx = canvas.getContext('2d');

        canvas.width = sketchRef.current.clientWidth - 10;
        canvas.height = sketchRef.current.clientHeight - 10;

        var mouse = { x: 0, y: 0 };

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function (e) {
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);

        /* Drawing on Paint App */
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.strokeStyle = "red";
        function getColor(colour) { ctx.strokeStyle = colour; }


        //ctx.strokeStyle =
        //ctx.strokeStyle = document.settings.colour[1].value;
        canvas.addEventListener('mousedown', function (e) {
            ctx.beginPath();
            lastStroke = [];
            dispatch({ type: DISPATCH_TYPE.INCREMENT_CLICKS });
            ctx.moveTo(mouse.x, mouse.y);

            canvas.addEventListener('mousemove', updatePaint, false);
        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', updatePaint, false);
            console.log(lastStroke)
        }, false);

        let updatePaint = function () {
            onPaint(ctx, mouse);
        }

    }, [])
    var onPaint = function (ctx, mouse) {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        lastStroke = [...lastStroke, mouse];
    };

    return lastStroke;
}