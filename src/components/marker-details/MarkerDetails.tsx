import React from "react";
import { Edit, Star } from "lucide-react";
import "./markerdetails.css";
import { MarkerProps } from "@/src/types/types";

interface Props {
  details: MarkerProps;
  onEdit: (pointData: MarkerProps) => void;
}

export const MarkerDetails: React.FC<Props> = ({ details, onEdit }) => {
  const {
    title,
    description,
  } = details;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(details);
    onEdit(details);
  }

  return (
    <div className="details-container flex flex-col">
      <button className="edit-button self-end" onClick={(e) => handleEditClick(e)}>
        <Edit size="20" color="var(--primary-white)" />
        <span className="sr-only">Edit</span>
      </button>
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

export default MarkerDetails;