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
    <div className="marker-pin">
      {/* Pin Head */}
      <div className="pin-head">
        {/* Image or Icon */}
        <div className="pin-content">
          {markerData.file &&
            typeof markerData.file === "string" &&
            (() => {
              try {
                new URL(markerData.file);
                return (
                  <Image
                    src={getPublicUrl(markerData.file)}
                    width={32}
                    height={32}
                    className="pin-image"
                    alt={`Bike lock at ${markerData.title}`}
                    priority
                  />
                );
              } catch {
                return null;
              }
            })()}

          <div className="pin-icon">
            <BikeLockIcon />
          </div>
        </div>
      </div>

      {/* Pin Tail (Triangle) */}
      <div className="pin-tail" aria-hidden="true"></div>

      {/* Details Panel */}
      {isOpen && (
        <div className="pin-details">
          <MarkerDetails
            details={markerData as MarkerProps}
            onEdit={onEditPoint}
            isAuthenticated={!!user?.emailVerified}
          />
        </div>
      )}
    </div>
  );
}
