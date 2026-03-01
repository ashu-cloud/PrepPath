import React from 'react'
import { UserButton, useUser } from '@clerk/nextjs'
import { Button } from '@base-ui/react'
import link from 'next/dist/client/link'
import { User } from 'lucide-react'

function Header() {

    const {user} = useUser()




  return (
    <div>
        <h1>PrepPath</h1>
        {!user ? <a href="/sign-in"><Button>Sign In</Button></a> : 
        <div>
            <Button>Dashboard</Button>
            <UserButton />
            </div>} 
    </div>
  )
}

export default Header
