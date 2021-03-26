import {useContext, useState} from "react";
import Block from "./Block";
import {KeyContext} from "./KeyProvider";
import Link from "./Link";
import {observer} from "mobx-react";
import TextLayer from "./TextLayer";

function App({editorStore}) {
    let keys = useContext(KeyContext);
    let [drag, setDrag] = useState(-1);
    let blockMouseDown = id => setDrag(id)
    let blockMouseUp = () => {}
    const createBlock = (x, y) => {
        if (!keys.ControlLeft) {
            return
        }
        editorStore.addBlock({
            text: `${x}:${y}`,
            position: {
                x: x,
                y: y
            },
            size: {
                width: 100,
                height: 100
            }
        })
    }
    return <>
        <svg style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0px",
            left: "0px",
            overflow: "hidden",
        }}
             onMouseMove={e => drag >= 0
                 ? editorStore.moveBlock(drag, e.clientX, e.clientY) : null}
             onMouseUp={() => setDrag(-1)}
             onClick={(e) => createBlock(e.clientX, e.clientY)}
        >
            <defs>
                <marker id='head' orient='auto'
                        markerWidth='16' markerHeight='16'
                        markerUnits="userSpaceOnUse"
                        refX='16' refY='8'>
                    <path d='M0,0 V16 L16,8 Z' fill='black'/>
                </marker>
            </defs>
            <svg>
                {editorStore.blocks.map(
                    block => block.links.map(
                        (toId, id) => <Link
                            key={toId}
                            from={editorStore.blocks[block.id]}
                            to={editorStore.blocks[toId]}/>
                    ))}
                {editorStore.blocks.map(
                    (block, id) =>
                        <Block key={id} block={block}
                               onMouseDown={blockMouseDown}
                               onMouseUp={blockMouseUp}/>)}
            </svg>
        </svg>
        <TextLayer blocks={editorStore.blocks}/>
    </>;
}

export default observer(App);
