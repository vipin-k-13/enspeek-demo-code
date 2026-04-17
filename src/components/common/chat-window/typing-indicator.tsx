"use client"

import type React from "react"

interface TypingIndicatorProps {
  className?: string
  showText?: boolean
  dotColor?: string
  textColor?: string
  size?: "sm" | "md" | "lg"
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className = "",
  showText = true,
  dotColor = "bg-gray-500",
  textColor = "text-gray-500",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={`mb-4 text-left ${className}`}>
      <div className="inline-block p-3 rounded-lg bg-airesp">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div
              className={`${sizeClasses[size]} ${dotColor} rounded-full animate-bounce [animation-delay:-0.3s]`}
            ></div>
            <div
              className={`${sizeClasses[size]} ${dotColor} rounded-full animate-bounce [animation-delay:-0.15s]`}
            ></div>
            <div className={`${sizeClasses[size]} ${dotColor} rounded-full animate-bounce`}></div>
          </div>
          {showText && <span className={`${textColor} ${textSizeClasses[size]} ml-2`}></span>}
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
