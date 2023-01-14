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
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { useContext, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaCalendar, FaComment, FaTrash } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroller';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import reactUseCookie from 'react-use-cookie';
import remarkGfm from 'remark-gfm';
import { useFetch } from 'use-http';
import UserContext from '../../contexts/UserContext';
import CreatePost from './CreatePost';
import DeletePostConfirmation from './DeletePostConfirmation';
import ViewComments from './ViewComments';

export default function Posts({ filter }) {
  const [posts, setPosts] = useState([]);
  const user = useContext(UserContext);
  const [accessToken] = reactUseCookie('accessToken');
  const [URLSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { get, del, response, loading, data } = useFetch(
    import.meta.env.VITE_API_URL,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      cachePolicy: 'no-cache',
    }
  );
  async function getPosts() {
    const res = await get(
      `/posts?limit=10&offset=${posts.length}` +
        (filter?.userId ? `&userId=${filter.userId}` : '')
    );
    if (response.ok) {
      setPosts([...posts, ...res]);
    }
  }
  async function deletePost(postId) {
    await del(`/posts/${postId}`);
    if (response.ok) {
      setPosts((posts) => posts.filter((post) => post.id !== postId));
      navigate(-1);
    }
  }
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <InfiniteScroll
        loadMore={() => !loading && getPosts()}
        hasMore={!!data?.length}
        style={{ width: '100%' }}
      >
        <VStack spacing={4} my={4} maxW={'full'} w={'full'}>
          {posts.map((post, i) => (
            <Card maxW="md" w={'full'} key={i} bg={'Background'}>
              <CardHeader pb={'unset'}>
                <Flex spacing="4">
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Avatar name={post.fullname} src={post.photo} />
                    <Box>
                      <Text fontWeight={'bold'}>{post.fullname}</Text>
                      <Text>@{post.username}</Text>
                    </Box>
                  </Flex>
                  {user.id === post.owner && (
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<BsThreeDotsVertical />}
                        variant="ghost"
                        aria-label="See menu"
                      />
                      <MenuList minW={'min-content'}>
                        <Link to={`?action=delete&postId=${post.id}`}>
                          <MenuItem icon={<FaTrash />} color={'red'}>
                            Delete
                          </MenuItem>
                        </Link>
                        {/* <MenuItem icon={<FaPen />}>Edit</MenuItem> */}
                      </MenuList>
                    </Menu>
                  )}
                </Flex>
              </CardHeader>
              <CardBody pb={!post.image_url && 'unset'}>
                <ReactMarkdown
                  components={ChakraUIRenderer()}
                  remarkPlugins={[remarkGfm]}
                >
                  {post.caption.replace(/\n/g, '\n\n')}
                </ReactMarkdown>
              </CardBody>
              {post.image_url && (
                <Image objectFit="cover" src={post.image_url} alt="Chakra UI" />
              )}

              <CardFooter justify="space-between" flexWrap="wrap">
                <Link to={`?action=comment&postId=${post.id}`}>
                  <Button leftIcon={<FaComment />}>{post.comment_count}</Button>
                </Link>
                <Button leftIcon={<FaCalendar />} variant={'ghost'}>
                  {
                    <ReactTimeAgo
                      date={new Date(post.inserted_at ? post.inserted_at : 0)}
                      timeStyle="twitter"
                    ></ReactTimeAgo>
                  }
                </Button>
              </CardFooter>
            </Card>
          ))}
          <Card maxW="md" w={'full'} hidden={!loading} bg={'Background'}>
            <CardHeader>
              <SkeletonCircle size={12} />
            </CardHeader>
            <CardBody>
              <SkeletonText
                mt="4"
                noOfLines={5}
                spacing="4"
                skeletonHeight="2"
              />
              <Skeleton>
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
                  ut? Eaque sed inventore amet, saepe porro et molestias
                  laudantium quam accusantium natus iste ipsam sequi nisi
                  voluptas veniam accusamus libero.
                </Text>
              </Skeleton>
            </CardBody>
          </Card>
        </VStack>
      </InfiniteScroll>

      <ViewComments
        isOpen={URLSearchParams.get('action') === 'comment'}
        postId={URLSearchParams.get('postId')}
        posts={posts}
        setPosts={setPosts}
      />

      <CreatePost isOpen={URLSearchParams.get('action') === 'create'} />

      <DeletePostConfirmation
        isOpen={
          URLSearchParams.get('action') === 'delete' &&
          URLSearchParams.get('postId')
        }
        postId={URLSearchParams.get('postId')}
        deletePost={deletePost}
        loading={loading}
      />
    </>
  );
}
