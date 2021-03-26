import {observer} from "mobx-react";

function BlockText({id, block}) {
    return <div
        style={{
            position: "absolute",
            top: block.position.y,
            left: block.position.x,
            display: "block",
            color: "black",
            width: block.size.width,
            height: block.size.height,
            overflow: "hidden"
        }}>
        {block.text}
    </div>;
}

export default observer(BlockText);
