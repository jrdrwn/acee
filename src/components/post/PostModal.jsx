function PostModal({ caption, image_url, className = '' }) {
  return (
    <div
      className={`min-h-16 w-full rounded-xl bg-base-200 p-2 transition hover:shadow ${className}`}
    >
      <div className="prose:max-w-full prose prose-img:rounded-md prose-img:object-cover">
        <div>
          <p>{caption}</p>
        </div>
        {image_url && (
          <img
            className="aspect-video w-full rounded-xl object-cover"
            src={image_url}
          />
        )}
      </div>
    </div>
  );
}

export default PostModal;
