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
    
    const imageSlider = post.image_urls.length > 0 ?  (
        <Container sx={{ mt: 9, backgroundColor: '#eee', alignContent: 'center' }}>
            <Slider {...settings}>
                {post.image_urls.map((v: string, k) => (
                    <Box
                     key={k}
                     sx={{ height: 'calc(100vh - 200px - 30px)' }}
                    >
                        <img
                          key={k}
                          src={v}
                          srcSet={v}
                          alt={k.toString()}
                          loading="lazy"
                          height='100%'
                          width='100%'
                          style={{ objectFit: 'contain' }}
                        />
                    </Box>
                ))}
            </Slider>
        </Container>
    ) : '';

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