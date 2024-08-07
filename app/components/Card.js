const Card = ({ image, content, tags }) => (
  <div className="mb-4 w-full overflow-hidden rounded-lg shadow-md">
    <img src={image} alt={content} className="w-full object-cover" />
    <div className="px-4">
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mb-2 py-2 text-gray-700">{content}</p>
    </div>
  </div>
);
export default Card;
