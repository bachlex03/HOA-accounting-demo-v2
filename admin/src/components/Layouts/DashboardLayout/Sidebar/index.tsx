import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { AudioWaveform, BookOpen, Bot, Command, GalleryVerticalEnd, Settings2, SquareTerminal } from 'lucide-react'
import { PiMoneyWavy } from 'react-icons/pi'
import { GrOverview } from 'react-icons/gr'
import { MdOutlineAnnouncement } from 'react-icons/md'
import { IoCalendarClearOutline, IoDocumentTextOutline } from 'react-icons/io5'
import { BsListTask, BsGrid3X2, BsTruck } from 'react-icons/bs'
import { GoAlert } from 'react-icons/go'
import { HiOutlineHome, HiOutlineClipboardDocumentList } from 'react-icons/hi2'

import NavItems from './NavItems'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup'
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free'
    }
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#'
        },
        {
          title: 'Starred',
          url: '#'
        },
        {
          title: 'Settings',
          url: '#'
        }
      ]
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#'
        },
        {
          title: 'Explorer',
          url: '#'
        },
        {
          title: 'Quantum',
          url: '#'
        }
      ]
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#'
        },
        {
          title: 'Get Started',
          url: '#'
        },
        {
          title: 'Tutorials',
          url: '#'
        },
        {
          title: 'Changelog',
          url: '#'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Overview',
      url: '#',
      icon: GrOverview
    },
    {
      name: 'Announcements',
      url: '#',
      icon: MdOutlineAnnouncement
    },
    {
      name: 'Calendar',
      url: '#',
      icon: IoCalendarClearOutline
    },
    {
      name: 'Task Management',
      url: '#',
      icon: BsListTask
    },
    {
      name: 'Projects',
      url: '#',
      icon: BsGrid3X2
    },
    {
      name: 'Vendors',
      url: '#',
      icon: BsTruck
    },
    {
      name: 'Violation Reports',
      url: '#',
      icon: GoAlert
    },
    {
      name: 'Accounting',
      url: '#',
      icon: PiMoneyWavy
    },
    {
      name: 'Home Owners',
      url: '#',
      icon: HiOutlineHome
    },
    {
      name: 'Documents',
      url: '#',
      icon: IoDocumentTextOutline
    },
    {
      name: 'Reports',
      url: '#',
      icon: HiOutlineClipboardDocumentList
    }
  ]
}

const SidebarLayout = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Acme Inc</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavItems projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  )
}
export default SidebarLayout
