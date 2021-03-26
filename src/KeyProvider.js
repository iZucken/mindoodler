import {useState, useEffect, createContext} from "react";

export const KeyContext = createContext({})

function KeyProvider({children}) {
    let [keys, setKeys] = useState({init: true});
    let handleKey = e => {
        setKeys({...keys, [e.code]: true})
    }
    let handleKeyRelease = e => {
        setKeys({...keys, [e.code]: false})
    }
    let handleBlur = () => {
        setKeys({})
    }
    useEffect(() => {
        window.addEventListener("keydown", handleKey, false)
        window.addEventListener("keyup", handleKeyRelease, false)
        window.addEventListener('blur', handleBlur);
        return () => {
            window.removeEventListener("keydown", handleKey, false)
            window.removeEventListener("keyup", handleKeyRelease, false)
            window.removeEventListener('blur', handleBlur);
        }
    });
    return <KeyContext.Provider value={keys}>
        {children}
    </KeyContext.Provider>
}

export default KeyProvider;
