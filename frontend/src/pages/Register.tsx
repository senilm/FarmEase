import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {z} from "zod"
import { loginFormError } from "../lib/interfaces";
import { useNavigate } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/use-toast";
import NavigationLine from "../components/NavigationLine";

const schema = z.object({
  person:z.string().min(1, {message:"Please enter email"}),
  name:z.string().min(1, {message:"Please enter name"}),
  password:z.string().min(1, {message:"Please select a password"})
})

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<loginFormError & {name?:string[]}>({});
  const [apiError, setApiError] = useState("");
  const { toast } = useToast();

 
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const schemaParse = schema.safeParse({person, password, name});
      if(schemaParse.error){
        setErrors(schemaParse.error.formErrors.fieldErrors);
        return;
      }
      setLoading(true)
      setErrors({});
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email:person,
          password:password,
          name:name
        }),
      });
      const res = await response.json();
      if(!response.ok){
        setApiError(res?.message)
        return;
      }else{
        toast({
          title: "SUCCESS 💯",
          description: res?.message,
        });
        navigate('/')
      }
    }catch(error:unknown){
      if(error instanceof Error){
        toast({
          title: "ERROR 👎👎",
          description: error?.message || "Failed to Register, Please try again later",
          variant: "destructive",
        });
      }
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className=" w-full min-h-screen flex justify-center items-center">
      <div className="md:min-w-[23rem] min-w-[19rem] m-10 xs:m-16  px-10 py-5 rounded-lg  shadow-lg bg-white ">
        <div className=" text-3xl font-semibold  text-center text-[#6b4226] mt-3">Register</div>
        <div className=" text-red-400 mt-4 text-center">{apiError}</div>
        <div className=" mt-5">
          <form onSubmit={handleSubmit} className=" flex flex-col gap-8 ">

            {/* User */}
            <div className=" flex flex-col gap-1">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-[#333]"
              >
                Name
              </Label>
              <Input
                type="text"                
                id="name"
                name="userName"
                placeholder="Name"
                value={name}
                onChange={(e) =>setName(e.target.value)}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name[0]}</span>
              )}
            </div>

            {/* User */}
            <div className=" flex flex-col gap-1">
              <Label
                htmlFor="guest-name"
                className="text-sm font-medium text-[#333]"
              >
                Email
              </Label>
              <Input
                type="email"                
                id="guest-name"
                name="name"
                placeholder="Email"
                value={person}
                onChange={(e) =>setPerson(e.target.value)}
              />
              {errors.person && (
                <span className="text-red-500 text-sm">{errors.person[0]}</span>
              )}
            </div>

            {/* password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
              <Input
                autoComplete="current-password"
                id="password"
                name="password"
                placeholder="******"
                value={password}
                onChange={(e) =>setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
              />
              <span
                  className="absolute top-1 right-0 mt-2 mr-2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-4"/> : <EyeIcon className="w-5 h-4" /> }
                </span>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password[0]}</span>
              )}
              
            </div>

            {/* Button */}
            <Button className="mb-5 bg-[#6b4226] text-white rounded-md px-6 py-2 hover:bg-[#4d2e1b]" type="submit" disabled={loading}>
              {loading ? "..." : "Register"}
            </Button>
          </form>
          <NavigationLine path="/" text1="Already have an account?" text2="Login here"/>
          <Toaster/>
        </div>
      </div>
    </div>
  );
};

export default Register;
