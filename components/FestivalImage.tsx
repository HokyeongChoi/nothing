import { useState, useEffect } from "react";

type Props = {
  className: string;
  id: string;
};

const FestivalImage: React.FC<Props> = ({ className, id }) => {
  const [baseUrl, setBaseUrl] = useState("https://seoul-festival.now.sh/");
  if (process.browser) {
    useEffect(() => {
      setBaseUrl(window.location.origin);
    }, []);
  }
  return (
    <img
      src={`https://res.cloudinary.com/dugm4rn61/image/fetch/q_auto,f_auto/${baseUrl}/img/${id}.jpg`}
      className={className}
    />
  );
};

export default FestivalImage;
