import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { z } from "zod";
import { loginFormError } from "../lib/interfaces";
import { useNavigate } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";
import { useToast } from "../components/ui/use-toast";
import NavigationLine from "../components/NavigationLine";
import Loader from "../components/Loader";

const schema = z
  .object({
    person: z.string().min(1, { message: "Please enter email" }),
    name: z.string().min(1, { message: "Please enter name" }),
    password: z.string().min(1, { message: "Please select a password" }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<
    loginFormError & { name?: string[]; passwordConfirmation?: string[] }
  >({});
  const [apiError, setApiError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const schemaParse = schema.safeParse({
        person,
        password,
        name,
        passwordConfirmation,
      });
      if (schemaParse.error) {
        setErrors(schemaParse.error.formErrors.fieldErrors);
        return;
      }
      setLoading(true);
      setErrors({});

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: person,
            password: password,
            name: name,
          }),
        }
      );
      const res = await response.json();
      if (!response.ok) {
        setApiError(res?.message);
        toast({
          title: "ERROR 👎👎",
          description:
            res?.message || "Failed to Register, Please try again later",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "SUCCESS 💯",
        description: res?.message,
      });
      navigate("/");
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1583138789007-daf8be3b54b9?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-10 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold  sm:text-3xl md:text-4xl text-[#6b4226]">
              Welcome to FarmEase
            </h1>
            <div className=" text-red-400 mt-4">{apiError}</div>

            <form
              onSubmit={handleSubmit}
              className="mt-5 grid grid-cols-6 gap-6 max-sm:mt-10"
            >
              <div className="col-span-12">
                <Label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </Label>

                <Input
                  type="text"
                  id="name"
                  name="userName"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name[0]}</span>
                )}
              </div>

              <div className="col-span-12">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </Label>

                <Input
                  type="email"
                  id="email"
                  name="name"
                  placeholder="Email"
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.person && (
                  <span className="text-red-500 text-sm">
                    {errors.person[0]}
                  </span>
                )}
              </div>

              <div className="col-span-12 sm:col-span-6">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <Input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password[0]}
                  </span>
                )}
              </div>

              <div className="col-span-12 sm:col-span-6">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Confirmation
                </label>

                <Input
                  type="password"
                  id="PasswordConfirmation"
                  name="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="******"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.passwordConfirmation && (
                  <span className="text-red-500 text-sm">
                    {errors.passwordConfirmation[0]}
                  </span>
                )}
              </div>
              <div className=" col-span-12">
                <NavigationLine
                  path="/"
                  text1="Already have an account?"
                  text2="Login here"
                />
              </div>
              <div className="col-span-12 sm:flex sm:items-center sm:gap-4 text-right">
                <Button
                  className=" bg-[#6b4226] border-[#6b4226] transition-colors md:px-3 md:py-3 hover:bg-[#4d2e1b]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader className=" h-4 w-4 " />
                  ) : (
                    "Create an account"
                  )}
                </Button>
              </div>
              <Toaster />
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Register;
