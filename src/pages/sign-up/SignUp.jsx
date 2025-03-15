import React from 'react'
import Header from '../landing/components/Header'
import Form from '../common/Form'
import { useNavigate } from 'react-router';
import { useState } from 'react';
import Footer from '../landing/components/Footer';

//import { useStore } from 'zustand';

//import { div } from 'motion/react-client';

const SignUp = () => {

  const SignUp = async () => {

    //const {addToken} =useStore(themeStore)
    const navigate = useNavigate();
    const [formData , setFormData] = useState({})

    try {
        const response = await fetch ("Burada yuksek seviyyeli api olacaq", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type":"application/json",
                 
            },

            body: JSON.stringify(formData)
        })

     const data = await response.json()

     
     if (response.ok){
        //addToken(data.token)
        //navigate('/home'); 
     }
     else {
        setError(data.message || "Error"); 
    }


    }catch (error){
        console.log(error)
    }
}

  const formItems = [
    {
      label: "",
      name: "username",
      type: "text",
      placeholder: "Username",
      inputStyle: "p-4 bg-transparent border-[1px] border-zinc-400 rounded-[4px] text-white "
  },
    {
      label: "",
      name: "email",
      type: "email",
      placeholder: "E-mail",
      inputStyle: "p-4 bg-transparent border-[1px] border-zinc-400 rounded-[15px] text-black "


    },

    {
      label: "",
      name: "password",
      type: "password",
      placeholder: "Password",
      inputStyle: "p-4 bg-transparent border-[1px] border-zinc-400 rounded-[15px] text-black "

    },



  ]

    const formButtons =[
      { title: "Sign In ",
        style : "bg-[#405FF2] text-white font-medium py-[3px] h-[40px] w-full rounded-[10px] hover:bg-blue-700 active:bg-blue-800 focus:outline-none ",
        action : ""

      },

      {
        title:"Already have an account? Sign in",
        style: "text-zinc-300 w-full mt-[25px] ",
        action: () => {navigate('/SignIn')}

    }
      

    ]
    
  return (
    
    <div>
      <Header/>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        
       
        
        <div>

         <Form
             headerText = { 
              {
                title: "Sign Up",
                style: "text-black font-bold text-[32px]"
              }
            }
            



            formItems={formItems} 
            //setFormData={setFormData} 
            formButtons={formButtons} 
            formStyle="w-[450px] h-[470px] px-[68px] pt-[48px] flex flex-col gap-6 " />

        

        </div>
        
        



      </div>
      <div>
        <Footer/>
        </div>
    </div>
  )
}

export default SignUp