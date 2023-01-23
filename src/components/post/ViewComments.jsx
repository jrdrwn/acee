import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaAngleRight, FaPlus } from 'react-icons/fa';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useNavigate } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import reactUseCookie from 'react-use-cookie';
import remarkGfm from 'remark-gfm';
import { useFetch } from 'use-http';
import UserContext from '../../contexts/UserContext';
import ResponsiveModalStyle from '../../sx/ResponsiveModalStyle';
import QSS from '../utils/qss';

export default function ViewComments({ postId, setPosts, posts, isOpen }) {
  const user = useContext(UserContext);
  const commentInputRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [jwt] = reactUseCookie('jwt');
  const navigate = useNavigate();
  const { get, post, response, loading, data } = useFetch(
    `${import.meta.env.VITE_API_URL}`,
    {
      headers: {
        authorization: `Bearer ${jwt}`,
      },
      cachePolicy: 'no-cache',
    }
  );

  const handleComment = async () => {
    if (commentInputRef.current.value) {
      setComments([]);
      await post('/comments', {
        data: {
          content: commentInputRef.current.value,
          post: postId,
        },
      });
      await getComments(5, 0);
      await updatePostData();
    }
  };

  async function getComments(limit = 5, start = comments.length) {
    const res = await get(
      '/comments'.concat(
        QSS({
          populate: 'post,owner,owner.photo',
          sort: 'createdAt:desc',
          filters: { post: { id: postId } },
          pagination: {
            start,
            limit,
          },
        })
      )
    );
    if (response.ok) {
      res.data.length && setComments((comments) => [...comments, ...res.data]);
      commentInputRef.current.value = '';
      await updatePostData();
    } else {
      navigate(-1);
    }
  }

  async function updatePostData() {
    const res = await get(
      `/posts/${postId}`.concat(
        QSS({
          populate: 'comments.owner,owner,owner.photo,media',
        })
      )
    );
    if (response.ok) {
      setPosts(posts.map((post) => (post.id == postId ? res.data : post)));
    } else {
      navigate(-1);
    }
  }

  useEffect(() => {
    isOpen && getComments();
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => navigate(-1)}
      onCloseComplete={() => setComments([])}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent {...ResponsiveModalStyle}>
        <ModalHeader>Komentar</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup>
            <Input pr={'20'} ref={commentInputRef} />

            <InputRightElement w={'fit-content'} mr={1}>
              <IconButton
                icon={<FaAngleRight size={16} />}
                size={'sm'}
                onClick={handleComment}
                isLoading={loading}
              ></IconButton>
            </InputRightElement>
          </InputGroup>
          <VStack mt={'4'} align={'start'}>
            {comments.length
              ? comments.map((comment) => (
                  <VStack align={'start'} spacing={'unset'} key={comment.id}>
                    <HStack alignItems={'start'}>
                      <Avatar
                        src={comment.owner.photo?.url}
                        name={comment.owner.firstName}
                        size={'xs'}
                      />
                      <VStack>
                        <HStack>
                          <Box fontSize={'sm'}>
                            <ReactMarkdown
                              components={ChakraUIRenderer({
                                p: ({ children }) => (
                                  <>
                                    <Text
                                      fontWeight={'bold'}
                                      mr={2}
                                      display={'inline'}
                                    >
                                      {comment.owner.username}
                                    </Text>
                                    {children}
                                  </>
                                ),
                              })}
                              children={comment.content}
                              remarkPlugins={[remarkGfm]}
                            ></ReactMarkdown>
                          </Box>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Box pl={'8'} fontSize={'xs'} color={'GrayText'}>
                      <ReactTimeAgo
                        date={new Date(comment.createdAt)}
                        timeStyle="twitter"
                      />
                    </Box>
                  </VStack>
                ))
              : !loading && <Text>Tidak ada komentar</Text>}
            <IconButton
              alignSelf={'center'}
              icon={<FaPlus />}
              onClick={() => getComments()}
              size={'sm'}
              isLoading={loading}
            />
            <HStack w={'full'} hidden={!loading}>
              <Box>
                <SkeletonCircle></SkeletonCircle>
              </Box>
              <SkeletonText noOfLines={2} w={'full'}></SkeletonText>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
