interface OverlayI{
    text:string
}
const Overlay:React.FC<OverlayI> = ({text}) => {
  return (
    <div className="absolute border-t top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-5">
    <div className="bg-white p-10 rounded  text-center w-full h-full opacity-70 flex justify-center items-center">
      <p className="text-3xl font-semibold text-red-950">
        {text}
      </p>
    </div>
  </div>
  )
}

export default Overlay