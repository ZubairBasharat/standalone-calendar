import type { ResourceLabelContentArg } from "@fullcalendar/resource"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, ClipboardClock, Clock, EllipsisVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { bgColors, getInitials } from '@/helpers/common'
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem } from '../ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router'

export default function ResourceLabel(arg: ResourceLabelContentArg) {
  const navigate = useNavigate()
  const { resource } = arg
//   const props = resource.extendedProps as ResourceExtendedProps
  return (
    <div className="flex gap-3 px-2">
      <Avatar>
        <AvatarImage src={`https://randomuser.me/api/portraits/men/${resource.id}.jpg`} />
        <AvatarFallback
          className={cn(
            "text-white text-sm font-medium",
            bgColors[Math.floor(Math.random() * bgColors.length)]
          )}
        >
          {getInitials(resource.title)}
        </AvatarFallback>
      </Avatar>

      <div>
        <div className="font-medium">{resource.title}</div>
        <div className="text-[12px] text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {resource.extendedProps.hours ?? 0} hours
        </div>
        <div className="text-green-600 cursor-pointer text-[12px]">
          View availability
        </div>
      </div>
      <div className="ms-auto">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button className="w-[8px] ring-0! justify-center shadown-none bg-transparent hover:bg-transparent cursor-pointer text-foreground p-0! h-auto!">
                <EllipsisVertical className='w-4! h-4! text-gray-400' />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white border min-w-40">
                <DropdownMenuGroup>
                    <DropdownMenuItem className='cursor-pointer'>
                        <div className="flex items-center gap-2">
                            <ClipboardClock />
                            <span>Timesheet</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'>
                        <div className="flex items-center gap-2" onClick={() => navigate(`/staff/${resource.id}`)}>
                            <Calendar />
                            <span>Calendar</span>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
