import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {z} from "zod"
import { loginFormError, optionType } from "../lib/interfaces";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  person:z.string().min(1, {message:"Please select a name"}),
  password:z.string().min(1, {message:"Please select a password"})
})

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<loginFormError>({});
  const [apiError, setApiError] = useState("");
  const [options, setOptions] = useState<optionType[]>([]);

 
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const schemaParse = schema.safeParse({person, password});
      if(schemaParse.error){
        setErrors(schemaParse.error.formErrors.fieldErrors);
        return;
      }
      setLoading(true)
      setErrors({});
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email:person,
          password:password
        }),
      });
      const res = await response.json();
      if(!response.ok){
        setApiError(res?.message)
        console.log("fail")
        return;
      }else{
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('type', res.type);
        navigate('/home')
      }
    }catch(error:unknown){
        console.log("Failed to Login, Please try again later")
    }finally{
      setLoading(false)
    }
  }

  const getUsers = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            "authorization": `Bearer ${sessionStorage.getItem("token")}`
          }
        })
        const response = await res.json();
        if(!res.ok){
          console.log(response.message)
        }
        setOptions(response.users)
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    getUsers();
  },[])

  return (
    <div className=" w-full min-h-screen flex justify-center items-center">
      <div className="md:min-w-[23rem] min-w-[19rem] m-10 xs:m-16  px-10 py-5 rounded-lg  shadow-lg bg-white ">
        <div className=" text-3xl font-bold  text-center text-[#6b4226]">JK Farm</div>
        <div className=" text-xl font-semibold  text-center text-[#6b4226] mt-3">Login</div>
        <div className=" text-red-400 mt-4 text-center">{apiError}</div>
        <div className=" mt-5">
          <form onSubmit={handleSubmit} className=" flex flex-col gap-8 ">
            {/* User */}
            <div className=" flex flex-col gap-1">
              <Label
                htmlFor="guest-name"
                className="text-sm font-medium text-[#333]"
              >
                Name
              </Label>
              <Select
              value={person}
              onValueChange={(value) => setPerson(value)}
              >
                <SelectTrigger
                  id="guest-name"
                  className="bg-white border-[#ccc] rounded-md px-4 py-2 text-[#333] focus:border-[#666] focus:ring-0"
                >
                  <SelectValue placeholder="Select a name" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => {
                     return <SelectItem value={option.email} key={option.id}>{option.name}</SelectItem>
                  })}
                </SelectContent>
              </Select>
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
              {loading ? "..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
