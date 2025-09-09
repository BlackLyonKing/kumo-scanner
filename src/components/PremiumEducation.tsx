import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  Trophy,
  PlayCircle,
  BookOpen,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import CryptoPayment from './CryptoPayment';

const PremiumEducation = () => {
  const [activeTab, setActiveTab] = useState("courses");

  const courses = [
    {
      title: "Complete Ichimoku Mastery",
      level: "Beginner to Advanced", 
      duration: "8 hours",
      modules: 12,
      price: "0.068 ETH",
      rating: 4.9,
      students: "342",
      description: "Master the complete Ichimoku system from basic concepts to advanced trading strategies.",
      features: [
        "Cloud analysis techniques",
        "Multi-timeframe analysis", 
        "Risk management strategies",
        "Live trading examples",
        "Lifetime access"
      ]
    },
    {
      title: "Advanced Chart Patterns",
      level: "Intermediate",
      duration: "6 hours", 
      modules: 8,
      price: "0.055 ETH",
      rating: 4.8,
      students: "187",
      description: "Learn to identify and trade the most profitable chart patterns in crypto markets.",
      features: [
        "20+ chart patterns",
        "Pattern recognition tools",
        "Entry and exit strategies", 
        "Backtesting methods",
        "Pattern scanner access"
      ]
    },
    {
      title: "Crypto Market Psychology",
      level: "All Levels",
      duration: "4 hours",
      modules: 6, 
      price: "0.045 ETH",
      rating: 4.7,
      students: "256",
      description: "Understand market psychology and emotional discipline for consistent profits.",
      features: [
        "Fear and greed cycles",
        "Market sentiment analysis",
        "Emotional control techniques",
        "Trading psychology tests",
        "Mental frameworks"
      ]
    }
  ];

  const webinars = [
    {
      title: "Weekly Market Analysis",
      date: "Every Wednesday",
      time: "8:00 PM EST",
      duration: "60 min",
      instructor: "Crypto-Lion",
      topic: "Live Ichimoku analysis of top crypto pairs",
      attendees: "89+",
      price: "Free for Premium Members"
    },
    {
      title: "Trading Strategy Deep Dive", 
      date: "Every Friday",
      time: "7:00 PM EST",
      duration: "90 min",
      instructor: "BegCoins",
      topic: "Advanced trading strategies and Q&A session",
      attendees: "67+", 
      price: "0.0007 ETH/session"
    },
    {
      title: "Market News & Events Impact",
      date: "Every Monday",
      time: "9:00 AM EST", 
      duration: "45 min",
      instructor: "Crypto-Lion",
      topic: "How major events affect crypto markets",
      attendees: "124+",
      price: "Free for All Members"
    }
  ];

  const coachingSessions = [
    {
      title: "1-on-1 Trading Mentorship",
      duration: "60 minutes",
      price: "0.075 ETH",
      description: "Personalized trading guidance with expert mentors",
      features: [
        "Portfolio review",
        "Personalized strategy development", 
        "Live trading session",
        "Custom action plan",
        "Follow-up email summary"
      ],
      availability: "Book 24/7"
    },
    {
      title: "Strategy Optimization Session",
      duration: "45 minutes", 
      price: "0.058 ETH",
      description: "Optimize your existing trading strategies",
      features: [
        "Strategy backtesting",
        "Performance analysis",
        "Risk assessment",
        "Improvement recommendations",
        "Trading journal review"
      ],
      availability: "Weekdays Only"
    },
    {
      title: "Psychology Coaching",
      duration: "30 minutes",
      price: "0.048 ETH", 
      description: "Overcome emotional trading challenges",
      features: [
        "Emotional assessment",
        "Mindset coaching",
        "Discipline techniques",
        "Stress management",
        "Mental exercises"
      ],
      availability: "Flexible Scheduling"
    }
  ];

  const masterclasses = [
    {
      title: "Advanced Technical Analysis Masterclass",
      instructor: "BegCoins Academy",
      duration: "3 days",
      date: "March 15-17, 2024",
      price: "0.072 ETH",
      earlyBird: "0.052 ETH",
      description: "Intensive 3-day masterclass covering advanced TA concepts",
      topics: [
        "Multi-timeframe analysis",
        "Volume profile trading",
        "Market structure analysis", 
        "Advanced indicator combinations",
        "Live trading simulations"
      ],
      includes: [
        "Live instruction",
        "Recording access",
        "Course materials",
        "Certificate of completion",
        "1 month mentorship"
      ]
    },
    {
      title: "Algorithmic Trading Bootcamp",
      instructor: "Crypto-Lion Institute", 
      duration: "5 days",
      date: "April 8-12, 2024",
      price: "0.078 ETH",
      earlyBird: "0.062 ETH",
      description: "Learn to build and deploy automated trading systems",
      topics: [
        "Python for trading",
        "API integration",
        "Strategy backtesting",
        "Risk management systems",
        "Portfolio optimization"
      ],
      includes: [
        "Code templates",
        "Trading bot setup",
        "Live server access",
        "Ongoing support",
        "Alumni network access"
      ]
    }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Premium Trading Education
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="webinars">Live Webinars</TabsTrigger>
            <TabsTrigger value="coaching">1-on-1 Coaching</TabsTrigger>
            <TabsTrigger value="masterclasses">Masterclasses</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6 space-y-4">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
              {courses.map((course, index) => (
                <Card key={index} className="border border-border bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{course.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{course.level}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            {course.modules} modules
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{course.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">({course.students} students)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{course.price}</div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{course.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-foreground">What you will learn:</h4>
                      <ul className="space-y-1">
                        {course.features.map((feature, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <Target className="h-3 w-3 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <CryptoPayment 
                        amount={course.price}
                        title={course.title}
                        description="Premium Trading Course"
                      >
                        <Button className="flex-1">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Enroll Now
                        </Button>
                      </CryptoPayment>
                      <Button variant="outline">Preview</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="webinars" className="mt-6 space-y-4">
            <div className="space-y-4">
              {webinars.map((webinar, index) => (
                <Card key={index} className="border border-border bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{webinar.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {webinar.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {webinar.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {webinar.attendees} attendees
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Instructor:</strong> {webinar.instructor}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{webinar.price}</div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{webinar.topic}</p>
                    
                    <div className="flex gap-2">
                      {webinar.price.includes('ETH') ? (
                        <CryptoPayment 
                          amount={webinar.price.replace('/session', '')}
                          title={webinar.title}
                          description="Live Trading Session"
                        >
                          <Button>
                            <Video className="h-4 w-4 mr-2" />
                            Register Now
                          </Button>
                        </CryptoPayment>
                      ) : (
                        <Button>
                          <Video className="h-4 w-4 mr-2" />
                          Register Now
                        </Button>
                      )}
                      <Button variant="outline">Add to Calendar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coaching" className="mt-6 space-y-4">
            <div className="space-y-4">
              {coachingSessions.map((session, index) => (
                <Card key={index} className="border border-border bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{session.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.availability}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{session.price}</div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{session.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-foreground">Session includes:</h4>
                      <ul className="space-y-1">
                        {session.features.map((feature, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <Target className="h-3 w-3 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <CryptoPayment 
                        amount={session.price}
                        title={session.title}
                        description="1-on-1 Coaching Session"
                      >
                        <Button>
                          <Users className="h-4 w-4 mr-2" />
                          Book Session
                        </Button>
                      </CryptoPayment>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="masterclasses" className="mt-6 space-y-4">
            <div className="space-y-6">
              {masterclasses.map((masterclass, index) => (
                <Card key={index} className="border border-border bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{masterclass.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            {masterclass.instructor}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {masterclass.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {masterclass.duration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{masterclass.price}</div>
                        <div className="text-sm text-destructive">Early Bird: {masterclass.earlyBird}</div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{masterclass.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Topics Covered:</h4>
                        <ul className="space-y-1">
                          {masterclass.topics.map((topic, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <TrendingUp className="h-3 w-3 text-primary" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-foreground mb-2">What's Included:</h4>
                        <ul className="space-y-1">
                          {masterclass.includes.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <Zap className="h-3 w-3 text-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <CryptoPayment 
                        amount={masterclass.earlyBird}
                        title={masterclass.title}
                        description="Early Bird Workshop Access"
                      >
                        <Button>
                          <Trophy className="h-4 w-4 mr-2" />
                          Reserve Spot (Early Bird)
                        </Button>
                      </CryptoPayment>
                      <Button variant="outline">Download Brochure</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PremiumEducation;