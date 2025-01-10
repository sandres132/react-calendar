import { dateFnsLocalizer } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import { enUS, es } from 'date-fns/locale'

const locales = {
    'es': es,
    'en-US': enUS,
}
  
export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});