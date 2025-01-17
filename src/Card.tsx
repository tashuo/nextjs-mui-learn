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
import { AddToPhotos, CollectionsBookmarkOutlined, Comment, FavoriteBorder, FavoriteOutlined, ModeCommentOutlined } from '@mui/icons-material';
import { Feed } from '../lib/types';
import PostSetting from './post/PostSetting';
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
    <Card 
      key={props.id} 
      className='mb-4 hover:shadow-lg transition-all duration-300 rounded-xl bg-white'
      onClick={handleCardClick}
      sx={{
        '&:hover': {
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardHeader
        className='px-4 py-3'
        avatar={props.user.avatar_url
            ? <Avatar 
                aria-label="recipe" 
                alt={props.user.username} 
                src={props.user.avatar_url} 
                onClick={AvatarClick}
                className='cursor-pointer transform transition-all duration-200'
                sx={{
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  }
                }}
              /> 
            : <Avatar 
                sx={{ 
                  bgcolor: deepOrange[500],
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                  }
                }} 
                aria-label="recipe" 
                onClick={AvatarClick}
                className='cursor-pointer transform transition-all duration-200'
              >
                {props.user.username.substring(props.user.username.length - 2)}
              </Avatar>
        }
        action={
          <div className='flex items-center'>
            <Typography className='text-xs text-gray-500 mr-2'>{props.created_at_friendly}</Typography>
            <IconButton 
              aria-label="settings" 
              className='transition-all duration-200'
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  transform: 'rotate(90deg)',
                }
              }}
              onClick={(e: React.MouseEvent<HTMLElement>) => { 
                e.stopPropagation(); 
                handleShowSetting(props.id)
              }}
            >
              <MoreVertIcon className='text-gray-600'/>
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
      <CardActions className='px-4 py-2 border-t border-gray-100'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center space-x-6'>
            <div className='flex items-center group'>
              <IconButton 
                aria-label="add to favorites"
                className='transition-all duration-200'
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(244,67,54,0.1)',
                    transform: 'scale(1.1)',
                  }
                }}
                onClick={handleLike}
              >
                {isLiked ? 
                  <FavoriteOutlined 
                    sx={{ 
                      color: pink[500],
                      animation: isLiked ? 'pulse 0.5s' : 'none',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.2)' },
                        '100%': { transform: 'scale(1)' },
                      },
                    }} 
                  /> : 
                  <FavoriteBorder 
                    className='text-gray-600 group-hover:text-pink-500 transition-colors duration-200' 
                  />
                }
              </IconButton>
              <Typography className='ml-1 text-sm text-gray-600 group-hover:text-pink-500 transition-colors duration-200'>
                {likeCount}
              </Typography>
            </div>

            <div className='flex items-center group'>
              <IconButton 
                aria-label="comment"
                className='transition-all duration-200'
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(33,150,243,0.1)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <ModeCommentOutlined className='text-gray-600 group-hover:text-blue-500 transition-colors duration-200' />
              </IconButton>
              <Typography className='ml-1 text-sm text-gray-600 group-hover:text-blue-500 transition-colors duration-200'>
                {props.comment_count}
              </Typography>
            </div>

            <div className='flex items-center group'>
              <IconButton 
                aria-label="collect"
                className='transition-all duration-200'
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,193,7,0.1)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <CollectionsBookmarkOutlined className='text-gray-600 group-hover:text-yellow-500 transition-colors duration-200' />
              </IconButton>
              <Typography className='ml-1 text-sm text-gray-600 group-hover:text-yellow-500 transition-colors duration-200'>
                {props.collect_count}
              </Typography>
            </div>
          </div>
        </div>
      </CardActions>
    </Card>
  );
}