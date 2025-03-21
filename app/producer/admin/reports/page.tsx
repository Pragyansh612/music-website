"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Download,
  User,
  Calendar,
  ChevronDown,
  CheckCircle,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Layers,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [chartType, setChartType] = useState("line")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Sample data for charts
  const downloadData = {
    day: [12, 8, 15, 22, 10, 18, 25],
    week: [85, 120, 95, 110, 75, 130, 105],
    month: [350, 420, 380, 450, 520, 480, 550],
    year: [1200, 1500, 1350, 1800, 2100, 1950, 2300],
  }

  const userRegistrationData = {
    day: [3, 1, 4, 2, 5, 3, 6],
    week: [18, 22, 15, 25, 20, 28, 24],
    month: [75, 85, 65, 95, 80, 110, 90],
    year: [320, 380, 420, 350, 450, 400, 480],
  }

  const popularKits = [
    { name: "Midnight Drums", downloads: 1245, category: "drum-kit", trend: "up" },
    { name: "Lo-Fi Dreams", downloads: 987, category: "sample-pack", trend: "up" },
    { name: "Neon Melodies", downloads: 856, category: "melody-loops", trend: "down" },
    { name: "Urban Essentials", downloads: 742, category: "sample-pack", trend: "up" },
    { name: "Trap Universe", downloads: 635, category: "drum-kit", trend: "down" },
  ]

  const userActivity = [
    { type: "Downloads", count: 3250, percentage: 45, trend: "up" },
    { type: "Registrations", count: 850, percentage: 15, trend: "up" },
    { type: "Page Views", count: 12500, percentage: 30, trend: "down" },
    { type: "Returning Users", count: 1200, percentage: 10, trend: "up" },
  ]

  const categoryDistribution = [
    { category: "Drum Kits", percentage: 40 },
    { category: "Melody Loops", percentage: 25 },
    { category: "Sample Packs", percentage: 20 },
    { category: "Vocal Samples", percentage: 10 },
    { category: "Sound Effects", percentage: 5 },
  ]

  const recentActivity = [
    { type: "download", user: "john_doe", item: "Midnight Drums", time: "2 hours ago" },
    { type: "registration", user: "producer99", time: "5 hours ago" },
    { type: "download", user: "beatmaker", item: "Lo-Fi Dreams", time: "8 hours ago" },
    { type: "download", user: "music_creator", item: "Neon Melodies", time: "1 day ago" },
    { type: "registration", user: "trap_master", time: "1 day ago" },
  ]

  // Helper function to render chart based on type and data
  const renderChart = (type: string, data: number[], labels: string[]) => {
    const maxValue = Math.max(...data) * 1.2
    const chartHeight = 200

    if (type === "line") {
      // Create points for the line chart
      const points = data
        .map((value, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - (value / maxValue) * 100
          return `${x},${y}`
        })
        .join(" ")

      return (
        <div className="w-full h-[200px] mt-4">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" strokeOpacity="0.1" />
            <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeOpacity="0.1" />

            {/* Line */}
            <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="2" points={points} />

            {/* Area under the line */}
            <polyline fill="hsl(var(--primary) / 0.2)" stroke="none" points={`0,100 ${points} 100,100`} />

            {/* Data points */}
            {data.map((value, index) => {
              const x = (index / (data.length - 1)) * 100
              const y = 100 - (value / maxValue) * 100
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth="1"
                />
              )
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {labels.map((label, index) => (
              <div key={index}>{label}</div>
            ))}
          </div>
        </div>
      )
    }

    if (type === "bar") {
      return (
        <div className="w-full h-[200px] mt-4">
          <div className="flex items-end justify-between h-full">
            {data.map((value, index) => {
              const height = (value / maxValue) * 100
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-primary/80 hover:bg-primary transition-colors rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <div className="mt-2 text-xs text-muted-foreground">{labels[index]}</div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  }

  // Generate labels based on time range
  const getLabels = (range: string) => {
    if (range === "day") {
      return ["12am", "4am", "8am", "12pm", "4pm", "8pm", "11pm"]
    } else if (range === "week") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    } else if (range === "month") {
      return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"]
    } else {
      return ["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"]
    }
  }

  return (
    <div>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight neon-text">Website Reports</h1>
            <p className="text-muted-foreground">Comprehensive analytics and insights for your music platform.</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Calendar size={14} />
                  <span>
                    {timeRange === "day"
                      ? "Today"
                      : timeRange === "week"
                        ? "This Week"
                        : timeRange === "month"
                          ? "This Month"
                          : "This Year"}
                  </span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTimeRange("day")}>
                  Today
                  {timeRange === "day" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("week")}>
                  This Week
                  {timeRange === "week" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("month")}>
                  This Month
                  {timeRange === "month" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeRange("year")}>
                  This Year
                  {timeRange === "year" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  {chartType === "line" ? <LineChart size={14} /> : <BarChart3 size={14} />}
                  <span>{chartType === "line" ? "Line Chart" : "Bar Chart"}</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Chart Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setChartType("line")}>
                  <LineChart size={14} className="mr-2" />
                  Line Chart
                  {chartType === "line" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType("bar")}>
                  <BarChart3 size={14} className="mr-2" />
                  Bar Chart
                  {chartType === "bar" && <CheckCircle className="ml-2 h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Downloads</p>
                    <h3 className="text-3xl font-bold">3,250</h3>
                    <p className="text-sm text-green-500 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      <span>+12.5% from last {timeRange}</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Download size={20} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <h3 className="text-3xl font-bold">850</h3>
                    <p className="text-sm text-green-500 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      <span>+8.3% from last {timeRange}</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={20} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Kits</p>
                    <h3 className="text-3xl font-bold">42</h3>
                    <p className="text-sm text-green-500 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      <span>+5.0% from last {timeRange}</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Layers size={20} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Avg. Session</p>
                    <h3 className="text-3xl font-bold">4:32</h3>
                    <p className="text-sm text-red-500 flex items-center">
                      <TrendingDown size={14} className="mr-1" />
                      <span>-2.1% from last {timeRange}</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock size={20} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="downloads" className="w-full">
            <TabsList className="glass">
              <TabsTrigger value="downloads" className="gap-1">
                <Download size={14} className="hidden md:block" />
                <span>Downloads</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-1">
                <User size={14} className="hidden md:block" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="overview" className="gap-1">
                <PieChart size={14} className="hidden md:block" />
                <span>Overview</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="downloads" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Download Trends</CardTitle>
                  <CardDescription>Track the number of downloads over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderChart(chartType, downloadData[timeRange as keyof typeof downloadData], getLabels(timeRange))}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card md:col-span-2">
                  <CardHeader>
                    <CardTitle>Most Popular Kits</CardTitle>
                    <CardDescription>Top performing kits by download count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {popularKits.map((kit, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold text-muted-foreground w-6 text-center">{index + 1}</div>
                            <div>
                              <p className="font-medium">{kit.name}</p>
                              <Badge variant="secondary" className="mt-1">
                                {kit.category === "drum-kit"
                                  ? "Drum Kit"
                                  : kit.category === "melody-loops"
                                    ? "Melody Loops"
                                    : "Sample Pack"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{kit.downloads}</p>
                            {kit.trend === "up" ? (
                              <TrendingUp size={16} className="text-green-500" />
                            ) : (
                              <TrendingDown size={16} className="text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>Downloads by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryDistribution.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm">{category.category}</p>
                            <p className="text-sm font-medium">{category.percentage}%</p>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${category.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-6 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>User Registration Trends</CardTitle>
                  <CardDescription>Track new user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderChart(
                    chartType,
                    userRegistrationData[timeRange as keyof typeof userRegistrationData],
                    getLabels(timeRange),
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Breakdown of user actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userActivity.map((activity, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm">{activity.type}</p>
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-medium">{activity.count.toLocaleString()}</p>
                              {activity.trend === "up" ? (
                                <TrendingUp size={14} className="text-green-500" />
                              ) : (
                                <TrendingDown size={14} className="text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${activity.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card md:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest user actions on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/20">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {activity.type === "download" ? (
                              <Download size={16} className="text-primary" />
                            ) : (
                              <User size={16} className="text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {activity.type === "download"
                                ? `${activity.user} downloaded "${activity.item}"`
                                : `${activity.user} registered an account`}
                            </p>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Platform Growth</CardTitle>
                    <CardDescription>Overall growth metrics for your platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm">Downloads</p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">+32%</p>
                            <TrendingUp size={14} className="text-green-500" />
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "32%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm">Users</p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">+18%</p>
                            <TrendingUp size={14} className="text-green-500" />
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "18%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm">Content</p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">+15%</p>
                            <TrendingUp size={14} className="text-green-500" />
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "15%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm">Revenue</p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">+45%</p>
                            <TrendingUp size={14} className="text-green-500" />
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "45%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>User Demographics</CardTitle>
                    <CardDescription>Breakdown of user demographics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center py-4">
                      <div className="relative h-48 w-48">
                        {/* Simple pie chart visualization */}
                        <svg viewBox="0 0 100 100" className="h-full w-full">
                          {/* Age groups */}
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="hsl(var(--primary))"
                            strokeWidth="20"
                            strokeDasharray="25 75"
                            strokeDashoffset="0"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="hsl(var(--primary) / 0.8)"
                            strokeWidth="20"
                            strokeDasharray="35 65"
                            strokeDashoffset="-25"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="hsl(var(--primary) / 0.6)"
                            strokeWidth="20"
                            strokeDasharray="25 75"
                            strokeDashoffset="-60"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            stroke="hsl(var(--primary) / 0.4)"
                            strokeWidth="20"
                            strokeDasharray="15 85"
                            strokeDashoffset="-85"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <p className="text-sm">18-24 (25%)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: "hsl(var(--primary) / 0.8)" }}
                        />
                        <p className="text-sm">25-34 (35%)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: "hsl(var(--primary) / 0.6)" }}
                        />
                        <p className="text-sm">35-44 (25%)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: "hsl(var(--primary) / 0.4)" }}
                        />
                        <p className="text-sm">45+ (15%)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for your platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold">4.8%</p>
                        <p className="text-sm text-green-500 flex items-center pb-1">
                          <TrendingUp size={14} className="mr-1" />
                          <span>+0.5%</span>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Visitors who download</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Bounce Rate</p>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold">32%</p>
                        <p className="text-sm text-red-500 flex items-center pb-1">
                          <TrendingDown size={14} className="mr-1" />
                          <span>+2.1%</span>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Single page visits</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Avg. Downloads</p>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold">3.8</p>
                        <p className="text-sm text-green-500 flex items-center pb-1">
                          <TrendingUp size={14} className="mr-1" />
                          <span>+0.3</span>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Per user</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Retention Rate</p>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-bold">68%</p>
                        <p className="text-sm text-green-500 flex items-center pb-1">
                          <TrendingUp size={14} className="mr-1" />
                          <span>+5.2%</span>
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Return visitors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

