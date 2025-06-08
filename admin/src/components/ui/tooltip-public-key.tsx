import { useState, type ReactNode, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipPublicKeyProps {
  content: string
  children: ReactNode
  className?: string
}

const TooltipPublicKey = ({ content, children, className = '' }: TooltipPublicKeyProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.top - 10, // Position above the element
        left: rect.left + rect.width / 2
      })
    }
  }

  const handleMouseEnter = () => {
    updatePosition()
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => updatePosition()
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [isVisible])

  const tooltipContent = isVisible ? (
    <div
      className={`fixed z-[9999] px-3 py-2 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-full pointer-events-none ${className}`}
      style={{
        top: position.top,
        left: position.left,
        maxWidth: '400px',
        wordBreak: 'break-all'
      }}
    >
      <div className='font-mono'>{content}</div>
      {/* Arrow */}
      <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
    </div>
  ) : null

  return (
    <>
      <div
        ref={triggerRef}
        className='relative inline-block'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  )
}

export default TooltipPublicKey
