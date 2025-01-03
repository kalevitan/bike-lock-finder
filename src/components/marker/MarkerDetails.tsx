import React from "react";
import { Edit, Star, Navigation } from "lucide-react";
import { MarkerProps } from "@/interfaces/markers";
import useAuth from "@/app/hooks/useAuth";

interface Props {
  details: MarkerProps;
  onEdit: (pointData: MarkerProps) => void;
}

export const MarkerDetails: React.FC<Props> = ({ details, onEdit }) => {
  const {
    title,
    description,
    latitude,
    longitude,
    rating,
  } = details;

  const loggedIn = useAuth();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(details);
  }

  return (
    <article className="details-container flex flex-col bg-primaryGray w-full h-full opacity-0 max-w-0 rounded-r-none invisible">
      {loggedIn && (
        <button className="edit-button absolute right-1 top-1 hidden" onClick={(e) => handleEditClick(e)}>
          <Edit size="20" color="var(--primary-white)" />
          <span className="sr-only">Edit</span>
        </button>
      )}
      <div className="listing-content flex flex-col justify-center gap-[.25rem] h-full overflow-hidden">
        <div className="">
          <a href={`https://maps.google.com/?q=${latitude},${longitude}`} target="_blank" rel="noreferrer" title="Get Directions">
            <h2 className="text-lg flex gap-1 items-center">{title}<span><Navigation size={15}/></span></h2>
          </a>
          <p className="description text-sm mb-0">{description}</p>
        </div>
        <div className="details flex flex-row gap-4">
          <div className="detail_item flex items-center gap-1">
            <div className="ratings">
              <h4 className="text-sm pb-2 sr-only">Rating</h4>
              <span className="flex gap-1 items-center">
                {Array.from({ length: rating }).map((_, index) => (
                  <Star key={index} size="20" color="var(--primary-gold)" />
                ))} <span className="border m-2 p-1">{rating}.0</span>
              </span>
            </div>
          </div>
        </div>
        {/* <button type="button" className="button cursor-pointer" onClick={(e) => e.stopPropagation()}>Get Directions</button> */}
      </div>
    </article>
  )
}

export default MarkerDetails;