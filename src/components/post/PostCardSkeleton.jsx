import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from '@chakra-ui/react';

export default function PostCardSkeleton({ loader, posts, data, loading }) {
  return (
    <Card
      ref={loader}
      maxW="md"
      w={'full'}
      variant={'outline'}
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
          color={'GrayText'}
        />
        <Skeleton rounded={'md'}>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, ut?
            Eaque sed inventore amet, saepe porro et molestias laudantium quam
            accusantium natus iste ipsam sequi nisi voluptas veniam accusamus
            libero.
          </Text>
        </Skeleton>
      </CardBody>
    </Card>
  );
}
