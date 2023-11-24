import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const Rent = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [username, setUsername] = useState(currentUser.username ? currentUser.username : "")
  const [email, setEmail] = useState(currentUser.email ? currentUser.email : "")
  
  return (
    <div className='flex max-w-6xl mx-auto p-3'>
        <h2 className='text-2xl font-semibold mt-8'>Reservation required</h2>
        <form>

        </form>
    </div>
  )
}

export default Rent