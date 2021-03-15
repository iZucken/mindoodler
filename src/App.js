import {useState, useEffect} from "react";

function App() {
    let [drag, setDrag] = useState(false);
    let [hover, setHover] = useState(false);
    let [keys, setKeys] = useState({init: true});
    let [position, setPosition] = useState({x: 50, y: 50});
    let handleKey = e => {
        setKeys({...keys, [e.code]: true})
    }
    let handleKeyRelease = e => {
        setKeys({...keys, [e.code]: false})
    }
    useEffect(() => {
        document.addEventListener("keydown", handleKey, false)
        document.addEventListener("keyup", handleKeyRelease, false)
        return () => {
            document.removeEventListener("keydown", handleKey, false)
            document.removeEventListener("keyup", handleKeyRelease, false)
        }
    });

    return <svg width="10000" height="10000"
                onMouseMove={e => drag ? setPosition({
                    x: e.clientX,
                    y: e.clientY,
                }) : null}
                onMouseUp={() => setDrag(false)}>
        <text x={position.x} y={position.y} style={{color: "black"}}>
            {Object.entries(keys)
                .filter(([k, v]) => v)
                .map(([k, v]) => k)
                .join()}
        </text>
        <g>
            <rect x={position.x} y={position.y} width="100" height="100"
                  style={{
                      fill: "rgba(200,200,200,1)",
                      stroke: "rgba(50,50,50,1)",
                      strokeWidth: hover ? 4 : 2
                  }}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  onMouseDown={() => setDrag(true)}/>
        </g>
    </svg>;
}

export default App;
