const Card = ({ image, description, tags }) => (
  <div className="mb-4 w-full overflow-hidden rounded-lg shadow-md">
    <img src={image} alt={description} className="w-full object-cover" />
    <div className="p-4">
      <p className="mb-2 text-gray-700">{description}</p>
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
