/* eslint-disable @next/next/no-head-element */

type FlightLegInfo = {
  from: string;
  to: string;
  departTime: Date;
  arrivalTime: Date;
  flightNumber: string;
  airlineName: string;
  cabinClass: string;
};

type FlightBookingConfirmationProps = {
  bookingId: string;
  passengerNames: string[];
  outbound: FlightLegInfo;
  inbound?: FlightLegInfo;
};

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

const LegSection = ({ title, leg }: { title: string; leg: FlightLegInfo }) => (
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
      <p style={{ margin: "0 0 4px" }}>
        {leg.from} → {leg.to}
      </p>
      <p style={{ margin: "0 0 4px" }}>
        Departs: {formatDateTime(leg.departTime)}
      </p>
      <p style={{ margin: "0 0 4px" }}>
        Arrives: {formatDateTime(leg.arrivalTime)}
      </p>
      <p style={{ margin: 0 }}>
        {leg.airlineName} {leg.flightNumber} · {leg.cabinClass}
      </p>
    </div>
  </>
);

export const FlightBookingConfirmation = ({
  bookingId,
  passengerNames,
  outbound,
  inbound,
}: FlightBookingConfirmationProps) => (
  <html>
    <head />
    <body style={{ fontFamily: "sans-serif", color: "#1c1b1f" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 20, margin: "0 0 16px" }}>
          Your booking ticket is confirmed 🎉
        </h1>
        <p style={{ margin: "0 0 4px" }}>Booking reference: {bookingId}</p>
        <p style={{ margin: "0 0 16px" }}>
          Passengers: {passengerNames.join(", ")}
        </p>

        <LegSection title="Outbound" leg={outbound} />
        {inbound && <LegSection title="Return" leg={inbound} />}
      </div>
    </body>
  </html>
);
