import React, { useState } from 'react';
import {Dropdown} from 'react-bootstrap';
import '../../style/dropDown.css';

let DropDown = function (props) {
    let { options, defaultOption, variant, extraPadding, setSelectedOption } = props;

    // an inner state inside this component, w.r.t. that stored in an upper component, decouples this component from the upper one
    let [selectedOptionInner, setSelectedOptionInner] = useState(defaultOption);

    let maxStringLength = options.map(option => option.length).sort((length1, length2) => length2 - length1)[0];

    let fakePadding = 0.5;
    // the width is added with some padding (both to the left and to the right); 4 is approximately the width of the downward arrow
    let width = `${maxStringLength + fakePadding * 2 + 4 + extraPadding}ch`;

    return <Dropdown className='DropDown' style={{ width }}>
        <Dropdown.Toggle variant={variant} style={{ width }}>
            {selectedOptionInner}
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ width }}>
            {options.map((option, i) =>
                <Dropdown.Item key={i} onClick={() => {
                    setSelectedOptionInner(option);
                    setSelectedOption(option);
                }}
                    style={{ width }}>{option}
                </Dropdown.Item>)}
        </Dropdown.Menu>
    </Dropdown>;


}

// <DropDown options={['option1', 'option2', 'opti3', 'option4']} defaultOption={'option2'} setSelectedOption={(selectedOption) => 
//    /*  this function is called when an option is clicked; it receives the selected option as a string; */
//    console.log('option selected: ' + selectedOption)
// }/> 

export default DropDown;