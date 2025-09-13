import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data - will be replaced with real data from database
const recentMembers = [
  {
    name: 'Cover page',
    type: 'Cover page',
    status: 'In Process',
    target: 18,
    limit: 5,
    reviewer: 'Eddie Lake',
  },
  {
    name: 'Table of contents',
    type: 'Table of contents',
    status: 'Done',
    target: 29,
    limit: 24,
    reviewer: 'Eddie Lake',
  },
  {
    name: 'Executive summary',
    type: 'Narrative',
    status: 'Done',
    target: 10,
    limit: 13,
    reviewer: 'Eddie Lake',
  },
  {
    name: 'Technical approach',
    type: 'Narrative',
    status: 'Done',
    target: 27,
    limit: 23,
    reviewer: 'Jamik Tashpulatov',
  },
  {
    name: 'Design',
    type: 'Narrative',
    status: 'In Process',
    target: 2,
    limit: 16,
    reviewer: 'Jamik Tashpulatov',
  },
]

export function RecentActivity() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Tabs defaultValue="outline" className="w-fit">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="outline">Outline</TabsTrigger>
                <TabsTrigger value="performance">Past Performance</TabsTrigger>
                <TabsTrigger value="personnel">Key Personnel</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
              <div>Header</div>
              <div>Section Type</div>
              <div>Status</div>
              <div>Target</div>
              <div>Limit</div>
              <div>Reviewer</div>
              <div></div>
            </div>
            {recentMembers.map((member, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 items-center text-sm">
                <div className="font-medium">{member.name}</div>
                <div className="text-gray-600">{member.type}</div>
                <div>
                  <Badge 
                    variant={member.status === 'Done' ? 'default' : 'secondary'}
                    className={member.status === 'Done' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {member.status}
                  </Badge>
                </div>
                <div>{member.target}</div>
                <div>{member.limit}</div>
                <div className="text-gray-600">{member.reviewer}</div>
                <div className="flex justify-end">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quick Actions</span>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Customize Columns
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="font-medium">Add New Member</div>
            <div className="text-sm text-gray-600">Register a new gym member</div>
          </button>
          <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="font-medium">Quick Check-in</div>
            <div className="text-sm text-gray-600">Check-in existing member</div>
          </button>
          <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="font-medium">Sell Day Pass</div>
            <div className="text-sm text-gray-600">Create day pass for walk-in</div>
          </button>
          <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors">
            <div className="font-medium">View Reports</div>
            <div className="text-sm text-gray-600">Access revenue analytics</div>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}