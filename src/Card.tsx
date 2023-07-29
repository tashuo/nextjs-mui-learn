import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { deepOrange, pink, red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/router';
import { cancelLike, like } from '../api/post';
import { AddToPhotos, Comment } from '@mui/icons-material';
import { Feed } from '../lib/types';
import PostSetting from './PostSetting';
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const CardList = ({items}: {items: Feed[]}) => {
    const [showSetting, setShowSetting] = React.useState(false);
    const [postId, setPostId] = React.useState(0);
    const onSettingClick = (state: boolean, postId = 0) => {
      console.log(`setting: ${state}, ${postId}`);
      setShowSetting(state);
      postId && setPostId(postId);  // 此处如果设置postId=0，会将0传递至SnackBar组件中postId，组件将获取不到对应的postId
    }
    return (
        <>
            {items.map((feed: Feed) => {
                return <FeedCard key={feed.id} props={feed} settingClick={onSettingClick}/>
            })}
            <PostSetting currentState={showSetting} stateChange={onSettingClick} postId={postId} />
        </>
    );
};

export const FeedCard = ({ props, settingClick }: { props: Feed, settingClick: Function }) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = React.useState(props.isLiked);
  const [likeCount, setLikeCount] = React.useState(props.like_count);

  const AvatarClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    router.push(`/user/${props.user.id}`);
  }

  const handleLike = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    console.log(props);
    const response = isLiked ? await cancelLike(props.id) : await like(props.id);
    console.log(response.data);
    if (response.data) {
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);  // todo 应该同步接口的返回
      setIsLiked(!isLiked);
    }
  }

  const handleShowSetting = (postId: number) => {
    console.log('setting click');
    settingClick(true, postId);
  }

  const handleCardClick = () => {
    console.log('card click');
    router.push(`/post/${props.id}`, undefined, { shallow: true });
  }

  return (
    <Card key={props.id} className='mb-2' onClick={handleCardClick}>
      <CardHeader
        avatar={props.user.avatar_url
            ? <Avatar aria-label="recipe" alt={props.user.username} src={props.user.avatar_url} onClick={AvatarClick}></Avatar> 
            : <Avatar sx={{ bgcolor: deepOrange[500] }} aria-label="recipe" onClick={AvatarClick}>{props.user.username.substring(props.user.username.length - 2)}</Avatar>
        }
        action={
          <div className='flex'>
            <Typography className='mx-auto my-auto text-xs font-thin'>{props.created_at_friendly}</Typography>
            <IconButton aria-label="settings" onClick={(e: React.MouseEvent<HTMLElement>) => { e.stopPropagation(); handleShowSetting(props.id)}}>
              <MoreVertIcon/>
            </IconButton>
          </div>
        }
        title={props.user.username.substring(0, 15)}
        subheader="说"
      />
      {props.image_urls.length > 0 && <CardMedia
        component="img"
        image={props.image_urls[0]}
        alt="image"
        sx={{ height: 250 }}
      />}
      {props.content && <CardContent>
        <Typography variant="body2" color="text.secondary" className='line-clamp-3'>
          {props.id}|{props.content}
        </Typography>
      </CardContent>}
      <CardActions className='text-center'>
        <div className='flex px-2'>
          <IconButton aria-label="add to favorites" onClick={handleLike}>
            {isLiked ? <FavoriteIcon sx={{ color: pink[500] }} /> : <FavoriteIcon />}
          </IconButton>
          <Typography color="text.secondary" className='mx-auto my-auto'>{likeCount}</Typography>
        </div>
        <div className='flex px-2'>
          <IconButton aria-label="comment">
            <Comment />
          </IconButton>
          <Typography color="text.secondary" className='mx-auto my-auto'>{props.comment_count}</Typography>
        </div>
        <div className='flex px-2'>
          <IconButton aria-label="collect">
            <AddToPhotos />
          </IconButton>
          <Typography color="text.secondary" className='mx-auto my-auto'>{props.collect_count}</Typography>
        </div>
      </CardActions>
    </Card>
  );
}