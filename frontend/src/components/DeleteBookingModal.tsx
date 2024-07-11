import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useToast } from "../components/ui/use-toast";

const DeleteBookingModal = ({refetch, id}:{id:string, refetch:()=>void}) => {
  const {toast} = useToast()

  const deleteBooking = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/booking/${id}`,{
        method:"DELETE",
        headers:{
          "Content-Type": "application/json",
          "authorization": `Bearer ${sessionStorage.getItem("token")}`,
        }
      })

      const res = await response.json();

      if(!response.ok){
        toast({
          title: "ERROR 👎👎",
          description: res?.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "SUCCESS 💯",
        description: res?.message,
      });
      refetch();
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
      <div className=" cursor-pointer hover:bg-gray-100 transition-colors text-red-500 p-1 rounded-full">
          <Trash2 width={20} height={20} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete this booking forever
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-700" onClick={deleteBooking}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBookingModal;
