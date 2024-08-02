import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../components/ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { z } from "zod"
import { addFarmErrorI } from "../lib/interfaces"
import { useToast } from "./ui/use-toast"
import { Textarea } from "./ui/textarea"
import useUserStore from "../store/store"

const schema = z.object({
    name: z.string().min(1, { message: "Please provide name" }),
  });

const AddFarmDialog = () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [errors, setErrors] = useState<addFarmErrorI>({})
    const [apiError, setApiError] = useState("");
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const {addFarm} = useUserStore();


    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
          setLoading(true);
          const parseResponse = schema.safeParse({
           name
          });
          if (parseResponse.error) {
            setErrors(parseResponse.error.formErrors.fieldErrors);
            return;
          }
          setErrors({});
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/farm/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({
             name,
             desc
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
          addFarm({
            id: res.farm.id,
            name: res.farm.name,
            description: res.farm?.description || "",
            role: res.farm.role
          })
          setName("");
          setDesc("");
          setLoading(false);
          setOpen(false);
        } catch (error) {
          console.log(error);
        }finally{
          setLoading(false)
        }
      };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6b4226] hover:bg-[#4d2e1b]">Add farm</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Farm</DialogTitle>
          <DialogDescription>
            Fill all details and click submit to add farm.
          </DialogDescription>
          {apiError && <p className=" text-center text-sm text-red-500">{apiError}</p>}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name:
            </Label>
            <div className=" col-span-3">
            <Input
              id="name"
              placeholder="Farm name"
              className="col-span-3"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              />
              {errors.name && (
                  <span className="text-red-500 text-sm mt-[-0.4rem]">
                    {errors.name[0]}
                  </span>
                )}
                </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description:
            </Label>
            <Textarea
              id="username"
              placeholder="Details about farm"
              className="col-span-3"
              value={desc}
              onChange={(e)=>setDesc(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading} className="bg-[#6b4226] hover:bg-[#4d2e1b]">{loading ? "..." : "Submit"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddFarmDialog