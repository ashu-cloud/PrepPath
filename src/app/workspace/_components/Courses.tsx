"use client"

import React from 'react'

function Courses() {

    const [courseList, setCourseList] = React.useState([])

  return (
    <div>
        <h1>Courses</h1>
        { courseList.length > 0 ? (
          courseList.map((course: any) => (
            <div key={course.id}>
                <h2>{course.title}</h2>
            </div>
        ))): (
            <p>No courses found</p>
        )}
    </div>
  )
}

export default Courses
