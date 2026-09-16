import { prisma } from "../lib/prisma";
import { faker } from "@faker-js/faker";

const DEAD_IMAGE_HOST = "loremflickr.com";

async function backfillHotelThumbnails() {
  const hotels = await prisma.hotels.findMany({
    select: { id: true, thumb_nails: true },
  });

  const stale = hotels.filter((h) =>
    h.thumb_nails.some((url) => url.includes(DEAD_IMAGE_HOST)),
  );

  console.log(`Hotels with stale thumbnails: ${stale.length}`);

  await Promise.all(
    stale.map((hotel) =>
      prisma.hotels.update({
        where: { id: hotel.id },
        data: {
          thumb_nails: hotel.thumb_nails.map(() =>
            faker.image.urlPicsumPhotos(),
          ),
        },
      }),
    ),
  );

  console.log("Hotel thumbnails backfilled.");
}

async function backfillReviewImages() {
  const staleReviews = await prisma.reviews.findMany({
    where: { image: { contains: DEAD_IMAGE_HOST } },
    select: { id: true },
  });

  console.log(`Reviews with stale images: ${staleReviews.length}`);

  await Promise.all(
    staleReviews.map((review) =>
      prisma.reviews.update({
        where: { id: review.id },
        data: { image: faker.image.avatar() },
      }),
    ),
  );

  console.log("Review images backfilled.");
}

async function backfillAirportImages() {
  const staleAirports = await prisma.airport.findMany({
    where: { image_url: { contains: DEAD_IMAGE_HOST } },
    select: { airport_code: true },
  });

  console.log(`Airports with stale images: ${staleAirports.length}`);

  await Promise.all(
    staleAirports.map((airport) =>
      prisma.airport.update({
        where: { airport_code: airport.airport_code },
        data: {
          image_url: faker.image.urlPicsumPhotos({ width: 100, height: 100 }),
        },
      }),
    ),
  );

  console.log("Airport images backfilled.");
}

async function backfillImages() {
  await backfillHotelThumbnails();
  await backfillReviewImages();
  await backfillAirportImages();
  console.log("All image backfills complete.");
}

backfillImages()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
