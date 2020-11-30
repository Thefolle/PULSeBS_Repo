import React         from 'react';
import moment        from 'moment';
import { Container } from "react-bootstrap";
import FullCalendar  from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/timegrid';
import {AuthContext} from '../auth/AuthContext';
import '../style/studentCalendar.css';

class StudentCalendar extends React.Component {
    render() {
        //Loading and preparing bookings
        let events = [];
        this.props.bookings.forEach( booking => {
            events.push( {title: booking.course, date: moment( booking.date ).format()} );
        } )

        return(
          <AuthContext.Consumer>
              {(context)=>(
                  <>
                  <Container id="calendar">
                      <hr/>
                      <FullCalendar
                          plugins={ [ dayGridPlugin ] }
                          initialView="timeGridWeek"
                          allDaySlot={false}
                          slotDuration="00:30:00"
                          slotMinTime="08:30:00"
                          slotMaxTime="21:00:00"
                          headerToolbar={
                              {
                                  left: 'prev,next',
                                  center: 'title',
                                  right: 'timeGridDay,timeGridWeek'
                              }
                          }
                          events={ events }
                      />
                  </Container>
                </>
              )}
            </AuthContext.Consumer>
        );
    }
}

export default StudentCalendar;
