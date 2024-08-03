import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { addUserErrorI, optionT } from "../lib/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { options } from "../lib/constants";
import SearchAndSelect from "./SearchAndSelect";
import { z } from "zod"
import { useToast } from "./ui/use-toast";
import Loader from "./Loader";

const schema = z.object({
  name: z.string().min(1, { message: "Please provide name" }),
  role: z.enum(['USER', 'ADMIN'], { message: "Role must be either 'user' or 'admin'" })
});

interface AddUserDialogI {
  farmId: string,
  fetchUsers: ()=>void
}
const AddUserDialog:React.FC<AddUserDialogI> = ({farmId, fetchUsers}) => {
  const [errors, setErrors] = useState<addUserErrorI>({});
  const [selectedUser, setSelectedUser] = useState<optionT | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); 
  const [apiError, setApiError] = useState("");
  const {toast} = useToast();
  
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const parseResponse = schema.safeParse({
       name:selectedUser?.id,
       role:selectedRole
      });
      if (parseResponse.error) {
        setErrors(parseResponse.error.formErrors.fieldErrors);
        return;
      }
      setErrors({});
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/farm/${farmId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
         userId:selectedUser?.id,
         role:selectedRole
        }),
      });
      const res = await response.json();
      if (!response.ok) {
        setApiError(res?.message);
        toast({
          title: "ERROR 👎👎",
          description: res?.message,
          variant: "destructive",
        });
        return;
      }
      setApiError("");
      toast({
        title: "SUCCESS 💯",
        description: res?.message,
      });
      fetchUsers()
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    setApiError("");
    setErrors({})
  },[open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6b4226] hover:bg-[#4d2e1b]">Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>Select a user and choose role</DialogDescription>
          {apiError && <p className=" text-center text-sm text-red-500">{apiError}</p>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name:
            </Label>
            <div className=" col-span-3">
                <SearchAndSelect onChange={(val)=>setSelectedUser(val)}/>
              {errors.name && (
                <span className="text-red-500 text-sm mt-[-0.4rem]">
                  {errors.name[0]}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Role:
            </Label>
            <div className=" col-span-3">

            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value)}
              >
              <SelectTrigger className="md:w-[15rem] max-md:w-44">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, i) => {
                  return (
                    <SelectItem value={option.value} key={i}>{option.label}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.role && (
                <span className="text-red-500 text-center text-sm mt-[-0.4rem]">
                  {errors.role[0]}
                </span>
              )}
                </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={handleSubmit} className="bg-[#6b4226] hover:bg-[#4d2e1b]">{loading ? <Loader className=" w-4 h-4"/> : "Add user"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
