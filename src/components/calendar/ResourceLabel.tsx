import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { colorMap, type ResourceExtendedProps } from '@/helpers/common'

export default function ResourceLabel(arg: any) {
  const { resource } = arg
  const props = resource.extendedProps as ResourceExtendedProps

  return (
    <div className="flex gap-3 px-2">
      <Avatar>
        <AvatarFallback
          className={cn(
            "text-white text-sm font-medium",
            colorMap[props.colorClass]
          )}
        >
          {resource.extendedProps.initials ?? "LR"}
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
    </div>
  )
}
