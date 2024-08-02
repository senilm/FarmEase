import { Link } from "react-router-dom"

interface NavigationLineI {
    path:string,
    text1:string,
    text2:string
}
const NavigationLine:React.FC<NavigationLineI> = ({path, text1, text2}) => {
  return (
    <p className=" text-xs text-right">{text1} <Link to={`${path}`} className=" underline underline-offset-2 text-[#6b4226] hover:text-[#4d2e1b]">{text2}</Link></p>
)
}

export default NavigationLine