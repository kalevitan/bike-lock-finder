import React from "react";
import { Edit, Star } from "lucide-react";
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(details);
  }

  return (
    <div className="details-container flex flex-col bg-primaryGray h-full opacity-0 max-w-0 rounded-r-none invisible">
      <button className="edit-button absolute right-1 top-1" onClick={(e) => handleEditClick(e)}>
        <Edit size="20" color="var(--primary-white)" />
        <span className="sr-only">Edit</span>
      </button>
      <div className="listing-content flex flex-col justify-center gap-4 h-full px-6 overflow-hidden">
        <h2>{title}</h2>
        <div className="details flex flex-row gap-4">
          <div className="detail_item flex items-center gap-1">
            <div className="ratings">
              <h4 className="text-sm pb-2">Rating</h4>
              <span className="flex gap-1">
                {Array.from({ length: rating }).map((_, index) => (
                  <Star key={index} size="20" color="var(--primary-gold)" />
                ))}
              </span>
            </div>
          </div>
        </div>
        <p className="description text-base mb-0">{description}</p>
        <button type="button" className="button cursor-pointer" onClick={(e) => e.stopPropagation()}>Get Directions</button>
      </div>
    </div>
  )
}

export default MarkerDetails;