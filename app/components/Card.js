const Card = ({ image, description, tags }) => (
  <div className="rounded-lg shadow-md overflow-hidden mb-2">
    <img src={image} alt={description} className="w-full object-cover" />
    <div className="p-4">
      <p className="text-gray-700 mb-2">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);
export default Card;
