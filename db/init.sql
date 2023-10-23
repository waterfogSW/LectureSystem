CREATE TABLE students -- 수강생
(
    id         BIGINT(20)   NOT NULL AUTO_INCREMENT PRIMARY KEY,                            -- 수강생 아이디
    nickname   VARCHAR(255) NOT NULL,                                                       -- 닉네임
    email      VARCHAR(255) NOT NULL,                                                       -- 이메일
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,                             -- 생성일
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일
    is_deleted BOOLEAN      NOT NULL DEFAULT FALSE                                          -- 삭제 여부
);

CREATE TABLE lectures -- 강의
(
    id            BIGINT(20)   NOT NULL AUTO_INCREMENT PRIMARY KEY,                            -- 강의 아이디
    instructor_id BIGINT(20)   NOT NULL,                                                       -- 강사 아이디
    title         VARCHAR(255) NOT NULL,                                                       -- 강의 제목
    description   TEXT         NOT NULL,                                                       -- 강의 설명
    price         INT          NOT NULL,                                                       -- 강의 가격
    category      VARCHAR(255) NOT NULL,                                                       -- 강의 카테고리
    is_published  BOOLEAN      NOT NULL DEFAULT FALSE,                                         -- 강의 공개 여부
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,                             -- 생성일
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일
    is_deleted    BOOLEAN      NOT NULL DEFAULT FALSE                                          -- 삭제 여부
);

CREATE TABLE instructors -- 강사
(
    id         BIGINT(20)   NOT NULL AUTO_INCREMENT PRIMARY KEY,                            -- 강사 아이디
    name       VARCHAR(255) NOT NULL,                                                       -- 강사 이름
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,                             -- 생성일
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일
    is_deleted BOOLEAN      NOT NULL DEFAULT FALSE                                          -- 삭제 여부
);

CREATE TABLE enrollments -- 내역
(
    id         BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,                            -- 내역 아이디
    student_id BIGINT(20) NOT NULL,                                                       -- 수강생 아이디
    lecture_id BIGINT(20) NOT NULL,                                                       -- 강의 아이디
    created_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,                             -- 생성일
    updated_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 수정일
    is_deleted BOOLEAN    NOT NULL DEFAULT FALSE                                          -- 삭제 여부
);

-- 뷰
CREATE VIEW active_students AS
SELECT *
FROM students
WHERE is_deleted = FALSE;

CREATE VIEW active_lectures AS
SELECT *
FROM lectures
WHERE is_deleted = FALSE;

CREATE VIEW active_instructors AS
SELECT *
FROM instructors
WHERE is_deleted = FALSE;

CREATE VIEW active_enrollments AS
SELECT *
FROM enrollments
WHERE is_deleted = FALSE;

-- 인덱스
CREATE INDEX idx_students_email ON students (email);
CREATE INDEX idx_lectures_instructor_id ON lectures (instructor_id);
CREATE INDEX idx_lectures_title ON lectures (title);
CREATE INDEX idx_lectures_category ON lectures (category);
CREATE INDEX idx_lectures_is_published ON lectures (is_published);
CREATE INDEX idx_lectures_created_at ON lectures (created_at);
CREATE INDEX idx_instructors_name ON instructors (name);
CREATE INDEX idx_enrollments_student_id ON enrollments (student_id);
CREATE INDEX idx_enrollments_lecture_id ON enrollments (lecture_id);
CREATE INDEX idx_enrollments_student_lecture ON enrollments (student_id, lecture_id);
