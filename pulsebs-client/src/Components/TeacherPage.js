import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import '../App.css';
import API from '../API/API';
import CourseList from './CourseList';
import LectureList from './LectureList';
import StudentList from './StudentiList';
import ButtonTeacherHub from './ButtonTeacherHub';

class TeacherPage extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            id: this.props.id,
            email: '',
            name: this.props.name,
            surname: this.props.surname,
            userType: 'teacher',
            lectures: [],
            courses: [],
            students: []
        };
    }

    componentDidMount() {
        API.getTeacherLectures()
           .then( ( lectures ) => {
               this.setState( {
                                  lectures: lectures,
                                  courses: this.getCourses( lectures ).sort()
                              } );
              this.getStudentsByLecture();
           } )
           .catch( ( err ) => {
               this.handleErrors( err );
           } );
    }

    handleErrors=( err )=> {
        if ( err ) {
            if ( err.status && err.status === 401 ) {
                this.props.history.push( "/" );
            }
        }
    }

    getCourses=( lectures )=> {
            const result = [];
            const map = new Map();
            for (const item of lectures) {
                if(!map.has(item.id)){
                    map.set(item.id, true);    // set any value to Map
                    result.push({
                        id: item.id,
                        course: item.course
                    });
                }
            }
            return result;
        }


    getStudentsByLecture=( )=> {
        API.getStudents()
           .then( ( student ) => {
               this.setState( {students: student} );
           } )
           .catch( ( err ) => {
               this.handleErrors( err );
           } );
    }

    getTeacherLectures=( )=>{
    API.getTeacherLectures()
        .then( ( lectures )=>{
          this.setState( { lectures: lectures, courses: this.getCourses(lectures).sort()} );
             this.getStudentsByLecture();
        })
        .catch((errorObj) => {
            this.handleErrors(errorObj);
        });
  }

    render() {
      return (
         <div>
           <Switch>
             <Route exact path="/teacher" component={ButtonTeacherHub}/>
             <Route exact path={"/teacher/courses"}>
               <CourseList courses={this.state.courses} getLectures={this.getTeacherLectures} />
             </Route>
             <Route exact path={"/teacher/:courseId/lectures"} render={({match})=>(
                 <LectureList lectures={this.state.lectures} idc={match.params.courseId} getLectures={this.getTeacherLectures} />
             )}/>
             <Route exact path={"/teacher/:courseId/:lectureId/students"} render={({match})=>(
                 <StudentList students={this.state.students} idl={match.params.lectureId} getLectures={this.getTeacherLectures} />
             )}/>
           </Switch>
         </div>

     );
    }
}

export default withRouter( TeacherPage );
