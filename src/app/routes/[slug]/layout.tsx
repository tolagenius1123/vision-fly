import { Metadata } from "next";
import { getRouteBySlug, getAllRouteSlugs } from "@/lib/routesData";

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = getRouteBySlug(params.slug);
  
  if (!route) {
    return {
      title: "Route Not Found | Vision Fly",
      description: "The requested flight route could not be found.",
    };
  }

  return {
    title: `Cheap Flights from ${route.origin} to ${route.destination} | Book Private & Commercial | Vision Fly`,
    description: `Book private jet charter flights from ${route.origin} (${route.originCode}) to ${route.destination} (${route.destinationCode}). Starting from ${route.price}. Flight time: ${route.duration}. Premium air travel with Vision Fly.`,
    keywords: [
      `${route.origin} to ${route.destination} flights`,
      `private jet ${route.origin} ${route.destination}`,
      `charter flight ${route.originCode} ${route.destinationCode}`,
      `Nigeria private aviation`,
      `Vision Fly charter`,
    ],
    openGraph: {
      title: `${route.origin} to ${route.destination} Private Flights | Vision Fly`,
      description: `Book premium private jet charter from ${route.origin} to ${route.destination}. Direct flights starting from ${route.price}.`,
      type: "website",
      siteName: "Vision Fly",
    },
    twitter: {
      card: "summary_large_image",
      title: `${route.origin} to ${route.destination} Flights | Vision Fly`,
      description: `Private charter flights from ${route.originCode} to ${route.destinationCode}. Book now!`,
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllRouteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function RouteLayout({ children }: Props) {
  return <>{children}</>;
}
