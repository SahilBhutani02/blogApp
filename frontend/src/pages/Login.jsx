import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import auth from "../assets/auth.jpg"
import Form from "@/components/Form";

const Login = () => {
 
  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px] ">
      <div className="hidden md:block">
        <img src={auth} alt="" className='h-[700px]' />
      </div>
      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Login into your account</CardTitle>
          <p className='text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center'>Enter your details below to login your account</p>
        </CardHeader>
        <CardContent>
          <Form route="/api/token/" method="login" />
          <p className='text-center text-gray-600 dark:text-gray-300'>Don't have an account? <Link to={'/signup'}><span className='underline cursor-pointer hover:text-gray-800'>Sign up</span></Link></p>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default Login
