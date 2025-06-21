import React, { useMemo } from "react";
import { Star, Navigation, LocationEdit } from "lucide-react";
import { MarkerProps } from "@/interfaces/markers";
import Image from "next/image";
import { getPublicUrl } from "@/utils/storageUtils";

interface MarkerDetailsProps {
  details: MarkerProps;
  onEdit: (pointData: MarkerProps) => void;
  isAuthenticated: boolean;
}

export default function MarkerDetails({
  details,
  onEdit,
  isAuthenticated,
}: MarkerDetailsProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(details);
  };

  const googleMapsUrl = useMemo(
    () =>
      `https://maps.google.com/?q=${details.latitude},${details.longitude}&mode=bicycling`,
    [details.latitude, details.longitude]
  );

  return (
    <div className="marker-details-content">
      {/* Large Image Display */}
      {details.file &&
        typeof details.file === "string" &&
        (() => {
          try {
            new URL(details.file);
            return (
              <div className="details-image-container">
                <Image
                  src={getPublicUrl(details.file)}
                  width={200}
                  height={120}
                  className="details-image"
                  alt={`Bike lock at ${details.title}`}
                />
              </div>
            );
          } catch {
            return null;
          }
        })()}

      {/* Content Section */}
      <div className="details-content">
        {/* Title with Navigation */}
        <div className="details-header">
          <a
            href={googleMapsUrl}
            className="details-title-link group"
            target="_blank"
            rel="noreferrer"
          >
            <h2 className="details-title">
              {details.title}
              <Navigation size={16} className="details-nav-icon" />
            </h2>
          </a>
        </div>

        {/* Description */}
        {details.description && (
          <p className="details-description">{details.description}</p>
        )}

        {/* Rating and Edit Section */}
        <div className="details-footer">
          {details.rating && details.rating > 0 && (
            <div className="details-rating">
              <span className="rating-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size="16"
                    color={
                      index < details.rating ? "var(--primary-gold)" : "#d1d5db"
                    }
                    fill={
                      index < details.rating ? "var(--primary-gold)" : "none"
                    }
                  />
                ))}
              </span>
              <span className="rating-badge">{details.rating}.0</span>
            </div>
          )}

          {isAuthenticated && (
            <button className="details-edit-button" onClick={handleEditClick}>
              <LocationEdit size="16" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
