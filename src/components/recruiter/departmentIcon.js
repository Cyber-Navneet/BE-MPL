import { BriefcaseBusiness, ChartColumn, LayoutGrid, Megaphone, PenTool, SquareTerminal } from 'lucide-react'

const DEPARTMENT_ICONS = {
  Engineering: SquareTerminal,
  Design: PenTool,
  Data: ChartColumn,
  Product: LayoutGrid,
  Marketing: Megaphone,
}

export const departmentIcon = (department) => DEPARTMENT_ICONS[department] ?? BriefcaseBusiness
