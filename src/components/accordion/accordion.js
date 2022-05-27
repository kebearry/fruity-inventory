import "./accordion.scss";
import Checkbox from "../checkbox/checkbox";
import React, { useEffect } from 'react';

function Accordion(props) {
    const items = document.querySelectorAll(".accordion button");
    
    const toggleAccordion = function () {
        const itemToggle = this.getAttribute('aria-expanded');
        if (itemToggle === 'true') this.setAttribute('aria-expanded', 'false');
        if (itemToggle === 'false') this.setAttribute('aria-expanded', 'true');
    }

    const toBeChecked = (data) => {
        return data.accdata.length <= 1 || data.title === "Category" || data.title === "Subcategory" ? "checked" : "unchecked"
    }

    useEffect(() => {
        const accordionBtnList = document.getElementsByClassName('accordion-item__btn');
        for (let i = 0; i < accordionBtnList.length; i++) {
            accordionBtnList[i].id = "accBtn-" + (i + 1);
        }
        accordionBtnList[0].setAttribute('aria-expanded', 'true')
    }, []);

    items.forEach(item => item.addEventListener('click', toggleAccordion));
    return (

        <div className="accordion-item">
            <button className="accordion-item__btn" role="button" aria-expanded="false"><span className="accordion-title">{props.title}</span><span className="icon" aria-hidden="true"></span></button>
            <div className="accordion-content" role="region">
                {
                    props.accdata.map((data, index) => {
                        return <Checkbox key={index} label={data} checked={toBeChecked(props)} />
                    })
                }
            </div>
        </div>
    );
}
export default Accordion;