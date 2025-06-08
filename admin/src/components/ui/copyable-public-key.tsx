import { useState } from 'react'
import { truncatePublicKey } from '@/lib/utils'
import TooltipPublicKey from './tooltip-public-key'
import { BsClipboard2, BsClipboard2Check } from 'react-icons/bs'

interface CopyablePublicKeyProps {
  publicKey: string
  startChars?: number
  endChars?: number
  className?: string
}

const CopyablePublicKey = ({ publicKey, startChars = 4, endChars = 4, className = '' }: CopyablePublicKeyProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipPublicKey content={publicKey}>
        <span className='font-mono text-sm cursor-help hover:text-blue-600 transition-colors'>
          {truncatePublicKey(publicKey, startChars, endChars)}
        </span>
      </TooltipPublicKey>
      <button
        onClick={handleCopy}
        className='p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors'
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <BsClipboard2Check size={16} className='text-green-500' />
        ) : (
          <BsClipboard2 size={16} className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300' />
        )}
      </button>
    </div>
  )
}

export default CopyablePublicKey
