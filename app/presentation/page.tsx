'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, BarChart3, Calendar, CheckCircle, Clock, CreditCard, Dumbbell, Pause, Play, Plus, Search, User, Users } from 'lucide-react'

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 py-8">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Summit Gym + CrossFit
          </h1>
          <h2 className="text-2xl text-slate-600 mb-8">
            Complete Management System Proposal
          </h2>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-lg">Next.js 15</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-lg">Neon Database</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-lg">Gmail Auth</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-lg">Tailwind + shadcn/ui</Badge>
          </div>
        </div>

        {/* Business Model Overview */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Business Model & Revenue Splitting
            </CardTitle>
            <CardDescription className="text-lg">
              Dual business partnership with automated revenue tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Revenue Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span>Gym-only memberships</span>
                    <Badge className="bg-green-600">100% Gym</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span>Combo memberships</span>
                    <div className="flex gap-2">
                      <Badge className="bg-orange-600">80% CrossFit</Badge>
                      <Badge className="bg-green-600">20% Gym</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Shop sales</span>
                    <Badge className="bg-green-600">100% Gym</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">System Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Member Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Day Pass Sales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Pause/Resume Plans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Shop Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Revenue Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Gmail Authentication</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Table */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-green-600" />
              Pricing Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="text-center font-bold">Gym/Steam/Ice-bath</TableHead>
                    <TableHead className="text-center font-bold">Fitness Classes</TableHead>
                    <TableHead className="text-center font-bold">Group Training</TableHead>
                    <TableHead className="text-center font-bold">Open-Gym</TableHead>
                    <TableHead className="text-center font-bold">Group Training + Open-Gym</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Drop-in</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">300 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">300 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">600 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">450 ฿</TableCell>
                    <TableCell className="text-center">-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      5-pass
                      <div className="text-xs text-slate-500">Validity: 1 month - Cannot be shared</div>
                    </TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">1,250 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">1,250 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">2,250 ฿</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center">-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">1-month</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">1,900 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">2,800 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">4,200 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">3,000 ฿</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">5,000 ฿</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">3-month</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">5,100 ฿</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">11,400 ฿</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">13,500 ฿</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6-month</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">9,000 ฿</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">21,600 ฿</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">25,800 ฿</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">12-month</TableCell>
                    <TableCell className="text-center text-orange-600 font-bold">16,000 ฿</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-center">-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Admin Interface Mockups */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Activity className="h-8 w-8 text-purple-600" />
              Admin Dashboard Interface
            </CardTitle>
            <CardDescription className="text-lg">
              Real UI components using shadcn/ui - Mobile responsive for tablets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="checkin">Check-in</TabsTrigger>
                <TabsTrigger value="daypass">Day Pass</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">247</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Today&apos;s Revenue</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12,450 ฿</div>
                      <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Day Passes Sold</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">23</div>
                      <p className="text-xs text-muted-foreground">+3 from yesterday</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Check-ins Today</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-xs text-muted-foreground">Peak: 2-4 PM</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Check-ins</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">John Smith</p>
                              <p className="text-sm text-muted-foreground">CrossFit - 3-month plan</p>
                            </div>
                          </div>
                          <Badge variant="secondary">14:32</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Maria Garcia</p>
                              <p className="text-sm text-muted-foreground">Gym - 1-month plan</p>
                            </div>
                          </div>
                          <Badge variant="secondary">14:25</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">Day Pass Customer</p>
                              <p className="text-sm text-muted-foreground">CrossFit Drop-in</p>
                            </div>
                          </div>
                          <Badge variant="secondary">14:20</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Split Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-green-600">Gym Revenue</span>
                            <span className="font-bold">4,890 ฿</span>
                          </div>
                          <div className="w-full bg-green-100 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: '39%'}}></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-orange-600">CrossFit Revenue</span>
                            <span className="font-bold">7,560 ฿</span>
                          </div>
                          <div className="w-full bg-orange-100 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{width: '61%'}}></div>
                          </div>
                        </div>
                        <div className="border-t pt-2 mt-4">
                          <div className="flex items-center justify-between font-bold text-lg">
                            <span>Total Revenue</span>
                            <span>12,450 ฿</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <h3 className="text-xl font-semibold">Member Management</h3>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Member
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Member</CardTitle>
                    <CardDescription>Register a new member with passport or email</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passport">Passport ID</Label>
                        <Input id="passport" placeholder="Enter passport number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email address" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="Enter phone number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plan">Plan Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select plan type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gym-only">Gym Only</SelectItem>
                            <SelectItem value="gym-crossfit">Gym + CrossFit</SelectItem>
                            <SelectItem value="fitness-class">Fitness Classes</SelectItem>
                            <SelectItem value="5pass-gym">5-pass Gym</SelectItem>
                            <SelectItem value="5pass-crossfit">5-pass CrossFit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Month</SelectItem>
                            <SelectItem value="3">3 Months</SelectItem>
                            <SelectItem value="6">6 Months</SelectItem>
                            <SelectItem value="12">12 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button>Register Member</Button>
                      <Button variant="outline">Calculate Price</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Current Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">John Smith</p>
                              <p className="text-sm text-muted-foreground">john@email.com</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Gym + CrossFit (3-month)</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-600">Active</Badge>
                          </TableCell>
                          <TableCell>Dec 15, 2024</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Pause className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Calendar className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">Maria Garcia</p>
                              <p className="text-sm text-muted-foreground">maria@email.com</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">Gym Only (1-month)</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-600">Paused</Badge>
                          </TableCell>
                          <TableCell>Jan 20, 2025 (14 days left)</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Play className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Calendar className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div>
                              <p className="font-medium">Alex Chen</p>
                              <p className="text-sm text-muted-foreground">alex@email.com</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">5-pass CrossFit</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-red-600">Expired</Badge>
                          </TableCell>
                          <TableCell>Nov 30, 2024</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <CreditCard className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="checkin" className="space-y-6">
                <h3 className="text-xl font-semibold">Member Check-in System</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Quick Member Lookup
                    </CardTitle>
                    <CardDescription>Search by passport ID or email for fast check-in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter passport ID or email..." 
                          className="flex-1 text-lg"
                        />
                        <Button size="lg">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-green-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">John Smith</h4>
                              <p className="text-sm text-muted-foreground">john@email.com</p>
                            </div>
                          </div>
                          <Badge className="bg-green-600 text-lg px-4 py-2">ACTIVE</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Plan Type</p>
                            <p className="font-bold">Gym + CrossFit</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Duration</p>
                            <p className="font-bold">3 months</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Expires</p>
                            <p className="font-bold">Dec 15, 2024</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1" size="lg">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Check-in to Gym
                          </Button>
                          <Button className="flex-1" size="lg" variant="outline">
                            <Dumbbell className="h-4 w-4 mr-2" />
                            Check-in to CrossFit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Today&apos;s Check-ins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-600">GYM</Badge>
                          <div>
                            <p className="font-medium">John Smith</p>
                            <p className="text-sm text-muted-foreground">14:32 - 3-month plan</p>
                          </div>
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-orange-600">CROSSFIT</Badge>
                          <div>
                            <p className="font-medium">Maria Garcia</p>
                            <p className="text-sm text-muted-foreground">14:25 - Day pass</p>
                          </div>
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-600">FITNESS</Badge>
                          <div>
                            <p className="font-medium">Alex Chen</p>
                            <p className="text-sm text-muted-foreground">14:20 - 5-pass (3 remaining)</p>
                          </div>
                        </div>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="daypass" className="space-y-6">
                <h3 className="text-xl font-semibold">Day Pass Sales</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Dumbbell className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-bold text-lg">Gym Day Pass</h4>
                      <p className="text-2xl font-bold text-green-600 mt-2">300 ฿</p>
                      <p className="text-sm text-muted-foreground">Access to gym, steam & ice-bath</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-lg">Fitness Class</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-2">300 ฿</p>
                      <p className="text-sm text-muted-foreground">Single fitness class entry</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-orange-600" />
                      </div>
                      <h4 className="font-bold text-lg">CrossFit Drop-in</h4>
                      <p className="text-2xl font-bold text-orange-600 mt-2">600 ฿</p>
                      <p className="text-sm text-muted-foreground">Single CrossFit session</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-lg">Open Gym</h4>
                      <p className="text-2xl font-bold text-purple-600 mt-2">450 ฿</p>
                      <p className="text-sm text-muted-foreground">Open gym access</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Day Pass Sale</CardTitle>
                    <CardDescription>Fast checkout for walk-in customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Customer Name (Optional)</Label>
                        <Input id="customer-name" placeholder="Enter name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pass-type">Pass Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pass type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gym">Gym Day Pass - 300 ฿</SelectItem>
                            <SelectItem value="fitness">Fitness Class - 300 ฿</SelectItem>
                            <SelectItem value="crossfit">CrossFit Drop-in - 600 ฿</SelectItem>
                            <SelectItem value="opengym">Open Gym - 450 ฿</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold text-2xl text-green-600">600 ฿</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">CrossFit Drop-in selected</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="lg" className="flex-1">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Process Payment
                      </Button>
                      <Button size="lg" variant="outline">
                        Print Receipt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-6">
                <h3 className="text-xl font-semibold">Revenue Analytics & Reports</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">284,750 ฿</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Gym Share</span>
                          <span className="font-medium">67,850 ฿</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>CrossFit Share</span>
                          <span className="font-medium">216,900 ฿</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Popular Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">1-month Combo</span>
                          <Badge>89 members</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">3-month CrossFit</span>
                          <Badge variant="secondary">67 members</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Gym Only</span>
                          <Badge variant="outline">45 members</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Day Pass Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">CrossFit Drop-ins</span>
                          <span className="font-medium">156 passes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Gym Day Passes</span>
                          <span className="font-medium">89 passes</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Fitness Classes</span>
                          <span className="font-medium">67 passes</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Detailed analysis of income sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Memberships</span>
                          <span className="font-bold">218,450 ฿ (77%)</span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-3">
                          <div className="bg-blue-600 h-3 rounded-full" style={{width: '77%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Day Passes</span>
                          <span className="font-bold">45,600 ฿ (16%)</span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-3">
                          <div className="bg-green-600 h-3 rounded-full" style={{width: '16%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Shop Sales</span>
                          <span className="font-bold">20,700 ฿ (7%)</span>
                        </div>
                        <div className="w-full bg-purple-100 rounded-full h-3">
                          <div className="bg-purple-600 h-3 rounded-full" style={{width: '7%'}}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Timeline */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Implementation Timeline
            </CardTitle>
            <CardDescription className="text-lg">
              Phased development approach for quick deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div className="flex-1">
                  <h4 className="font-bold">Phase 1: Core System (Week 1-2)</h4>
                  <p className="text-sm text-muted-foreground">Database setup, authentication, basic member management</p>
                </div>
                <Badge className="bg-green-600">Essential</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div className="flex-1">
                  <h4 className="font-bold">Phase 2: Operations (Week 3-4)</h4>
                  <p className="text-sm text-muted-foreground">Check-in system, day passes, payment tracking</p>
                </div>
                <Badge className="bg-blue-600">High Priority</Badge>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div className="flex-1">
                  <h4 className="font-bold">Phase 3: Advanced Features (Week 5-6)</h4>
                  <p className="text-sm text-muted-foreground">Analytics, reports, shop management, pause system</p>
                </div>
                <Badge className="bg-purple-600">Enhanced</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Ready to Build This System?</CardTitle>
            <CardDescription className="text-center text-lg">
              Complete gym + crossfit management solution with real-time revenue tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Automated Revenue Splitting</h4>
                <p className="text-sm text-muted-foreground">80% CrossFit, 20% Gym for combo plans</p>
              </div>
              <div className="p-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Complete Member Management</h4>
                <p className="text-sm text-muted-foreground">Memberships, day passes, pause/resume</p>
              </div>
              <div className="p-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold mb-2">Real-time Analytics</h4>
                <p className="text-sm text-muted-foreground">Track performance, revenue, and trends</p>
              </div>
            </div>
            <Button size="lg" className="text-lg px-8 py-3">
              Let&apos;s Start Building! 🚀
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}