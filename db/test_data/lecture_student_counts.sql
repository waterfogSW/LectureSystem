INSERT INTO lecture_student_counts (lecture_id, count)
SELECT
    lecture_id,
    COUNT(*) as count
FROM
    active_enrollments
GROUP BY
    lecture_id;
