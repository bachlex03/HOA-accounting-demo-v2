import React from 'react'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar'
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
   Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/theme-provider'
import { Moon, Sun } from 'lucide-react'

const data = [
   [
      {
         label: 'Customize Page',
         icon: Settings2,
      },
      {
         label: 'Turn into wiki',
         icon: FileText,
      },
   ],
   [
      {
         label: 'Copy Link',
         icon: Link,
      },
      {
         label: 'Duplicate',
         icon: Copy,
      },
      {
         label: 'Move to',
         icon: CornerUpRight,
      },
      {
         label: 'Move to Trash',
         icon: Trash2,
      },
   ],
   [
      {
         label: 'Undo',
         icon: CornerUpLeft,
      },
      {
         label: 'View analytics',
         icon: LineChart,
      },
      {
         label: 'Version History',
         icon: GalleryVerticalEnd,
      },
      {
         label: 'Show delete pages',
         icon: Trash,
      },
      {
         label: 'Notifications',
         icon: Bell,
      },
   ],
   [
      {
         label: 'Import',
         icon: ArrowUp,
      },
      {
         label: 'Export',
         icon: ArrowDown,
      },
   ],
]

const HeadingActions = () => {
   const [isOpen, setIsOpen] = React.useState(false)
   const [currentTheme, setCurrentTheme] = React.useState('light')
   const { setTheme } = useTheme()

   return (
      <div className="flex items-center gap-2 text-sm">
         <div className="hidden font-medium text-muted-foreground md:inline-block">
            {/* Edit Oct 08 */}
         </div>
         {/* <ModeToggle /> */}
         <Button
            variant="outline"
            size="icon"
            onClick={() => {
               setTheme(currentTheme === 'light' ? 'dark' : 'light')
               setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')
            }}
         >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
         </Button>
         <Button variant="ghost" size="icon" className="h-7 w-7">
            <Star />
         </Button>

         {/* <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 data-[state=open]:bg-accent"
               >
                  <MoreHorizontal />
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="w-56 overflow-hidden rounded-lg p-0"
               align="end"
            >
               <Sidebar collapsible="none" className="bg-transparent">
                  <SidebarContent>
                     {data.map((group, index) => (
                        <SidebarGroup
                           key={index}
                           className="border-b last:border-none"
                        >
                           <SidebarGroupContent className="gap-0">
                              <SidebarMenu>
                                 {group.map((item, index) => (
                                    <SidebarMenuItem key={index}>
                                       <SidebarMenuButton>
                                          <item.icon />{' '}
                                          <span>{item.label}</span>
                                       </SidebarMenuButton>
                                    </SidebarMenuItem>
                                 ))}
                              </SidebarMenu>
                           </SidebarGroupContent>
                        </SidebarGroup>
                     ))}
                  </SidebarContent>
               </Sidebar>
            </PopoverContent>
         </Popover> */}
      </div>
   )
}

export default HeadingActions
