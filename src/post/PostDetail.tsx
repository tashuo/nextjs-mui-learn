import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PostInfo } from "../../lib/types";
import { Box, Container, Typography } from "@mui/material";
import Slider, { Settings } from "react-slick";

export default function PostDetail({ post }: { post: PostInfo }) {
    const contentMarginTop = post.image_urls.length > 0 ? 5 : 8;
    const settings: Settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // autoplay: true,
        centerMode: true,
        centerPadding: '100px',
        draggable: true,
        adaptiveHeight: true,
    };
    
    const imageSlider = post.image_urls.length > 0 ? (
        <Container 
            maxWidth="xl" 
            sx={{ 
                mt: { xs: 7, sm: 8, md: 9 },
                backgroundColor: 'transparent',
                p: { xs: 1, sm: 2 },
                position: 'relative',
                '& .slick-slide': {
                    opacity: 0.5,
                    transition: 'opacity 0.3s ease',
                },
                '& .slick-active': {
                    opacity: 1,
                },
            }}
        >
            <Slider {...settings}>
                {post.image_urls.map((v: string, k) => (
                    <Box
                        key={k}
                        sx={{ 
                            height: {
                                xs: 'calc(100vh - 300px)',
                                sm: 'calc(100vh - 250px)',
                                md: 'calc(100vh - 200px)'
                            },
                            transition: 'all 0.5s ease',
                            position: 'relative',
                            '&:hover': {
                                transform: 'scale(1.02)',
                            }
                        }}
                    >
                        <img
                            key={k}
                            src={v}
                            srcSet={v}
                            alt={k.toString()}
                            loading="lazy"
                            style={{ 
                                height: '100%',
                                width: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease-in-out',
                            }}
                        />
                        <Typography
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: 1,
                                fontSize: '0.875rem',
                                backdropFilter: 'blur(4px)',
                            }}
                        >
                            {`${k + 1} / ${post.image_urls.length}`}
                        </Typography>
                    </Box>
                ))}
            </Slider>
        </Container>
    ) : null;

    return (
        <Box>
            {imageSlider}
            <Box sx={{ mt: contentMarginTop, mx: 4.5, position: 'relative' }}>
                <Typography
                    variant="body1"
                    component="div"
                    py={2}
                >
                    {post.content}
                </Typography>
                <Typography
                    variant="body2"
                    component="div"
                    fontSize={12}
                    fontWeight={5}
                    pb={2}
                    sx={{ borderBottom: 1, borderBottomColor: '#eee' }}
                >
                    {post.created_at_friendly}
                </Typography>
            </Box>
        </Box>
    );
}