import React from 'react';
import API from '../API/API';
import { withRouter, Switch, Route } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import UserNavBar from './UserNavBar';

import '../App.css';
import '../customStyle.css';
import Container from 'react-bootstrap/Container';
import BookingsStats from './BookingsStats';
import CancellationsStats from './CancellationsStats';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class BookingManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings:[],
            cancellations: [],
            attendances: []
        };
    }

    componentDidMount() {
        API.getAllBookings()
            .then((bookings) => {
                this.setState({bookings:bookings});
                this.setState({attendances:bookings.filter(x=>x.absent===0)});
                 })
            .catch((err) => {
                this.handleErrors(err);
        });

        API.getAllCancellations()
            .then((cancellations)=>{
                this.setState({cancellations:cancellations});
                }).catch((err) => {
                    this.handleErrors(err);
        });
    }

    handleErrors = (err) => {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({ authErr: err });
                this.props.history.push("/");
            } else {
                //other errors that may happens and choose the page in which are displayed
                this.setState({ authErr: err });
            }
        }
        console.log("Error occured. Check the handleErrors method in BookingManager.");
        console.log(err);
    }

    

     render() {

        return (
            <AuthContext.Consumer>
                {(context) => (
                    <>
                        {context.authUser && <>
                            <UserNavBar userId={context.authUser.id} />
                            <Container>
                                <Row>
                                    <Col sm={3} id="left-sidebar" className="collapse d-sm-block below-nav">
                                        <ListGroup className="sidebar" variant="flush" >
                                            <h5>POLITECNICO DI TORINO</h5>
                                            <ListGroup.Item className="listGroup-Item"> {context.authUser.name}</ListGroup.Item>
                                            <ListGroup.Item className="listGroup-Item"> {context.authUser.surname}</ListGroup.Item>
                                            <ListGroup.Item className="listGroup-Item"> {context.authUser.id}</ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col sm={8}>
                                        <Switch>
                                            <Route exact path={"/manager/allStats"}>
                                                <BookingsStats bookings={this.state.bookings} type={1}/>
                                                <CancellationsStats cancellations={this.state.cancellations}/>
                                                <BookingsStats bookings={this.state.attendances} type={0}/>
                                            </Route>
                                            <Route exact path={"/manager/bookings"}>
                                                <BookingsStats bookings={this.state.bookings} type={1}/>
                                            </Route>
                                            <Route exact path={"/manager/cancellations"}>
                                                <CancellationsStats cancellations={this.state.cancellations} />
                                            </Route>
                                            <Route exact path={"/manager/attendances"}>
                                                <BookingsStats bookings={this.state.attendances} type={0}/>
                                            </Route>
                                        </Switch>
                                    </Col>
                                </Row>
                            </Container>
                        </>
                        }
                    </>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default withRouter(BookingManager);