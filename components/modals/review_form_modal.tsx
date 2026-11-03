"use client";

import { createReview } from "@/lib/actions/create_review";
import { useCurrentUser } from "@/lib/auth-context";
import { useState, useTransition } from "react";
import { Button } from "../reusable/button";
import { usePathname, useSearchParams } from "next/navigation";
import { CloseIcon } from "../icons/close";
import { REVIEW_CATEGORIES } from "@/types/hotel_type";
import { Avatar, Select } from "antd";

type ReviewFormModalProps = { hotelId: string };

const getInitials = (name?: string | null) => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0).toUpperCase();
  const last =
    parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
  return `${first}${last}`;
};

const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label="Star rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="text-3xl leading-none transition-colors"
        >
          <span className={n <= active ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export const ReviewFormModal = ({ hotelId }: ReviewFormModalProps) => {
  const { user, isAuthenticated, isLoading } = useCurrentUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [stars, setStars] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setCategory("");
    setFeedback("");
    setStars(0);
    setError(null);
    setSuccess(false);
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!category) return setError("Please select a category.");
    if (!stars) return setError("Please select a star rating.");
    if (feedback.trim().length < 10)
      return setError("Please write at least 10 characters of feedback.");

    startTransition(async () => {
      const res = await createReview({ hotelId, category, feedback, stars });
      if (res.ok) setSuccess(true);
      else setError(res.error);
    });
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        label="Give your review"
        className="rounded bg-mint-green-100 px-4 py-[15.5px] text-xs font-semibold sm:text-sm shrink-0"
      />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            className="w-full max-w-md rounded-xl bg-white p-6 font-montserrat"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 id="review-title" className="text-lg font-bold">
                Write a review
              </h3>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="text-xl leading-none opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </div>

            {isLoading ? (
              <p className="text-sm opacity-75">Checking your account…</p>
            ) : !isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  You need to be signed in to leave a review.
                </p>
                <Button
                  label="Sign in"
                  href={`/signin?callbackUrl=${encodeURIComponent(currentUrl)}`}
                  className="rounded bg-mint-green-100 px-4 py-3 text-sm font-semibold"
                />
              </div>
            ) : success ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  Thanks! Your review has been submitted.
                </p>
                <Button
                  type="button"
                  onClick={close}
                  className="rounded bg-mint-green-100 px-4 py-3 text-sm font-semibold"
                  label="Close"
                  icon={<CloseIcon />}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  {user?.image ? (
                    <Avatar src={user.image} size={30} />
                  ) : (
                    <Avatar size={30} style={{ fontSize: "12px" }}>
                      {getInitials(user?.name)}
                    </Avatar>
                  )}
                  <p className="text-xs opacity-75">
                    Posting as <strong>{user?.name}</strong>
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="review-category"
                    className="text-sm font-semibold"
                  >
                    Category
                  </label>
                  <Select
                    id="review-category"
                    value={category || undefined}
                    onChange={(value) => setCategory(value)}
                    placeholder="Select a category"
                    options={REVIEW_CATEGORIES.map((c) => ({
                      value: c,
                      label: c,
                    }))}
                    size="large"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">Rating</span>
                  <StarPicker value={stars} onChange={setStars} />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="review-feedback"
                    className="text-sm font-semibold"
                  >
                    Feedback
                  </label>
                  <textarea
                    id="review-feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="Tell others about your stay…"
                    className="rounded border border-gray-300 p-3 text-sm"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded bg-mint-green-100 px-4 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  {isPending ? "Submitting…" : "Submit review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
