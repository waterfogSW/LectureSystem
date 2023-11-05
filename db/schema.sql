CREATE TABLE students -- 수강생
(
    id         BIGINT(20)   NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '수강생 아이디',
    nickname   VARCHAR(255) NOT NULL COMMENT '닉네임',
    email      VARCHAR(255) NOT NULL COMMENT '이메일',
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일'
);

CREATE TABLE lectures -- 강의
(
    id            BIGINT(20)   NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '강의 아이디',
    title         VARCHAR(255) NOT NULL COMMENT '강의 제목',
    introduction  TEXT         NOT NULL COMMENT '강의 소개',
    instructor_id BIGINT(20)   NOT NULL COMMENT '강사 아이디',
    category      VARCHAR(255) NOT NULL COMMENT '강의 카테고리',
    price         INT          NOT NULL COMMENT '강의 가격',
    is_published  TINYINT(1)   NOT NULL DEFAULT FALSE COMMENT '강의 공개 여부',
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일'
);

CREATE TABLE instructors -- 강사
(
    id         BIGINT(20)   NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '강사 아이디',
    name       VARCHAR(255) NOT NULL COMMENT '강사 이름',
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일'
);

CREATE TABLE enrollments -- 강의 등록 내역
(
    id         BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '내역 아이디',
    student_id BIGINT(20) NOT NULL COMMENT '수강생 아이디',
    lecture_id BIGINT(20) NOT NULL COMMENT '강의 아이디',
    created_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일'
);

CREATE TABLE lecture_student_counts -- 강의 등록 수강생수
(
    id         BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '아이디',
    lecture_id BIGINT(20) NOT NULL COMMENT '강의 아이디',
    count      INT        NOT NULL COMMENT '수강생수'
);

CREATE TABLE deleted_students -- 삭제된 수강생
(
    id         BIGINT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '아이디',
    student_id BIGINT(20) NOT NULL COMMENT '기존 수강생 아이디',
    email      VARCHAR(255) NOT NULL COMMENT '이메일',
    nickname   VARCHAR(255) NOT NULL COMMENT '닉네임',
    created_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일'
);

-- 인덱스
CREATE INDEX idx_lectures_instructor_id ON lectures (instructor_id);
CREATE INDEX idx_lectures_category ON lectures (category);
CREATE INDEX idx_lectures_is_published ON lectures (is_published);
CREATE INDEX idx_lectures_created_at ON lectures (created_at);
CREATE INDEX idx_instructors_name ON instructors (name);
CREATE INDEX idx_enrollments_student_id ON enrollments (student_id);
CREATE INDEX idx_enrollments_lecture_id ON enrollments (lecture_id);

CREATE UNIQUE INDEX idx_unique_title_lectures ON lectures (title);
CREATE UNIQUE INDEX idx_unique_email_students ON students (email);
CREATE UNIQUE INDEX idx_unique_student_id_lecture_id_enrollments ON enrollments (student_id, lecture_id);
CREATE UNIQUE INDEX idx_unique_lecture_id_lecture_student_counts ON lecture_student_counts (lecture_id);

ALTER TABLE lectures ADD FULLTEXT (title) WITH PARSER ngram;
ALTER TABLE instructors ADD FULLTEXT (name) WITH PARSER ngram;
