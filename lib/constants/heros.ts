  
  export interface Hero{
     image: string,
      title: string,
      highlight: string,
      subtitle: string,
      tag: string

  }
  
  export const heroSlides : Hero[] = [
    {
      image: "/banners/bg.jpg",
      title: "Capture Your Journey",
      highlight: "With Expert Eyes",
      subtitle: "Professional photographer guiding you through breathtaking locations. Create memories that last forever.",
      tag: "Professional Photography Tours"
    },
    {
      image: "/banners/bg1.jpg",
      title: "Adventure Awaits",
      highlight: "Every Moment Counts",
      subtitle: "From mountain peaks to ocean depths, we capture the thrill of your greatest adventures.",
      tag: "Adventure Photography"
    },
    {
      image: "/hero-bg-3.jpg",
      title: "Cultural Immersion",
      highlight: "Through the Lens",
      subtitle: "Experience authentic local traditions and capture the soul of every destination.",
      tag: "Cultural Photography"
    },
    {
      image: "/hero-bg-4.jpg",
      title: "Love in Paradise",
      highlight: "Destination Weddings",
      subtitle: "Let us capture your special day in the world's most romantic locations.",
      tag: "Wedding Photography"
    }
  ];