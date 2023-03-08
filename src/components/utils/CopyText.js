import React, {useState} from "react";
import * as Icon from "react-bootstrap-icons";

function CopyText(props) {

    const [isCopied, setIsCopied] = useState(false);

    const iconStyle = {
        'cursor': 'pointer',
        'verticalAlign': 'bottom !important',
        'marginBottom': '.25em'
    };

    const copy = () => {
        navigator.clipboard.writeText(props.text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
    }

    return (
        <div style={{'fontSize': '1.2em', 'padding': '0px 2px'}}>
            {isCopied === false ?
                <Icon.Clipboard2 onClick={() => copy()} style={iconStyle}/>:
                <Icon.Clipboard2CheckFill style={iconStyle}/>
            }
            <span style={{'fontSize': '1em', 'marginLeft': '5px'}}>{ props.displayText === true && (props.text) }</span>
        </div>
    );
}

export default CopyText;
