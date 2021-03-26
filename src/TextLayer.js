import BlockText from "./BlockText";
import {observer} from "mobx-react";
import {KeyContext} from "./KeyProvider";
import {useContext} from "react";

function TextLayer({blocks}) {
    const keys = useContext(KeyContext)
    return <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "0px",
        left: "0px",
        overflow: "hidden",
        pointerEvents: "none"
    }}>
        {Object.entries(keys)
            .filter(([k, v]) => v)
            .map(([k, v]) => k)
            .join()}
        {blocks.map(
            (block, id) => <BlockText key={id} id={id} block={block}/>)
        }
    </div>;
}

export default observer(TextLayer);
