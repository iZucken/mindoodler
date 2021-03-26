import {observer} from "mobx-react";
import SvgRender from "./SvgRender";
import {useState} from "react";

function Link({from, to}) {
    let [hover, setHover] = useState(false);
    return <>
        <path
            d={SvgRender.line(from.position, to.position)}
            strokeWidth={16}
            stroke='white'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        />
        <path
            d={SvgRender.line(from.position, to.position)}
            strokeWidth={hover ? 4 : 2}
            stroke='black'
            markerEnd='url(#head)'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        />
    </>;
}

export default observer(Link);
