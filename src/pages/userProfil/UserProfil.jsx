import React from 'react'
import Header from '../landing/components/Header'
import OptionsPanel from './components/OptionsPanel'
import Sidebar from './components/SideBar'
import TopBar from './components/TopBar'

const UserProfile = () => {
    return(
        <div className="relative min-h-screen flex flex-col">
      
            <div className="">
                <Header/>
            </div>
            
            <div className='w-auto'>
                <Sidebar/>
            </div>

         </div>
    )
}

export default UserProfile;
