import { Loader2 } from "lucide-react";

const Spinner = ({ size = 24 }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className="text-primary animate-spin"
        size={size}
        strokeWidth={2.5}
      />
    </div>
  );
};

export default Spinner;
