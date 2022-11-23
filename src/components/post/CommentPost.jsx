import { Avatar, Badge } from 'react-daisyui';
import ReactTimeAgo from 'react-time-ago';

function CommentPost({
  id: CommentId,
  user_id: userId,
  fullname,
  inserted_at,
  text,
  photo,
}) {
  return (
    <div>
      <span className="flex items-center gap-2">
        <Avatar src={photo} size={20} shape={'circle'} />
        <Badge
          size="sm"
          variant="outline"
          children={
            <ReactTimeAgo
              date={new Date(inserted_at ? inserted_at : 0)}
              timeStyle="twitter"
            ></ReactTimeAgo>
          }
        />
      </span>
      <p className="text-sm">
        <span className="mr-1 font-medium">{fullname || userId}</span>
        {text}
      </p>
    </div>
  );
}

export default CommentPost;
