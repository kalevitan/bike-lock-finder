import React from "react";

interface Props {
  details: MarkerDetails;
}

export const MarkerDetails: React.FC<Props> = ({details}) => {
  const {
    title,
    description,
    latitude,
    longitude,
  } = details;

  return (
    <div className="marker-details-container">
      <div className="marker-details-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
      </div>
    </div>
  )
}