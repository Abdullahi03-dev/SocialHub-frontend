import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import heroImage from "@/assets/hero-image.svg";
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Zap, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Connect with Others",
    description: "Build meaningful connections with people who share your interests and passions."
  },
  {
    icon: MessageSquare,
    title: "Rich Conversations",
    description: "Engage in thoughtful discussions with advanced commenting and interaction features."
  },
  {
    icon: Share2,
    title: "Share Your Story",
    description: "Express yourself through posts, images, and multimedia content that matters to you."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience blazing fast performance with real-time updates and seamless interactions."
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is protected with enterprise-grade security and privacy controls."
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Perfect experience across all devices - desktop, tablet, and mobile."
  }
];

const benefits = [
  "Connect with like-minded individuals",
  "Share your thoughts and experiences",
  "Discover trending topics and discussions",
  "Build your personal brand",
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isAuthenticated={false} />
      
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container relative py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center justify-center px-7">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-hero gradient-primary bg-clip-text text-transparent">
                  Connect, Share, Inspire
                </h1>
                <p className="text-subtitle max-w-xl">
                  Join a community where your voice matters. Share your thoughts, 
                  connect with others, and be part of meaningful conversations.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="btn-hero">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" size="lg" className="btn-secondary">
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Free to join
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  No spam, ever
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Mobile friendly
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-3xl opacity-20 blur-3xl"></div>
              <img 
                src={heroImage}
                alt="Social platform hero"
                className="relative z-10 w-full h-[450px] rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-subtle">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SocialHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build meaningful connections and share your story
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-interactive hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg gradient-primary mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/*THIS IS BENEFIT SECTION*/}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center px-8">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Join thousands of users who love SocialHub
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Be part of a growing community that values authentic connections 
                and meaningful conversations.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6 border-l-4 border-l-primary">
                <div className="flex items-start space-x-4">
                  <div>
                    <p className="font-medium">Stephnie Godwin</p>
                    <p className="text-sm text-muted-foreground mb-2">Web Dev</p>
                    <p className="italic">"SocialHub has transformed how I connect with my audience. The interface is beautiful and amazing!"</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-l-4 border-l-primary">
                <div className="flex items-start space-x-4">
                  <div>
                    <p className="font-medium">Daniel Ishaku</p>
                    <p className="text-sm text-muted-foreground mb-2">Entrepreneur</p>
                    <p className="italic">"The perfect platform for building professional relationships while keeping things personal and authentic."</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/*THIS S CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join our community today and start connecting with people who matter
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-white text-white bg-white/10">
                  Sign In Instead
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {/* <div className="h-8 w-8 rounded-lg gradient-primary"></div> */}
              <span className="font-heading text-xl font-bold ml-3">SocialHub</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} SocialHub
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;