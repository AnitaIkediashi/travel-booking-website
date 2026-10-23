'use client'

import { ChevronIcon } from "@/components/icons/chevron";
import { ThumbsDownIcon } from "@/components/icons/thumbs_down";
import { ThumbsUpIcon } from "@/components/icons/thumbs_up";
import { Button } from "@/components/reusable/button";
import { formatToLongDate } from "@/helpers/convertNumberToTime";
import { HotelReview } from "@/types/hotel_type";
import { getRatingLabel } from "@/utils/getRating";
import { Avatar } from "antd";
import { useState } from "react";

type HotelReviewProps = {
  reviewsList: HotelReview[];
  hasReviews: boolean;
};

const THUMBS_UP_OUTLINE =
  "M20.22 9.55C19.79 9.04 19.17 8.75 18.5 8.75H14.47V6C14.47 4.48 13.24 3.25 11.64 3.25C10.94 3.25 10.31 3.67 10.03 4.32L7.49 10.25H5.62C4.31 10.25 3.25 11.31 3.25 12.62V18.39C3.25 19.69 4.32 20.75 5.62 20.75H17.18C18.27 20.75 19.2 19.97 19.39 18.89L20.71 11.39C20.82 10.73 20.64 10.06 20.21 9.55H20.22ZM5.62 19.25C5.14 19.25 4.75 18.86 4.75 18.39V12.62C4.75 12.14 5.14 11.75 5.62 11.75H7.23V19.25H5.62ZM17.92 18.63C17.86 18.99 17.55 19.25 17.18 19.25H8.74V11.15L11.41 4.9C11.45 4.81 11.54 4.74 11.73 4.74C12.42 4.74 12.97 5.3 12.97 5.99V10.24H18.5C18.73 10.24 18.93 10.33 19.07 10.5C19.21 10.67 19.27 10.89 19.23 11.12L17.91 18.62L17.92 18.63Z";
const THUMBS_UP_SOLID =
  "M7.24001 11V20H5.63001C4.73001 20 4.01001 19.28 4.01001 18.39V12.62C4.01001 11.73 4.74001 11 5.63001 11H7.24001ZM18.5 9.5H13.72V6C13.72 4.9 12.82 4 11.73 4H11.64C11.24 4 10.88 4.24 10.72 4.61L7.99001 11V20H17.19C17.92 20 18.54 19.48 18.67 18.76L19.99 11.26C20.15 10.34 19.45 9.5 18.51 9.5H18.5Z";
const THUMBS_DOWN_OUTLINE =
  "M18.38 3.25H6.81C5.72 3.25 4.79 4.03 4.6 5.11L3.29 12.61C3.18 13.27 3.36 13.94 3.78 14.45C4.21 14.96 4.83 15.25 5.5 15.25H9.53V18C9.53 19.52 10.76 20.75 12.36 20.75C13.06 20.75 13.69 20.33 13.97 19.68L16.51 13.75H18.39C19.7 13.75 20.76 12.69 20.76 11.38V5.61C20.76 4.31 19.7 3.25 18.39 3.25H18.38ZM15.26 12.85L12.59 19.1C12.55 19.19 12.46 19.26 12.27 19.26C11.58 19.26 11.03 18.7 11.03 18.01V13.76H5.5C5.27 13.76 5.07 13.67 4.93 13.5C4.78 13.33 4.73 13.11 4.77 12.88L6.08 5.38C6.14 5.02 6.45001 4.76 6.82 4.76H15.26V12.85ZM19.25 11.38C19.25 11.86 18.86 12.25 18.38 12.25H16.77V4.75H18.38C18.86 4.75 19.25 5.14 19.25 5.61V11.38Z";
const THUMBS_DOWN_SOLID =
  "M20 5.61V11.38C20 12.27 19.27 13 18.38 13H16.77V4H18.38C19.28 4 20 4.72 20 5.61ZM5.34001 5.24L4.02001 12.74C3.86001 13.66 4.56001 14.5 5.50001 14.5H10.28V18C10.28 19.1 11.18 20 12.27 20H12.36C12.76 20 13.12 19.76 13.28 19.39L16.01 13V4H6.81001C6.08001 4 5.46001 4.52 5.33001 5.24H5.34001Z";

type Vote = "up" | "down";

export const HotelReviews = ({ reviewsList, hasReviews }: HotelReviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [votes, setVotes] = useState<Record<string, Vote | null>>({});

  const handleVote = (id: string, vote: Vote) => {
    setVotes((prev) => ({
      ...prev,
      // clicking the active vote clears it, otherwise set (or switch to) it
      [id]: prev[id] === vote ? null : vote,
    }));
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(reviewsList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = reviewsList.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="border-t border-t-blackish-green/25">
      {hasReviews && currentReviews.length > 0 ? (
        <div className="divide-y divide-blackish-green/25">
          {currentReviews.map((review) => {
            const vote = votes[review.id] ?? null;
            const firstInitial = review.author.charAt(0).toUpperCase();
            const lastInitial = review.author.includes(" ")
              ? review.author?.split(" ").slice(-1)[0].charAt(0).toUpperCase()
              : "";
            const initials = `${firstInitial}${lastInitial}`;
            return (
              <div
                key={review.id}
                className="py-4 md:py-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {review.image === null ? (
                    <div className="shrink-0">
                      <Avatar size={45} style={{ fontSize: "14px" }}>
                        {initials}
                      </Avatar>
                    </div>
                  ) : (
                    <div className="shrink-0">
                      <Avatar src={review.image} size={45} />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <h4 className="md:text-sm text-xs font-semibold">
                      {review.rating?.toFixed(1)}{" "}
                      {getRatingLabel(review.rating)}{" "}
                      <span className="font-normal">| {review.author}</span>
                    </h4>
                    <p className="md:text-sm text-xs">{review.comment}</p>
                    <small className="opacity-75 text-xs">
                      {formatToLongDate(review.submitted_at)}
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:text-sm text-xs">
                  <Button
                    label="Helpful"
                    aria-label="Mark review as helpful"
                    aria-pressed={vote === "up"}
                    onClick={() => handleVote(review.id, "up")}
                    className={`flex items-center gap-2 ${vote === "up" ? "font-semibold" : ""}`}
                    labelClassName="md:text-sm text-xs"
                    icon={
                      <ThumbsUpIcon
                        d={vote === "up" ? THUMBS_UP_SOLID : THUMBS_UP_OUTLINE}
                      />
                    }
                  />
                  <Button
                    label="Not helpful"
                    aria-label="Mark review as not helpful"
                    aria-pressed={vote === "down"}
                    onClick={() => handleVote(review.id, "down")}
                    className={`flex items-center gap-2 ${vote === "down" ? "font-semibold" : ""}`}
                    labelClassName="md:text-sm text-xs"
                    icon={
                      <ThumbsDownIcon
                        d={
                          vote === "down"
                            ? THUMBS_DOWN_SOLID
                            : THUMBS_DOWN_OUTLINE
                        }
                      />
                    }
                  />
                </div>
              </div>
            );
          })}
          {totalPages > 1 && (
            <div className="pt-4 md:pt-6 text-sm flex items-center justify-center gap-6">
              <Button
                aria-label="previous"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed w-6 h-6"
                icon={<ChevronIcon dir="left" />}
              />
              <span>
                {currentPage} of {totalPages}
              </span>
              <Button
                aria-label="next"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed w-6 h-6"
                icon={<ChevronIcon dir="right" />}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm opacity-75">No reviews available yet.</p>
      )}
    </div>
  );
};
