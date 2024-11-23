import React from "react";
import { StarIcon } from "@/assets/icons/star-icon";
import "./markerdetails.css";
import { MarkerProps } from "@/src/types/types";

interface Props {
  details: MarkerProps;
}

export const MarkerDetails: React.FC<Props> = ({ details }) => {
  const {
    title,
    description,
  } = details;

  return (
    <div className="details-container">
      <div className="listing-content">
        <h2>{title}</h2>
        <div className="details">
          <div className="detail_item">
            <div className="ratings">
              <h4 className="ratings__heading text-sm">Rating</h4>
              <span className="ratings__stars flex">
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </span>
            </div>
          </div>
        </div>
        <p className="description pb-2">{description}</p>
        <button className="button cursor-pointer" onClick={(e) => e.stopPropagation()}>Get Directions</button>
      </div>
    </div>
  )
}