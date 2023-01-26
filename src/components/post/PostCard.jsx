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
import { FaCalendar, FaComment, FaPen, FaTrash } from 'react-icons/fa';
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
    <Card maxW="md" w={'full'} hidden={hidden} variant={'outline'}>
      <CardHeader pb={'unset'}>
        <Flex spacing="4" align={'center'}>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={post.owner.firstName} src={post.owner.photo?.url} />
            <Box>
              <Text fontWeight={'semibold'}>
                {post.owner.firstName} {post.owner.lastName}
              </Text>
              <Text color={'GrayText'} fontWeight={'medium'}>
                @{post.owner.username}
              </Text>
            </Box>
          </Flex>
          {user.id === post.owner.id && !previewMode && (
            <Menu isLazy>
              <MenuButton
                as={IconButton}
                icon={<BsThreeDotsVertical />}
                variant="ghost"
                aria-label="See menu"
              />
              <MenuList minW={'min-content'}>
                <MenuItem
                  as={Link}
                  to={QSS({
                    action: 'delete',
                    postId: post.id,
                  })}
                  icon={<FaTrash />}
                >
                  Hapus
                </MenuItem>
                <MenuItem
                  as={Link}
                  to={QSS({
                    action: 'update',
                    postId: post.id,
                  })}
                  icon={<FaPen />}
                >
                  Edit
                </MenuItem>
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
          <Button
            as={Link}
            to={QSS({
              action: 'comment',
              postId: post.id,
            })}
            leftIcon={<FaComment />}
            size={'sm'}
          >
            {post.comments.length}
          </Button>
          <Button leftIcon={<FaCalendar />} size={'sm'}>
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
