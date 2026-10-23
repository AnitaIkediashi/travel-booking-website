-- CreateIndex
CREATE INDEX "booking_rooms_room_id_checkin_time_checkout_time_idx" ON "booking_rooms"("room_id", "checkin_time", "checkout_time");
