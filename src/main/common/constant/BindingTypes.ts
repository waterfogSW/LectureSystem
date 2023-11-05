export const BindingTypes = {
  ConnectionPool: Symbol('ConnectionPool'),

  // student
  StudentController: Symbol('StudentController'),
  StudentFacade: Symbol('StudentFacade'),
  StudentService: Symbol('StudentService'),
  StudentRepository: Symbol('StudentRepository'),

  // lecture
  LectureController: Symbol('LectureController'),
  LectureFacade: Symbol('LectureFacade'),
  LectureService: Symbol('LectureService'),
  LectureRepository: Symbol('LectureRepository'),

  // instructor
  InstructorService: Symbol('InstructorService'),
  InstructorRepository: Symbol('InstructorRepository'),

  // enrollment
  EnrollmentController: Symbol('EnrollmentController'),
  EnrollmentFacade: Symbol('EnrollmentFacade'),
  EnrollmentService: Symbol('EnrollmentService'),
  EnrollmentRepository: Symbol('EnrollmentRepository'),

  // lecture student count
  LectureStudentCountRepository: Symbol('LectureStudentCountRepository'),
};
