import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  ArrowUpIcon,
  ArrowDownIcon 
} from 'lucide-react'

// Mock data - will be replaced with real data from database
const stats = [
  {
    title: 'Total Revenue',
    value: '฿12,500',
    change: '+12.5%',
    trend: 'up',
    description: 'Trending up this month',
    detail: 'Visitors for the last 6 months',
    icon: TrendingUp,
  },
  {
    title: 'New Members',
    value: '1,234',
    change: '-20%',
    trend: 'down',
    description: 'Down 20% this period',
    detail: 'Acquisition needs attention',
    icon: Users,
  },
  {
    title: 'Active Members',
    value: '45,678',
    change: '+12.5%',
    trend: 'up',
    description: 'Strong member retention',
    detail: 'Engagement exceed targets',
    icon: Calendar,
  },
  {
    title: 'Growth Rate',
    value: '4.5%',
    change: '+4.5%',
    trend: 'up',
    description: 'Steady performance increase',
    detail: 'Meets growth projections',
    icon: CreditCard,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge 
                  variant={stat.trend === 'up' ? 'default' : 'secondary'}
                  className={`flex items-center gap-1 ${
                    stat.trend === 'up' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpIcon className="h-3 w-3" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {stat.description}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stat.detail}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}