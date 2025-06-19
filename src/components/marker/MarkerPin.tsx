import Image from "next/image";
import { MarkerProps } from "@/interfaces/markers";
import MarkerDetails from "./MarkerDetails";
import BikeLockIcon from "@/components/icons/bike-lock-icon";
import { useAuth } from "@/contexts/AuthProvider";
import { getPublicUrl } from "@/utils/storageUtils";

interface MarkerPinProps {
  markerData: MarkerProps;
  isOpen: boolean;
  onEditPoint: (pointData: MarkerProps) => void;
}

export default function MarkerPin({
  markerData,
  isOpen,
  onEditPoint,
}: MarkerPinProps) {
  const { user } = useAuth();

  return (
    <div className="custom-pin">
      <div className="image-container">
        {markerData.file &&
          typeof markerData.file === "string" &&
          (() => {
            try {
              new URL(markerData.file);
              return (
                <div className="w-full h-full relative">
                  <Image
                    src={getPublicUrl(markerData.file)}
                    width={300}
                    height={300}
                    className="image"
                    alt={`Bike lock location: ${markerData.title}`}
                  />
                </div>
              );
            } catch {
              return null;
            }
          })()}
        <span className="icon">
          <BikeLockIcon />
        </span>
      </div>

      <MarkerDetails
        details={markerData as MarkerProps}
        onEdit={onEditPoint}
        isAuthenticated={!!user?.emailVerified}
      />

      <div className="triangle" />
    </div>
  );
}
