import { Navbar } from "@/components/navigation/navbar";

export default function FlightHotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
