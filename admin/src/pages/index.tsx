import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/ui/mode-toggle'
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  Link,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const RootPage = () => {
  return (
    <div>
      <h1>Root Page</h1>
      <Popover open={true}>
        <PopoverTrigger asChild>
          <Button variant='outline'>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className='w-80'>
          <div className='grid gap-4'>
            <div className='space-y-2'>
              <h4 className='leading-none font-medium'>Dimensions</h4>
              <p className='text-muted-foreground text-sm'>Set the dimensions for the layer.</p>
            </div>
            <div className='grid gap-2'>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='width'>Width</Label>
                <Input id='width' defaultValue='100%' className='col-span-2 h-8' />
              </div>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='maxWidth'>Max. width</Label>
                <Input id='maxWidth' defaultValue='300px' className='col-span-2 h-8' />
              </div>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='height'>Height</Label>
                <Input id='height' defaultValue='25px' className='col-span-2 h-8' />
              </div>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Label htmlFor='maxHeight'>Max. height</Label>
                <Input id='maxHeight' defaultValue='none' className='col-span-2 h-8' />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default RootPage
