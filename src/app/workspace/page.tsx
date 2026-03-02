import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import Courses from './_components/Courses'

function WorkspacePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Dashboard specific components go here! */}
      <WelcomeBanner />
      <Courses />
    </div>
  )
}

export default WorkspacePage