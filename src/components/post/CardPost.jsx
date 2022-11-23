import { Avatar, Badge, Button } from 'react-daisyui';
import { FaCalendar, FaComment } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

function CardPost({
  id: postId,
  owner,
  title,
  status,
  caption,
  inserted_at,
  comment_count,
  fullname,
  username,
  image_url,
  photo,
  className = '',
}) {
  return (
    <Link to={`/?postId=${postId}`}>
      <div
        className={`min-h-16 w-full rounded-xl bg-base-200 p-2 transition hover:shadow ${className}`}
      >
        <div className="flex items-center gap-x-4 border-b-2 border-neutral border-opacity-50 pb-2">
          <Avatar src={photo} size={'xs'} shape={'circle'} />
          <div>
            <div className="font-medium">{fullname}</div>
            <div className="flex items-center gap-2">
              {status && <Badge children={status} />}
              {title || <span className="text-sm">@{username}</span>}
            </div>
          </div>
        </div>
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
        <div className="mt-2 flex gap-2">
          <Button
            endIcon={<FaComment />}
            size={'xs'}
            children={comment_count}
            animation={false}
          />
          <Button
            startIcon={<FaCalendar />}
            size={'xs'}
            children={
              <ReactTimeAgo
                date={new Date(inserted_at ? inserted_at : 0)}
                timeStyle="twitter"
              ></ReactTimeAgo>
            }
            animation={false}
          />
        </div>
      </div>
    </Link>
  );
}

export default CardPost;
