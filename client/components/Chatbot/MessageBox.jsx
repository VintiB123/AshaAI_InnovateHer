import Image from "next/image";

const MessageBox = ({ message }) => {
  const formatMessage = (text) => {
    const points = text.match(/(\d+\.\s|[*-]\s).+/g);

    if (points) {
      return (
        <ol className="list-decimal list-inside text-gray-100 text-sm leading-relaxed space-y-2">
          {points.map((point, index) => (
            <p key={index}>{point.trim()}</p>
          ))}
        </ol>
      );
    }

    return <p className="text-gray-100 text-sm leading-relaxed">{text}</p>;
  };

  return (
    <div className="z-10 max-w-[600px] h-40 w-72 flex space-y-6 flex-col bg-gradient-to-tr from-slate-400/30 via-gray-500/30 to-slate-600-400/30 p-2 backdrop-blur-md rounded-lg border border-slate-600/30">
      {message === "" ? (
        <div className="h-full w-full flex justify-center items-center gap-x-2">
          <Image
            src="/images/logo.png"
            alt="star.ai"
            className="h-10 w-auto rotate-12"
            width={100}
            height={100}
          />
          <h1 className="text-3xl tracking-tighter text-white font-semibold"></h1>
        </div>
      ) : (
        <div className="h-full w-full rounded-b-md font-medium overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {formatMessage(message)}
        </div>
      )}
    </div>
  );
};

export default MessageBox;
