import React from "react";
import { Edit, Star } from "lucide-react";
import "./markerdetails.css";
import { MarkerProps } from "@/src/interfaces/markers";

interface Props {
  details: MarkerProps;
  onEdit: (pointData: MarkerProps) => void;
}

export const MarkerDetails: React.FC<Props> = ({ details, onEdit }) => {
  const {
    title,
    description,
    rating,
  } = details;

  console.log(title, rating);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
                {Array.from({ length: rating }).map((_, index) => (
                  <Star key={index} size="20" color="#ffd700" />
                ))}
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