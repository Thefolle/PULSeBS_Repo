import React from 'react';
import { Table } from "react-bootstrap";
import { AuthContext } from '../auth/AuthContext';
import { Form, Col, Row, Button } from 'react-bootstrap';
//import ShowTraceResult from './ShowTraceResult';
import API from '../API/API';
import { jsPDF } from "jspdf";

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
            let studentMatricolaToTrace = student[0].id;
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
                <ShowTraceResult students={this.state.studentsTraced} teachers={this.state.teachersTraced} />
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
  let { students, teachers } = props;


  // console.log("showTrace:");
  // console.log(students);
  // console.log(teachers);

  return (
    <AuthContext.Consumer>
      {(context) => (
        <>
              {students !== null && teachers !== null ?
              <>
              <Button onClick={() => getCSV(teachers, students)}>Download CSV</Button>
              <Button onClick={() => getPDF(teachers, students)}>Download PDF</Button>
              <Table className="table" id="teachers-table">
                <thead>
                  <tr>
                    <th>Teachers' ID</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, id) => <CTitem key={id} matricola={t} />)}
                </tbody>
              </Table>
              { students.length !== 0 &&
              <Table className="table" id="students-table">
                <thead>
                  <tr>
                    <th>Students' ID</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, id) => <CTitem key={id} matricola={s} />)}
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

  function getCSV(teachersID, studentsID) {
    const csvRows = ["id"];
    for(const Tid of teachersID) {
      csvRows.push(Tid);
    }
    for(const Sid of studentsID) {
      csvRows.push(Sid);
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

  function getPDF(teachersID, studentsID) {
    const csvRows = ["id"];
    for(const Tid of teachersID) {
      csvRows.push(Tid);
    }
    for(const Sid of studentsID) {
      csvRows.push(Sid);
    }
    downloadPDF(csvRows.join('\n'));
  }

  function downloadPDF(data) {
    const doc = new jsPDF();
    doc.text(data, 10, 10);
    doc.save("ContactTracing.pdf");
  };
}

const CTitem = (props) => {
  let { matricola } = props;
  return (
    <tr>
      <td>{matricola}</td>
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