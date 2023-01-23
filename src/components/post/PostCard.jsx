import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { useContext } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaCalendar, FaComment, FaTrash } from 'react-icons/fa';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import UserContext from '../../contexts/UserContext';
import QSS from '../utils/qss';

export default function PostCard({ post, previewMode = false, hidden }) {
  const user = useContext(UserContext);
  if (previewMode) {
    post.owner = user;
  }
  return (
    <Card maxW="md" w={'full'} bg={'Background'} hidden={hidden}>
      <CardHeader pb={'unset'}>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={post.owner.firstName} src={post.owner.photo?.url} />
            <Box>
              <Text fontWeight={'bold'}>
                {post.owner.firstName} {post.owner.lastName}
              </Text>
              <Text>@{post.owner.username}</Text>
            </Box>
          </Flex>
          {user.id === post.owner.id && !previewMode && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<BsThreeDotsVertical />}
                variant="ghost"
                aria-label="See menu"
              />
              <MenuList minW={'min-content'}>
                <Link
                  to={QSS({
                    action: 'delete',
                    postId: post.id,
                  })}
                >
                  <MenuItem icon={<FaTrash />} color={'red'}>
                    Hapus
                  </MenuItem>
                </Link>
                {/* <MenuItem icon={<FaPen />}>Edit</MenuItem> */}
              </MenuList>
            </Menu>
          )}
        </Flex>
      </CardHeader>
      <CardBody pb={!previewMode && 'unset'}>
        <ReactMarkdown
          components={ChakraUIRenderer()}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          linkTarget={'_blank'}
          children={post.content}
        />
        {post?.media?.provider_metadata?.resource_type === 'video' && (
          <Box overflow={'hidden'} pos={'relative'} rounded={'md'}>
            <ReactPlayer
              width="100%"
              height="100%"
              controls={true}
              fallback={<Skeleton w={'full'} rounded={'md'} />}
              url={post?.media?.url}
            />
          </Box>
        )}
        {post?.media?.provider_metadata?.resource_type === 'image' && (
          <Image
            rounded={'md'}
            objectFit={'cover'}
            src={post?.media?.url}
            fallback={<Skeleton w={'full'} rounded={'md'} />}
          />
        )}
      </CardBody>
      {!previewMode && (
        <CardFooter justify="space-between" flexWrap="wrap">
          <Link
            to={QSS({
              action: 'comment',
              postId: post.id,
            })}
          >
            <Button leftIcon={<FaComment />}>{post.comments.length}</Button>
          </Link>
          <Button leftIcon={<FaCalendar />} variant={'ghost'}>
            {
              <ReactTimeAgo
                date={new Date(post.createdAt)}
                timeStyle="twitter"
              />
            }
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
