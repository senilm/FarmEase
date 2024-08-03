import { Skeleton } from "./ui/skeleton"

const SkeletonLoader = () => {
  return (
    <div className="border px-4 py-3 rounded-lg mb-2 bg-white shadow-lg">
      <div className="flex justify-between">
        <div>
          <div className="font-bold text-xl text-green-500">
            <Skeleton className="h-6 w-24 bg-gray-300 rounded" />
          </div>
          <div className="font-semibold text-gray-500 mt-2">
            <Skeleton className="h-5 w-32 bg-gray-300 rounded" />
          </div>
        </div>
        <h3 className="font-bold">
          <Skeleton className="h-5 w-20 bg-gray-300 rounded" />
        </h3>
      </div>
      <div className="flex justify-between items-center mt-5">
        <div>
          <Skeleton className="h-4 w-[14rem] bg-gray-300 rounded" />
        </div>
        <Skeleton className="h-8 w-8 bg-gray-300 rounded-full" />
      </div>
    </div>
  )
}

export default SkeletonLoader