import React from 'react'
import WorkspaceProvider from './provider'

function WorkSpaceLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <WorkspaceProvider>
            {children}
        </WorkspaceProvider>
    </div>
  )
}

export default WorkSpaceLayout
