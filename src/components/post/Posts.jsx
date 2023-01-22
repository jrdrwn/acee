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
  Text,
  VStack,
} from '@chakra-ui/react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { useContext, useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaCalendar, FaComment, FaTrash } from 'react-icons/fa';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import reactUseCookie from 'react-use-cookie';
import remarkGfm from 'remark-gfm';
import { useFetch } from 'use-http';
import UserContext from '../../contexts/UserContext';
import QSS from '../utils/qss';
import CreatePost from './CreatePost';
import DeletePostConfirmation from './DeletePostConfirmation';
import ViewComments from './ViewComments';

export default function Posts({ filter }) {
  const user = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [jwt] = reactUseCookie('jwt');
  const [query] = useSearchParams();
  const loader = useRef(null);
  const navigate = useNavigate();
  const { get, del, response, loading, data } = useFetch(
    import.meta.env.VITE_API_URL.concat('/posts'),
    {
      headers: {
        authorization: `Bearer ${jwt}`,
      },

      cachePolicy: 'no-cache',
      data: { meta: { pagination: { total: 0 } } },
    }
  );
  async function deletePost(postId) {
    await del(`/${postId}`.concat(QSS({ populate: 'owner.*' })));

    if (response.ok) {
      setPosts((posts) => posts.filter((post) => post.id != postId));
      navigate(-1);
    }
  }

  async function getPosts() {
    const res = await get(
      QSS({
        populate: 'owner,comments,owner.photo,media',
        pagination: {
          start: posts.length,
          limit: 3,
        },
        filters: { owner: { id: filter?.userId } },
        sort: 'createdAt:desc',
      })
    );
    response.ok && setPosts([...posts, ...res.data]);
  }

  const loadMore = (entries) => {
    const target = entries[0];

    if (target.isIntersecting) {
      !loading && getPosts();
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(loadMore, options);

    if (loader && loader.current) {
      observer.observe(loader.current);
    }
    return () => observer.disconnect();
  }, [loader, getPosts]);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <VStack spacing={4} my={4} maxW={'full'} w={'full'}>
        {posts.map((post, i) => (
          <Card maxW="md" w={'full'} key={i} bg={'Background'}>
            <CardHeader pb={'unset'}>
              <Flex spacing="4">
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar
                    name={post.owner.firstName}
                    src={post.owner.photo?.url}
                  />
                  <Box>
                    <Text fontWeight={'bold'}>
                      {post.owner.firstName} {post.owner.lastName}
                    </Text>
                    <Text>@{post.owner.username}</Text>
                  </Box>
                </Flex>
                {user.id === post.owner.id && (
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
            <CardBody pb={!post.media && 'unset'}>
              <ReactMarkdown
                components={ChakraUIRenderer()}
                remarkPlugins={[remarkGfm]}
              >
                {post.content.replace(/\n/g, '\n\n')}
              </ReactMarkdown>
            </CardBody>
            {/*
              // TODO: add video tag
              // TODO: customize video and image tag
              // ! post.media.provider_metadata.resource_type
              // ? video or image
            */}
            {post.media?.url && (
              <Image
                objectFit="cover"
                src={post.media?.url}
                rounded={'md'}
                mx={2}
                alt={post.media?.url}
              />
            )}

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
          </Card>
        ))}

        <Card
          ref={loader}
          maxW="md"
          w={'full'}
          bg={'Background'}
          hidden={posts.length === data?.meta?.pagination?.total && !loading}
        >
          <CardHeader>
            <SkeletonCircle size={12} />
          </CardHeader>
          <CardBody>
            <SkeletonText
              mt={4}
              mb={2}
              noOfLines={5}
              spacing="4"
              skeletonHeight="2"
            />
            <Skeleton>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia,
                ut? Eaque sed inventore amet, saepe porro et molestias
                laudantium quam accusantium natus iste ipsam sequi nisi voluptas
                veniam accusamus libero.
              </Text>
            </Skeleton>
          </CardBody>
        </Card>
      </VStack>

      <ViewComments
        isOpen={query.get('action') === 'comment'}
        postId={query.get('postId')}
        posts={posts}
        setPosts={setPosts}
      />

      <CreatePost isOpen={query.get('action') === 'create'} />

      <DeletePostConfirmation
        isOpen={query.get('action') === 'delete' && query.get('postId')}
        postId={query.get('postId')}
        deletePost={deletePost}
        loading={loading}
      />
    </>
  );
}
