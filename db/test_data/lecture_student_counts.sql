INSERT INTO lecture_student_counts (lecture_id, count)
SELECT lectures.id, COUNT(enrollments.lecture_id) as count
FROM lectures
         LEFT JOIN enrollments ON lectures.id = enrollments.lecture_id
GROUP BY lectures.id;
