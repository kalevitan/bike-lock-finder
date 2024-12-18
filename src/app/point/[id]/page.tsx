import React from "react";

const PointDetails: React.FC = ({ params }) => {
  const id = params?.id;
  return (
    <div>
      <h1>Point Details - {id}</h1>
    </div>
  )
}

export default PointDetails;