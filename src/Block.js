import {useState} from "react";
import {observer} from "mobx-react";

function Block({block, onMouseDown, onMouseUp}) {
    let [hover, setHover] = useState(false);
    return <rect
        x={block.position.x}
        y={block.position.y}
        width={block.size.width}
        height={block.size.height}
        style={{
            fill: "rgba(200,200,200,1)",
            stroke: "rgba(50,50,50,1)",
            strokeWidth: hover ? 4 : 2
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseDown={() => onMouseDown(block.id)}
        onMouseUp={() => onMouseUp(block.id)}
    />;
}

export default observer(Block);
