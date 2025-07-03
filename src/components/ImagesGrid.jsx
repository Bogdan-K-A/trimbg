"use client";

import ImageCard from "./ImageCard";

export default function ImagesGrid({ images, setImages }) {
  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="overflow-auto h-200 mb-16 custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} removeImage={removeImage} />
        ))}
      </div>
    </div>
  );
}
