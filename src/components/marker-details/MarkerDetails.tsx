import React from "react";
import { Edit, Star } from "lucide-react";
import "./markerdetails.css";
import { MarkerProps } from "@/src/types/types";
import Link from "next/link";

interface Props {
  details: MarkerProps;
}

export const MarkerDetails: React.FC<Props> = ({ details }) => {
  const {
    id,
    title,
    description,
  } = details;

  return (
    <div className="details-container flex flex-col">
      <Link className="edit-button self-end"  href={`/point/${id}`}>
        <Edit size="20" color="var(--primary-white)" />
        <span className="sr-only">Edit</span>
      </Link>
      <div className="listing-content">
        <h2>{title}</h2>
        <div className="details">
          <div className="detail_item">
            <div className="ratings">
              <h4 className="ratings__heading text-sm">Rating</h4>
              <span className="ratings__stars flex">
                <Star size="20" color="#ffd700" />
                <Star size="20" color="#ffd700" />
                <Star size="20" color="#ffd700" />
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