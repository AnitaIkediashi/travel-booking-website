import { prisma } from "@/lib/prisma";

const randomizeLocations = async () => {
  const response = await prisma.airport.findMany({
    select: {
      city: true,
      country: true,
      image_url: true,
      airport_code: true
    },
  });
  // Shuffle the array here if you want it truly random
  return response.sort(() => Math.random() - 0.5).slice(0, 9);
}
 
export default randomizeLocations;