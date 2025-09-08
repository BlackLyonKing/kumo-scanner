import React from "react";
import { Book, TrendingUp, Shield, Brain, ArrowLeft, Lock, Play, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Education = () => {
  const courses = [
    {
      id: 1,
      title: "Ichimoku Cloud Mastery",
      description: "Complete guide to understanding and trading with Ichimoku indicators",
      level: "Beginner",
      duration: "2 hours",
      lessons: 8,
      rating: 4.9,
      price: "Free",
      isPremium: false,
      topics: ["Tenkan-sen", "Kijun-sen", "Senkou Span", "Chikou Span"]
    },
    {
      id: 2,
      title: "Advanced Technical Analysis",
      description: "Professional trading strategies combining multiple indicators",
      level: "Advanced",
      duration: "4 hours",
      lessons: 12,
      rating: 4.8,
      price: "$49",
      isPremium: true,
      topics: ["Multi-timeframe analysis", "Volume analysis", "Market structure"]
    },
    {
      id: 3,
      title: "Crypto Trading Psychology",
      description: "Master your emotions and develop disciplined trading habits",
      level: "Intermediate",
      duration: "3 hours",
      lessons: 10,
      rating: 4.7,
      price: "$29",
      isPremium: true,
      topics: ["Fear & Greed", "Risk management", "Trading discipline"]
    },
    {
      id: 4,
      title: "Portfolio Management",
      description: "Build and manage a diversified crypto portfolio",
      level: "Intermediate",
      duration: "2.5 hours",
      lessons: 9,
      rating: 4.6,
      price: "$39",
      isPremium: true,
      topics: ["Asset allocation", "Rebalancing", "Risk assessment"]
    }
  ];

  const quickGuides = [
    {
      title: "Reading Ichimoku Signals",
      description: "Quick reference for bullish and bearish setups",
      readTime: "5 min read",
      category: "Technical Analysis"
    },
    {
      title: "Setting Stop Losses",
      description: "Protect your capital with proper risk management",
      readTime: "3 min read",
      category: "Risk Management"
    },
    {
      title: "Market Timing Strategies",
      description: "When to enter and exit positions",
      readTime: "7 min read",
      category: "Strategy"
    },
    {
      title: "Crypto Market Cycles",
      description: "Understanding bull and bear market phases",
      readTime: "6 min read",
      category: "Market Analysis"
    }
  ];

  const webinars = [
    {
      title: "Live Trading Session: Bitcoin Analysis",
      date: "Dec 15, 2024",
      time: "2:00 PM EST",
      duration: "60 min",
      instructor: "Mike Chen",
      isPremium: true
    },
    {
      title: "Weekly Market Outlook",
      date: "Dec 12, 2024",
      time: "6:00 PM EST",
      duration: "45 min",
      instructor: "Sarah Johnson",
      isPremium: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Scanner
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Book className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Trading Education</h1>
              </div>
            </div>
            <Button className="premium-button">
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Master Crypto Trading
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From beginner basics to advanced strategies, learn everything you need to become a profitable crypto trader
          </p>
        </div>

        {/* Featured Courses */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Featured Courses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="glass-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={course.level === "Beginner" ? "secondary" : course.level === "Intermediate" ? "default" : "destructive"}>
                      {course.level}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {course.isPremium && <Lock className="h-4 w-4 text-accent" />}
                      <span className="font-bold text-lg">{course.price}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      {course.rating}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    className={course.isPremium ? "premium-button w-full" : "w-full"}
                    disabled={course.isPremium}
                  >
                    {course.isPremium ? "Premium Required" : "Start Learning"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Guides */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Quick Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickGuides.map((guide, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <Badge variant="outline" className="w-fit text-xs">
                    {guide.category}
                  </Badge>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                  <p className="text-xs text-primary font-medium">{guide.readTime}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Webinars */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Upcoming Webinars
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {webinars.map((webinar, index) => (
              <Card key={index} className="glass-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{webinar.title}</CardTitle>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{webinar.date} • {webinar.time}</p>
                        <p>Duration: {webinar.duration}</p>
                        <p>Instructor: {webinar.instructor}</p>
                      </div>
                    </div>
                    {webinar.isPremium && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className={webinar.isPremium ? "premium-button w-full" : "w-full"}
                    disabled={webinar.isPremium}
                  >
                    {webinar.isPremium ? "Premium Required" : "Register Free"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl p-8">
          <h3 className="text-3xl font-bold mb-4">Ready to Level Up Your Trading?</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get unlimited access to all premium courses, live webinars, and 1-on-1 coaching sessions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="premium-button">
              Start Premium Trial
            </Button>
            <Button variant="outline" size="lg">
              View Pricing Plans
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Education;