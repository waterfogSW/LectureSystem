import { EnrollmentRepository } from '../../repository/EnrollmentRepository';

export const BindingTypes = {
  ConnectionPool: Symbol('ConnectionPool'),

  // student
  StudentController: Symbol('StudentController'),
  StudentService: Symbol('StudentService'),
  StudentRepository: Symbol('StudentRepository'),

  // lecture
  LectureController: Symbol('LectureController'),
  LectureService: Symbol('LectureService'),
  LectureRepository: Symbol('LectureRepository'),

  // instructor
  InstructorRepository: Symbol('InstructorRepository'),

  // enrollment
  EnrollmentRepository: Symbol('EnrollmentRepository'),

  // lecture student count
  LectureStudentCountRepository: Symbol('LectureStudentCountRepository'),
};
