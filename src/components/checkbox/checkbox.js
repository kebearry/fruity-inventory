import "./checkbox.scss";
import React, { useEffect, useState } from 'react';
function Checkbox(props) {
    const [isChecked, setIsChecked] = useState(false);
    const toggleCheck = () => {
        setIsChecked(!isChecked);
    }

    useEffect(() => {
        const checkboxList = document.getElementsByClassName("control--checkbox");
        for (let i = 0; i < checkboxList.length; i++) {
            checkboxList[i].firstElementChild.id = "checkBtn-" + (i + 1);
        }
        setIsChecked(props.checked === "checked" ? true : false);
    }, []);

    return (
        <label className="control control--checkbox">{props.label}
            <input type="checkbox" checked={isChecked} onChange={toggleCheck} />
            <div className="control__indicator"></div>
        </label>
    )
}
export default Checkbox;