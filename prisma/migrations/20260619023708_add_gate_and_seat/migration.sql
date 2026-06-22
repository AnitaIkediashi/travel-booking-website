-- CreateTable
CREATE TABLE "gates" (
    "id" SERIAL NOT NULL,
    "gate_id" INTEGER NOT NULL,
    "gate_number" TEXT NOT NULL,
    "terminal" TEXT NOT NULL,

    CONSTRAINT "gates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" SERIAL NOT NULL,
    "seat_id" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "cabin_class" TEXT NOT NULL,
    "is_window" BOOLEAN NOT NULL,
    "is_aisle" BOOLEAN NOT NULL,
    "is_exit_row" BOOLEAN NOT NULL,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,
    "extra_fee" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gates_gate_id_key" ON "gates"("gate_id");

-- CreateIndex
CREATE UNIQUE INDEX "seats_seat_id_seat_number_key" ON "seats"("seat_id", "seat_number");

-- AddForeignKey
ALTER TABLE "gates" ADD CONSTRAINT "gates_gate_id_fkey" FOREIGN KEY ("gate_id") REFERENCES "legs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
