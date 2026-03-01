"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { UserDetailContext } from '@/context/UserDetailContext'


function Provider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {

  const {user} = useUser()

  const [userDetails, setUserDetails] = useState({})

  useEffect(()=>{
    user && CreateNewUser()
  }, [user])

  const CreateNewUser = async ()=>{
    const result = await axios.post("/api/user", {
      name:user?.firstName || '',
      email:user?.primaryEmailAddress?.emailAddress
    })
    setUserDetails(result.data)
  }



  return (

    <NextThemesProvider {...props}>
      <UserDetailContext.Provider value={{userDetails}} >
      {children}
      </UserDetailContext.Provider>
    </NextThemesProvider>
  )
}

export default Provider
