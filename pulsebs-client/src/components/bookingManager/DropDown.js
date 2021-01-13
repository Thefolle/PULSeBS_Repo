import React from 'react';
import '../../style/DropDown.css';
import { Form } from "react-bootstrap";


const DropDown = function (props) {
    let {options,update}=props;

    const setOptionandValue=(event)=>{
       update(event.target.value);
    }

    return(
        <>
        <Form.Control as="select" custom onChange={setOptionandValue}>
            {options.map((o,id)=><option key={id} value={o}>{o===-1?"All":o}</option>)}
        </Form.Control>
        </>
    );


}


export default DropDown;