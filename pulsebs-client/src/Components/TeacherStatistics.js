import React from 'react';
import Plotly from 'plotly.js';
import moment from 'moment';

import API from '../API/API';

import { Row, Col, Form, Container } from 'react-bootstrap';

import DropDown from './DropDown';

import Tutorial from './Tutorial';


moment.locale('it');

class TeacherStatistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            x: [],
            y: [],
            groupBy: 'Lecture',
            courseSelected: this.props.courses[0].course,
            average: 0,
            presence: false
        }

        this.generateChartFromData = this.generateChartFromData.bind(this);
        this.getTeacherStatistics = this.getTeacherStatistics.bind(this);
    }

    componentDidMount() {
        this.getTeacherStatistics(this.props.userId,
            this.props.courses.find(course => course.course === this.state.courseSelected).id,
            this.state.groupBy, false);
    }

    getTeacherStatistics(teacherId, courseId, groupBy, presence) {
        // if the div element exists (the render method has generated it)
        console.log(presence)
        if (document.getElementById('plotId')) {
            API.getTeacherStatistics(teacherId, courseId, groupBy, presence).then(data => {
                let trace1, trace2, layout;
                console.log(data);
                // data are sorted according to an increasing date in the back end
                [trace1, trace2, layout] = this.generateChartFromData(data.x, data.y, groupBy);
                Plotly.newPlot('plotId', [trace1, trace2], layout, { displayModeBar: false });

                // call setState to trigger render
                if (courseId !== this.props.courses.find(course => course.course === this.state.courseSelected).id) {
                    this.setState({
                        x: data.x,
                        y: data.y,
                        courseSelected: this.props.courses.find(course => course.id === courseId).course,
                        average: data.average,
                        courseId: this.props.courses.find(course => course.id === courseId).id
                    });
                } else if (groupBy !== this.state.groupBy) {
                    this.setState({ x: data.x, y: data.y, groupBy, average: data.average });
                } else if (presence !== this.state.presence) {
                    this.setState({ x: data.x, y: data.y, presence: presence, average: data.average });
                } else {
                    // this case occurs if the function was called by the componentDidMount method
                    this.setState({ x: data.x, y: data.y, average: data.average })
                }
            });
        } else console.log('Plot non mountable');
    }

    generateChartFromData = (x, y, groupBy) => {
        let trace1, trace2, layout;

        // this snippet ensures a minimum value for the maximum value visualized in the x axis;
        // in absence of it, the library may show decimal values in ticks for the number of bookings,
        // which is not possible
        let maximumValue = [...x].sort((number1, number2) => number2 - number1)[0];
        if (maximumValue < 10) {
            maximumValue = 10;
        }

        if (groupBy === 'Lecture') {
            trace1 = {
                x,
                y,
                orientation: 'h',
                type: "scatter",
                mode: "markers",
                name: "",
                marker: {
                    color: 'rgb(158,202,225)',
                    size: 10,
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1
                    }
                }
            }

            trace2 = {
                x,
                y,
                orientation: 'h',
                type: "bar",
                width: "1",
                marker: {
                    color: 'rgb(158,202,225)',
                    size: 10,
                    opacity: 0.5,
                    line: {
                        color: 'rgb(0,0,0)',
                        width: 0.2
                    }
                },
                hoverinfo: "none"
            }

            layout = {
                title: {
                    text: `What's the bookings trend grouped by ${groupBy.toLowerCase()}?`,
                    font: {
                        size: 24
                    }
                },
                hovermode: "closest",
                showlegend: false,
                xaxis: {
                    title: 'Number of Bookings',
                    range: [0, maximumValue],
                    showgrid: false,
                    fixedrange: true
                },
                yaxis: {
                    title: 'Lectures',
                    // prevents the axis title to cut off the tick labels by overlapping them
                    automargin: true,
                    fixedrange: true,
                    tickmode: 'array',
                    tickvals: y,
                    ticktext: y.map(unixTime => moment(unixTime).format('D/M') + " " + moment(unixTime).format('H:M')),
                    type: 'date',
                    showgrid: false
                }
            }
        } else if (groupBy === 'Week') {
            trace1 = {
                x,
                y,
                orientation: 'h',
                type: "scatter",
                mode: "markers",
                name: "",
                marker: {
                    color: 'rgb(158,202,225)',
                    size: 10,
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1
                    }
                }
            };

            trace2 = {
                x,
                y,
                orientation: 'h',
                type: "bar",
                width: "1",
                marker: {
                    color: 'rgb(158,202,225)',
                    size: 10,
                    opacity: 0.5,
                    line: {
                        color: 'rgb(0,0,0)',
                        width: 0.2
                    }
                },
                hoverinfo: "none"
            };

            layout = {
                title: {
                    text: `What's the bookings trend grouped by ${groupBy.toLowerCase()}?`,
                    font: {
                        size: 24
                    }
                },
                hovermode: "closest",
                showlegend: false,
                xaxis: {
                    title: 'Number of Bookings',
                    showgrid: false,
                    fixedrange: true,
                    range: [0, maximumValue]
                },
                yaxis: {
                    title: 'Weeks',
                    automargin: true,
                    fixedrange: true,
                    tickmode: 'array',
                    tickvals: y,
                    ticktext: y.map(unixTime => moment(unixTime).format('D/M') + ' to ' + moment(unixTime).add(1, 'week').format('D/M')),
                    type: 'date',
                    showgrid: false
                }
            }
        } else if (groupBy === 'Month') {
            trace1 = {
                x,
                y,
                orientation: 'h',
                type: "scatter",
                mode: "markers",
                name: "",
                marker: {
                    color: 'rgb(158,202,225)',
                    size: 10,
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1
                    }
                }
            };

            trace2 = {
                x,
                y,
                orientation: 'h',
                type: "bar",
                width: "1",
                marker: {
                    color: 'rgb(158,202,225)',
                    size: 10,
                    opacity: 0.5,
                    line: {
                        color: 'rgb(0,0,0)',
                        width: 0.2
                    }
                },
                hoverinfo: "none"
            };

            layout = {
                title: {
                    text: `What's the bookings trend grouped by ${groupBy.toLowerCase()}?`,
                    font: {
                        size: 24
                    }
                },
                hovermode: "closest",
                showlegend: false,
                xaxis: {
                    title: 'Number of Bookings',
                    showgrid: false,
                    fixedrange: true,
                    range: [0, maximumValue]
                },
                yaxis: {
                    title: 'Months',
                    automargin: true,
                    fixedrange: true,
                    tickmode: 'array',
                    tickvals: y,
                    ticktext: y.map(unixTime => moment(unixTime).format('M/Y')),
                    type: 'date',
                    showgrid: false
                }
            }
        } else {
            console.error('Illegal option for groupBy');
            return;
        }

        return [trace1, trace2, layout];
    }

    handleChange = () => {
        let oldValue = this.state.presence;
        this.setState({ presence: !oldValue },
            () => this.getTeacherStatistics(
                this.props.userId,
                this.state.courseId,
                this.state.groupBy
            ));
    }


    render() {
        return <Container>
            <Row>
                <Col md={5}>
                    <Tutorial on={true} text='Filter data by choosing a course.' push={
                        <>
                            <label>Course:</label>
                            <DropDown options={this.props.courses.map(course => course.course)}
                            defaultOption={this.state.courseSelected} variant='info' extraPadding={20}
                            setSelectedOption={(selectedOption) =>
                                this.getTeacherStatistics(this.props.userId,
                                    this.props.courses.find(course => course.course === selectedOption).id,
                                    this.state.groupBy, this.state.presence)
                            } />
                        </>
                    } />
                    
                </Col>
            </Row>
            <Row className={"justify-content-between"}>
                <Col md={5}>
                    <Tutorial on={true} text='Organize data through the proposed formats.' push={
                        <>
                            <label>Group by:</label>
                            <DropDown options={['Lecture', 'Week', 'Month']} defaultOption={this.state.groupBy}
                                variant='info' extraPadding={20} setSelectedOption={(selectedOption) =>
                                    this.getTeacherStatistics(this.props.userId,
                                        this.props.courses.find(course => course.course === this.state.courseSelected).id,
                                        selectedOption, this.state.presence)
                            } />
                        </>
                    } />
                    
                </Col>
                <Col md={3}>
                    <Tutorial on={true} text='Check if you want to consider only the students whose presence was taken by you.' push={
                        <Form.Check
                            type={'checkbox'}
                            label={'Presences on/off'}
                            checked={this.state.presence}
                            onChange={() => this.getTeacherStatistics(
                                this.props.userId,
                                this.props.courses.find(course => course.course === this.state.courseSelected).id,
                                this.state.groupBy,
                                !this.state.presence
                            )}
                        />
                    } />

                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div id='plotId' />
                </Col>
            </Row>


        </Container>;
    }
}

export default TeacherStatistics;
