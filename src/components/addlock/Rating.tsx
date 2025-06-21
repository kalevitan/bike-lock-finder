import React from "react";
import { Star } from "lucide-react";
import classes from "./addlock.module.css";

interface RatingProps {
  rating: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export default function Rating({ rating, onChange, disabled }: RatingProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[var(--primary-gray)]">
        How would you rate this lock?
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <div key={value} className="relative">
            <input
              className="sr-only"
              type="radio"
              name="rating"
              id={`str${value}`}
              value={value}
              checked={rating === value}
              onChange={onChange}
              disabled={disabled}
            />
            <label
              className={`block cursor-pointer transition-all duration-200 ${
                disabled ? "cursor-not-allowed opacity-50" : "hover:scale-110"
              }`}
              htmlFor={`str${value}`}
            >
              <Star
                size={36}
                className={`transition-all duration-200 ${
                  rating >= value
                    ? "text-[var(--primary-gold)] fill-[var(--primary-gold)]"
                    : disabled
                      ? "text-gray-300"
                      : "text-gray-300 hover:text-[var(--primary-gold)]/50"
                }`}
              />
            </label>
          </div>
        ))}
      </div>
      {rating > 0 && (
        <p className="text-sm font-medium text-[var(--primary-gray)] bg-[var(--primary-gold)]/10 px-3 py-2 rounded-lg border border-[var(--primary-gold)]/20">
          You rated this lock {rating} out of 5 stars
        </p>
      )}
    </div>
  );
}
