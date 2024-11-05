// components/SuccessMessage.tsx
import React from "react"
import { FaCheckCircle } from "react-icons/fa"

const SuccessMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-2 text-center text-green-600">
      <FaCheckCircle className="h-10 w-10" />
      <h1 className="text-2xl font-semibold">Subscribed!</h1>
      <p>You will start receiving daily emails about Columbia Dining menus.</p>
    </div>
  )
}

export default SuccessMessage
