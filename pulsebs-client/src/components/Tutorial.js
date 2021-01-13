import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import '../style/App.css';
import '../style/customStyle.css';


class Tutorial extends React.Component {

    render() {
        return this.props.on === true ?
        <OverlayTrigger
            delay={1100}
            overlay={
                <Popover>
                    <Popover.Content>
                        {this.props.text}
                    </Popover.Content>
                </Popover>
            }
        >
            {/* The div here is strictly necessary for the OverlayTrigger to work */}
            <div>{this.props.push}</div>
        </OverlayTrigger>
        :
        <>{this.props.push}</>
    }
}

export default Tutorial;