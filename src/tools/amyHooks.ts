import { Amy, Course, Courses, Models, StudentAssignment } from "@amy-app/amy-app-js-sdk";
import firebase from "firebase";
import { useEffect, useState } from "react";

export function useAmyObserver() {
    const [_user, setUser] = useState<{ user: firebase.User | null }>({
        user: null,
    });

    useEffect(() => {
        Amy.observe({
            observer: ({ user }) => {
                if (user) {
                    setUser({
                        user,
                    });
                } else {
                    setUser({
                        user: null,
                    });
                }
            },
        });
    }, []);
    return _user;
}

export function useCourseObserver() {
    const [_courses, setCourses] = useState<Models.Course[]>([]);
    const { user } = useAmyObserver();
    let unmount: () => void = () => {};

    useEffect(() => {
        if (user) {
            unmount = Courses.observe({
                observer: (courses) => {
                    setCourses(courses);
                },
            });
        }

        return () => {
            // unmount listener
            unmount();
        };
    }, [user]);

    return _courses;
}

export function useCourseSection(courseId: string, parentCourseSectionId: string) {
    const [sections, setSections] = useState<Models.CourseSection[]>([]);
    const [assignments, setAssignments] = useState<Models.CourseAssignment[]>([]);

    useEffect(() => {
        if (courseId && parentCourseSectionId) {
            Course.getCourseSection({
                courseId,
                parentCourseSectionId,
            }).then((e) => {
                setSections(e.courseSections);
                setAssignments(e.courseAssignments);
            });
        }
    }, [courseId, parentCourseSectionId]);

    return {
        sections,
        assignments,
    };
}

export function useCourse(courseId: string) {
    const [course, setCourse] = useState<Models.Course>();

    useEffect(() => {
        Course.get({ courseId }).then((e) => {
            setCourse(e);
        });
    }, [courseId]);

    return {
        course,
    };
}

export function useStudentAssignment(studentAssignmentId: string) {
    const { user } = useAmyObserver();

    const [studentAssignment, setStudentAssignment] = useState<{
        studentAssignment: Models.StudentAssignment;
        exercises: Models.MetaExercise[];
        rows: (Models.OptionRow | Models.FeedbackRow | Models.InstructionRow)[];
    }>({
        studentAssignment: null,
        exercises: [],
        rows: [],
    });

    useEffect(() => {
        if (studentAssignmentId && user) {
            StudentAssignment.studentAssignmentObserver({
                studentAssignmentId,
                observer: (studentAssignment, exercises, rows) => {
                    setStudentAssignment({
                        studentAssignment,
                        exercises,
                        rows,
                    });
                },
            });
        }
    }, [studentAssignmentId, user]);

    return studentAssignment;
}
