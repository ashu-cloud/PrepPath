import React from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@base-ui/react'
import Link from 'next/link'

function Header() {

    const {user} = useUser()

  return (
    <div>
        <h1>PrepPath</h1>
        {!user ? <Link href="/sign-in"><Button>Sign In</Button></Link> : 
        <div>
            <Button>Dashboard</Button>
            <UserButton />
            </div>} 
    </div>
  )
}

export default Header
