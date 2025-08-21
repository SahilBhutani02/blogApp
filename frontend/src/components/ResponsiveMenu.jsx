import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import UserLogo from "../assets/user.jpg"
import { Avatar, AvatarImage } from './ui/avatar';
import { ACCESS_TOKEN } from '@/lib/constants';


const ResponsiveMenu = ({ openNav, setOpenNav, logoutHandler }) => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    

    return (
        <div className={`${openNav ? "left-0" : "-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-800 px-8 pb-6 pt-16 text-black dark:text-gray-100 md:hidden rounded-r-xl shadow-md transition-all`}>
            <div>
                <div className='flex items-center justify-start gap-3'>
                    {
                        token ? <Avatar className="w-14 h-14">
                        <AvatarImage src={UserLogo} size={50} />
                      </Avatar> : <FaUserCircle size={50} className='' />
                    }
                </div>
                <nav className='mt-12'>
                    <ul className='flex flex-col gap-7 text-2xl font-semibold '>
                        <Link to="/" onClick={() => setOpenNav(false)}><li className='cursor-pointer'>Home</li></Link>
                        <Link to="/blogs" onClick={() => setOpenNav(false)}><li className='cursor-pointer'>Blog</li></Link>
                        <Link to="/about" onClick={() => setOpenNav(false)}><li className='cursor-pointer' >About</li></Link>
                        {
                            token? <Button onClick={()=>{logoutHandler(), setOpenNav(false)}}>Logout</Button> : <Link to={'/signup'} onClick={() => setOpenNav(false)}><Button>Signup</Button></Link>
                        }

                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default ResponsiveMenu