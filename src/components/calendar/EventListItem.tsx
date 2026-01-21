import { formatTime12Hours, statusColorMap, type EventType } from '@/helpers/common'
import { cn } from '@/lib/utils';
import { RefreshCcw } from 'lucide-react';
import type { EventImpl } from '@fullcalendar/core/internal';

const EventListItem = ({
    event,
    onClick,
}
    : {
        event: EventImpl,
        onClick: (event: EventImpl) => void
    }) => {
    return (
        <div
            className="cursor-grab select-none text-xs text-slate-900 leading-tight  rounded-[1px]"
            onClick={() => onClick(event)}
            title="Click to select. Ctrl/Cmd for multi-select. Double-click to open actions."
        >
            {renderShiftLine1(event)}
            {renderShiftLine2(event.extendedProps.carer)}
        </div>
    )
}

function renderShiftLine1(event: EventImpl) {
    const bgClass = statusColorMap[event.extendedProps.status] || 'bg-slate-400';

    return (
        <div className="flex gap-2 items-center">
            {!event._def.recurringDef ? (
                <div className={
                    cn(
                        "shrink-0 w-2 h-2 mt-1 bg-slate-400 rounded-full",
                        bgClass
                    )
                } />
            )
                : (
                    <RefreshCcw className='w-3 h-3 text-green-600' />
                )
            }
            <div className='flex items-center justify-between flex-1'>
                <span className="font-medium">{event.title}</span>
                <span className="uppercase text-[11px] text-[#94a3b8] font-medium">{event.start && formatTime12Hours(event.start)}</span>
            </div>
        </div>
    );
}

function renderShiftLine2(carer: EventType['carer']) {
    return (
        <div className="flex gap-1 items-center color-[#0f172a] text-[11px] mt-[2px] ml-[2px]">
            <span className='h-1 w-1 bg-slate-400 rounded-full'></span>{carer.name}
        </div>
    );
}

export default EventListItem
