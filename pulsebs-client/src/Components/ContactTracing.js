import React from 'react';
import { Table } from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';
import { Form, Col, Row, Button } from 'react-bootstrap';
//import ShowTraceResult from './ShowTraceResult';
import API from '../API/API';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'

class ContactTracing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentToTrace: "",
      studentToTraceSSN: "",
      valid: false,
      studentsTraced: [],
      teachersTraced: []
    }
  }

  setStudentMatricola = (studentMatricola) => {
    // console.log("studentMatricola: " + studentMatricola);
    this.setState({ studentToTrace: studentMatricola });
    // console.log("state: " + this.state.studentToTrace);
    if (studentMatricola !== undefined) {
      if (studentMatricola.match(/^[0-9]+$/) !== null) {
        if(studentMatricola.length === 6) {
          this.setState({ valid: true });
          this.getTrace(studentMatricola);
        }
      }
      else {
        this.setState({ valid: false }); // characters are present
      }
    }
  }

  setStudentSSN = (studentSSN) => {
    // console.log("studentMatricola: " + studentMatricola);
    this.setState({ studentToTraceSSN: studentSSN });
    if (studentSSN !== undefined) {
      if(studentSSN.length === 16) {
        API.getStudentFromSSN(studentSSN)
          .then((student) => {
            this.setState({ valid: true });
            //console.log(student[0]);
            //console.log(student[0].id);
            this.getTrace(student[0].id);
          }).catch((errorObj) => {
            this.setState({ valid: false });
            //console.log(errorObj);
          });
      }
    }
    // console.log("state: " + this.state.studentToTrace);
  }

  getTrace = (studentToTrace) => {
    API.getContactsWithPositiveStudent(studentToTrace)
      .then((result) => {
        this.setState({ studentsTraced: result.involvedStudents });
        this.setState({ teachersTraced: result.uniqTeachers });
      }
      ).catch((errorObj) => {
        console.log(errorObj);
      });
    //console.log("students" + this.state.studentsTraced);
    //console.log("teachers" + this.state.teachersTraced);
  }

  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            <h1>Student's contact tracing</h1>

            <Form>

              <Form.Group as={Row} controlId="contactTracingMatricola">
                {!this.state.studentToTraceSSN &&
                <>
                <Form.Label column sm={2}>
                  <h4>Matricola</h4>
                </Form.Label>
                <Col sm={4}>
                  <Form.Control name="studentMatricola" type="text" pattern="[0-9]*" placeholder="student's matricola"
                    onChange={(ev) => this.setStudentMatricola(ev.target.value)} required />
                </Col>
                </>
                }
                {!this.state.studentToTrace &&
                  <>
                <Form.Label column sm={2}>
                  <h4>SSN</h4>
                </Form.Label>
                <Col sm={4}>
                  <Form.Control name="studentSsn" type="text" placeholder="student's SSN"
                    onChange={(ev) => this.setStudentSSN(ev.target.value.toUpperCase())} required />
                </Col>
                </>
                }
              </Form.Group>
              {/* <p>OR</p>
              <Form.Group as={Row} controlId="contactTracingSsn">
                <Form.Label column sm={4}>
                  <h4>SSN</h4>
                </Form.Label>
                <Col sm={6}>
                  <Form.Control name="studentSsn" type="text" pattern="*"
                    onChange={(ev) => this.setStudentMatricola(ev.target.value)} required />
                </Col>
              </Form.Group> */}

              {/*<Form.Group>
                            <Col>
                                <Button onClick={console.log(this.studentToTrace)}>Trace {this.state.studentToTrace}</Button>
                            </Col>
                          </Form.Group> */}
              {this.state.valid === true ? // Matricola contains only numbers
                //this.getTrace(this.state.studentToTrace) &&
                <ShowTraceResult students={this.state.studentsTraced} teachers={this.state.teachersTraced} tracedId={this.state.studentToTrace} tracedSSN={this.state.studentToTraceSSN} />
                :
                <>
                <h4>Student's matricola <b>must</b> contain 6 numbers.</h4>
                <h4>Student's SSN <b>must</b> contain 16 characters.</h4>
                </>
              }
              {/*<TraceMatricola matricola={this.studentToTrace} />
    */}
            </Form>

          </>
        )}
      </AuthContext.Consumer>
    );
  }

}

const ShowTraceResult = (props) => {
  let { students, teachers, tracedId, tracedSSN } = props;
  

  // console.log("showTrace:");
  // console.log([students]);
  // console.log(teachers);

  return (
    <AuthContext.Consumer>
      {(context) => (
        <>
              {students !== null && teachers !== null ?
              <>
              <Row>
                <Col>
                  <Button onClick={() => getCSV(teachers, students)}>Download CSV</Button>
                </Col>
                <Col>
                  <Button onClick={() => getPDF(teachers, students, tracedId !=="" ? tracedId : tracedSSN)}>Download PDF</Button>
                </Col>
              </Row>
              <Table className="table" id="teachers-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>SSN</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, id) => <CTitem key={id} type={1} matricola={t.tID} name={t.name} surname={t.surname} ssn={t.ssn} />)}
                </tbody>
              </Table>
              { students.length !== 0 &&
              <Table className="table" id="students-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>SSN</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, id) => <CTitem key={id} type={0} matricola={s.sID} name={s.name} surname={s.surname} ssn={s.ssn}/>)}
                </tbody>
              </Table>
              }
              </>
              :
              <h4>Nothing to be traced.</h4>
              }
        </>
      )}
    </AuthContext.Consumer>
  );

  function getCSV(teachers, students) {
    const csvRows = ["type,id,name,surname,ssn"];
    for(const t of teachers) {
      csvRows.push("teacher," + t.tID + "," + t.name + "," + t.surname + "," + t.ssn);
    }
    for(const s of students) {
      csvRows.push("student," + s.sID + "," + s.name + "," + s.surname + "," + s.ssn);
    }
    downloadCSV(csvRows.join('\n'));
  }

  function downloadCSV(data) {
    const blob = new Blob([data], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'contactTracing.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  function getPDF(teachers, students, traced) {
    var teac = teachers.map( function( el ){ 
      return ["Teacher", el.tID, el.name, el.surname, el.ssn]; 
     });
    var stud = students.map( function( el ){ 
      return ["Student", el.sID, el.name, el.surname, el.ssn]; 
     });

    const rows = [];
    for(const t of teac) {
      rows.push(t);
    }
    for(const s of stud) {
      rows.push(s);
    }
    
    //downloadPDF(rows.join('\n'));
    downloadPDF(rows, traced);
  }

  function downloadPDF(data, traced) {
    
    const doc = new jsPDF({
      orientation: 'landscape'
    });

    // Change font
    doc.setFont("courier");
    doc.setFontSize(20);
    doc.text("Result of the tracing for the student '" + traced +"':\n", 10, 10);
    doc.setFontSize(16);

    doc.autoTable({
      head: [['Type', 'ID', 'Name', 'Surname', 'SSN']],
      body: data
    })

    doc.save('ContactTracing.pdf')
  };
}

const CTitem = (props) => {
  let { type, matricola, name, surname, ssn } = props;
  return (
    <tr>
      <td>{type === 0 ? "Student" : "Teacher"}</td>
      <td>{matricola}</td>
      <td>{name}</td>
      <td>{surname}</td>
      <td>{ssn}</td>
    </tr>
  );
}

export default ContactTracing;

/*
const ContactTracing = (props) => {

    let { studentToTrace, setStudentMatricola } = props;

    var studentMatricola = '';

    updateField = (value) => {
        this.studentMatricola = value;
    }

    return (
        <AuthContext.Consumer>
            {(context) => (
                <>
                    <h1>Contact tracing</h1>

                    <Form>

                      <Form.Group as={Row} controlId="contactTracing">
                        <Form.Label column sm={4}>
                          <h4>Student's matricola</h4>
                        </Form.Label>
                        <Col sm={6}>
                          <Form.Control name="studentMatricola" value={studentToTrace}
                            onChange={(ev) => this.updateField(ev.target.value)} required/>
                        </Col>
                      </Form.Group>

                      <Form.Group>
                        <Col>
                          <Button onClick={console.log("niente")}>Trace</Button>
                        </Col>
                      </Form.Group>

                    </Form>

                </>
            )}
        </AuthContext.Consumer>
    );

}

export default ContactTracing;
*/