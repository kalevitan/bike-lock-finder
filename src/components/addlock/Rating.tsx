import React from "react";
import { Star } from "lucide-react";
import classes from './addlock.module.css';

interface RatingProps {
  rating: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export default function Rating({ rating, onChange, disabled }: RatingProps) {
  return (
    <div className="flex flex-col text-left">
      <label className="mb-2">How would you rate this lock?</label>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((value) => (
          <span key={value}>
            <input
              className={classes.star}
              type="radio"
              name="rating"
              id={`str${value}`}
              value={value}
              checked={rating === value}
              onChange={onChange}
              disabled={disabled}
            />
            <label className={classes.star_label} htmlFor={`str${value}`}>
              <Star className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${classes.star_shape} ${
                rating >= value ? classes.highlighted : ""
              }`} size="40" />
            </label>
          </span>
        ))}
      </div>
    </div>
  );
}