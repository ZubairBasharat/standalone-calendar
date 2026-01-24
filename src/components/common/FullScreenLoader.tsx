import { Loader } from "lucide-react"

const FullScreenLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-transparent z-99 bg-opacity-50 flex items-center justify-center">
      <div className="flex items-center justify-center gap-2 rounded-md bg-blue-500 p-5 text-white">
       <Loader className="w-7 h-7 animate-spin" />
      </div>
    </div>
  )
}

export default FullScreenLoader
