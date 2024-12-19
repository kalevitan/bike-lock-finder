import React from "react";

interface PointProps {
  params: any
}

const PointDetails: React.FC<PointProps> = ({ params }) => {
  const id = params?.id;
  return (
    <div>
      <h1>Point Details - {id}</h1>
    </div>
  )
}

export default PointDetails;