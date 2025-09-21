import Spinner from "../ui/Spinner";

const FullScreenLoader = () => {
  return (
    <div className="bg-opacity-70 absolute inset-0 z-50 flex items-center justify-center bg-white">
      <Spinner size={48} />
    </div>
  );
};

export default FullScreenLoader;
