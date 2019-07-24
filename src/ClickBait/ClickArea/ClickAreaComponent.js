import React, { useRef, useEffect, useContext } from 'react';
import { PaintContext, DISPATCH_TYPE } from './../../Context/AppContext';
import './ClickArea.css'
let lastStroke = [];

export default function ClickAreaComponent(props) {
    let canvasRef = useRef(null);
    let sketchRef = useRef(null);
    let { state, dispatch } = useContext(PaintContext);
    // Initialize canvas before using other effects
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

    // Load the canvas from the server
    useEffect(() => {
        if (state.baseURL != null) {
            let myCanvas = canvasRef.current;
            if (myCanvas) {
                var ctx = myCanvas.getContext('2d');
                var img = new Image();
                img.src = state.baseURL;
                img.onload = function () {
                    ctx.drawImage(img, 0, 0); // Or at whatever offset you like
                };
            }
        }
    }, [state.baseURL]);

    // Clear the drawing board
    useEffect(() => {
        if (state.clear) {
            let myCanvas = canvasRef.current;
            if (myCanvas) {
                var ctx = myCanvas.getContext('2d');
                // Hack to clear the canvas
                // eslint-disable-next-line no-self-assign
                ctx.canvas.width = ctx.canvas.width;
                dispatch({ type: DISPATCH_TYPE.CLEARED});
            }
        }
    }, [state.clear])

    // Change the color in canvas
    useEffect(() => {
        let canvas = canvasRef.current;
        if (canvas) {
            let ctx = canvas.getContext('2d');
            ctx.strokeStyle = state.color;
        }
    }, [state.color, state.clear])

    function interpolate(x1, y1, x2, y2) {
        let numOfPoints = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        let points = [];
        let xInc = (x2 - x1) / numOfPoints;
        let yInc = (y2 - y1) / numOfPoints;
        for(let i = 0; i < numOfPoints; i++) {
            x1 += xInc;
            y1 += yInc;
            points.push([Math.round(x1), Math.round(y1)])
        }
        return points;
    }
    function rootPoint(x, y) {
        return [x - 2 < 0 ? 0 : x - 2, y - 2 < 0 ? 0 : y - 2, 4, 4]
    }
    // Undo last stroke
    /**
     * I am using clearRect to remove all the points from the last stroke.
     * The issue is that stroke my not contain all the points in the path.
     * So, I am using interpolation to get all the points between two points.
     */
    useEffect(() => {
        if(state.undo) {
            let canvas = canvasRef.current;
            // TODO:
            if (canvas) {
                let ctx = canvas.getContext('2d');
                let lastPoint = []
                for (let point of lastStroke) {
                    ctx.clearRect(...rootPoint(point[0], point[1]))
                    if (lastPoint.length) {
                        let points = interpolate(lastPoint[0], lastPoint[1], point[0], point[1]);
                        for (let interPoint of points) {
                            ctx.clearRect(...rootPoint(interPoint[0], interPoint[1]))
                        }
                    }
                    lastPoint = point;
                }
            }
            dispatch({type: DISPATCH_TYPE.UNDO_COMPLETE});
        }
    }, [state.undo])

    return (
        <div ref={sketchRef} id="sketch">
            <canvas ref={canvasRef} id="paint"></canvas>
        </div>
    )
}

function useCanvas(canvasRef, sketchRef, dispatch) {
    useEffect(() => {
        let path;
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
            path = ctx.beginPath();
            lastStroke = [];
            dispatch({ type: DISPATCH_TYPE.INCREMENT_CLICKS });
            ctx.moveTo(mouse.x, mouse.y);

            canvas.addEventListener('mousemove', updatePaint, false);
        }, false);

        canvas.addEventListener('mouseup', function () {
            ctx.closePath();
            canvas.removeEventListener('mousemove', updatePaint, false);
        }, false);

        let updatePaint = function () {
            onPaint(ctx, mouse);
        }

    }, [])
    var onPaint = function (ctx, mouse) {
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        lastStroke = [...lastStroke, [mouse.x, mouse.y]];
    };

    return lastStroke;
}