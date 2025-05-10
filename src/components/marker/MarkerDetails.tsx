import React, { useMemo } from "react";
import { Star, Navigation, LocationEdit } from "lucide-react";
import { MarkerProps } from "@/interfaces/markers";
import useAuth from "@/app/hooks/useAuth";

interface MarkerDetailsProps {
  details: MarkerProps;
  onEdit: (pointData: MarkerProps) => void;
}

export const MarkerDetails: React.FC<MarkerDetailsProps> = ({ details, onEdit }) => {
  const loggedIn = useAuth();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(details);
  };

  const googleMapsUrl = useMemo(() =>
    `https://maps.google.com/?q=${details.latitude},${details.longitude}`,
    [details.latitude, details.longitude]
  );

  return (
    <article className="details-container flex flex-col bg-primaryGray w-full h-full opacity-0 max-w-0 rounded-r-none invisible">
      <div className="listing-content flex flex-col justify-center gap-[.25rem] h-full overflow-hidden">
        <div className="heading">
          <a
            href={googleMapsUrl}
            className="heading-link"
            target="_blank"
            rel="noreferrer"
          >
            <h2 className="text-lg flex gap-1 items-center">
              {details.title}
              <Navigation size={15} className="min-w-fit" />
            </h2>
          </a>
          <p className="description text-sm mb-0">{details.description}</p>
        </div>

        <div className="details flex justify-between gap-4">
          <div className="detail_item flex items-center gap-1">
            <div className="ratings">
              <h4 className="text-sm pb-2 sr-only">Rating</h4>
              <span className="flex gap-1 items-center">
                {Array.from({ length: details.rating }).map((_, index) => (
                  <Star key={index} size="20" color="var(--primary-gold)" />
                ))}
                <span className="border m-2 p-1">
                  {details.rating}.0
                </span>
              </span>
            </div>
          </div>
          {loggedIn && (
              <button
                className="button button--icon"
                onClick={handleEditClick}
              >
                <LocationEdit size="20" color="var(--primary-white)" />
              </button>
            )}
        </div>
      </div>
    </article>
  );
};

export default MarkerDetails;