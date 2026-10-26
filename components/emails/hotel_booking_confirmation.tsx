/* eslint-disable @next/next/no-head-element */

type HotelRoomInfo = {
  roomType: string;
  checkIn: Date;
  checkOut: Date;
};

type HotelBookingConfirmationProps = {
  bookingId: string;
  hotelName: string;
  location: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  guestNames: string[];
  rooms: HotelRoomInfo[];
  currencySymbol: string;
  total: number;
};

// UTC so a date saved at midnight doesn't shift a day with the server's timezone
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(date));

const getNights = (checkIn: Date, checkOut: Date) =>
  Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

const RoomSection = ({
  title,
  room,
  checkInTime,
  checkOutTime,
}: {
  title: string;
  room: HotelRoomInfo;
  checkInTime?: string | null;
  checkOutTime?: string | null;
}) => {
  const nights = getNights(room.checkIn, room.checkOut);

  return (
    <>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e0e0e0",
          margin: "16px 0",
        }}
      />
      <div>
        <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{title}</p>
        <p style={{ margin: "0 0 4px" }}>{room.roomType}</p>
        <p style={{ margin: "0 0 4px" }}>
          Check-in: {formatDate(room.checkIn)}
          {checkInTime ? ` · ${checkInTime}` : ""}
        </p>
        <p style={{ margin: "0 0 4px" }}>
          Check-out: {formatDate(room.checkOut)}
          {checkOutTime ? ` · ${checkOutTime}` : ""}
        </p>
        <p style={{ margin: 0 }}>
          {nights} {nights === 1 ? "night" : "nights"}
        </p>
      </div>
    </>
  );
};

export const HotelBookingConfirmation = ({
  bookingId,
  hotelName,
  location,
  checkInTime,
  checkOutTime,
  guestNames,
  rooms,
  currencySymbol,
  total,
}: HotelBookingConfirmationProps) => (
  <html>
    <head />
    <body style={{ fontFamily: "sans-serif", color: "#1c1b1f" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 20, margin: "0 0 16px" }}>
          Your hotel booking is confirmed 🎉
        </h1>
        <p style={{ margin: "0 0 4px" }}>Booking reference: {bookingId}</p>
        <p style={{ margin: "0 0 4px" }}>Hotel: {hotelName}</p>
        <p style={{ margin: "0 0 4px" }}>Location: {location}</p>
        <p style={{ margin: "0 0 16px" }}>Guests: {guestNames.join(", ")}</p>

        {rooms.map((room, index) => (
          <RoomSection
            key={index}
            title={rooms.length > 1 ? `Room ${index + 1}` : "Your stay"}
            room={room}
            checkInTime={checkInTime}
            checkOutTime={checkOutTime}
          />
        ))}

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e0e0e0",
            margin: "16px 0",
          }}
        />
        <p style={{ fontWeight: 700, margin: 0 }}>
          Total paid: {currencySymbol}
          {total}
        </p>
      </div>
    </body>
  </html>
);
