import { Badge } from 'react-daisyui';

function CommentPost({
  id: CommentId,
  user_id: userId,
  fullname,
  inserted_at,
  text,
  photo,
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <div className="inline-block h-5 w-5 overflow-hidden rounded-full bg-base-content">
          <img src={photo} />
        </div>
        <div className="font-medium">{fullname}</div>
      </div>
      <p className="ml-7 text-sm">{text}</p>
      <Badge
        className="ml-7"
        size="sm"
        variant="outline"
        children={new Date(inserted_at).toLocaleDateString('id', {
          dateStyle: 'full',
        })}
      />
    </div>
  );
}

export default CommentPost;
